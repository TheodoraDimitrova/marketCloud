import clientBackend from "@/sanity/lib/clientBackend";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_ACCESS_QUERY = `*[_type == "adminAccess"][0].emails`;

async function getAllowedAdminEmails(): Promise<string[]> {
  try {
    const emails = await clientBackend.fetch<string[]>(ADMIN_ACCESS_QUERY);
    return Array.isArray(emails) ? emails.filter((e) => typeof e === "string" && e.includes("@")) : [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email;
    
    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allowedEmails = await getAllowedAdminEmails();
    if (!allowedEmails.includes(email)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const messages = await clientBackend.fetch<Array<{
      _id: string;
      _createdAt: string;
      name?: string;
      email: string;
      message: string;
      enquiryType?: string;
      orderNumber?: string;
      status?: string;
      adminReply?: string;
      repliedAt?: string;
      contact?: {
        _ref: string;
      };
    }>>(
      `*[_type == "message"] | order(_createdAt desc) {
        _id,
        _createdAt,
        name,
        email,
        message,
        enquiryType,
        orderNumber,
        status,
        adminReply,
        repliedAt,
        contact {
          _ref
        }
      }`
    );

    return NextResponse.json(messages.map((msg) => ({
      _id: msg._id,
      contactId: msg.contact?._ref,
      _createdAt: msg._createdAt,
      name: msg.name,
      email: msg.email,
      message: msg.message,
      enquiryType: msg.enquiryType,
      status: msg.status || "new",
      orderNumber: msg.orderNumber,
      adminReply: msg.adminReply,
      repliedAt: msg.repliedAt,
    })));
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Error fetching messages" },
      { status: 500 }
    );
  }
}
