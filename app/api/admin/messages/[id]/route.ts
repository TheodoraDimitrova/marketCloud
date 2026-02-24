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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    
    // Fetch message document directly
    const message = await clientBackend.fetch<{
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
    }>(
      `*[_type == "message" && _id == $id][0] {
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
      }`,
      { id }
    );

    if (!message) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    // Fetch contact to get subscribed status and all messages
    const contactId = message.contact?._ref;
    let contactData = null;
    let allMessages: Array<{ _id: string; _createdAt: string; message: string }> = [];

    if (contactId) {
      contactData = await clientBackend.fetch<{
        subscribed?: boolean;
        messages?: Array<{ _ref: string }>;
      }>(
        `*[_type == "contact" && _id == $id][0] {
          subscribed,
          messages[] { _ref }
        }`,
        { id: contactId }
      );

      // Fetch all messages from this contact
      if (contactData?.messages && contactData.messages.length > 0) {
        const messageIds = contactData.messages.map((m) => m._ref);
        allMessages = await clientBackend.fetch<Array<{ _id: string; _createdAt: string; message: string }>>(
          `*[_type == "message" && _id in $ids] | order(_createdAt desc) {
            _id,
            _createdAt,
            message
          }`,
          { ids: messageIds }
        );
      }
    }

    return NextResponse.json({
      _id: message._id,
      contactId: contactId,
      _createdAt: message._createdAt,
      name: message.name,
      email: message.email,
      message: message.message,
      enquiryType: message.enquiryType,
      status: message.status || "new",
      orderNumber: message.orderNumber,
      adminReply: message.adminReply,
      repliedAt: message.repliedAt,
      subscribed: contactData?.subscribed || false,
      allMessages: allMessages, // Include all messages for context
    });
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json(
      { message: "Error fetching message" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();
    const { status, adminReply } = body;

    const updates: Record<string, unknown> = {};
    
    if (status !== undefined) {
      updates.status = status;
    }
    
    if (adminReply !== undefined) {
      updates.adminReply = String(adminReply).trim();
      if (adminReply && adminReply.trim()) {
        updates.repliedAt = new Date().toISOString();
        if (!status || status === "new" || status === "read") {
          updates.status = "replied";
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "No updates provided" }, { status: 400 });
    }

    await clientBackend.patch(id).set(updates).commit();

    return NextResponse.json({ message: "Message updated successfully" });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { message: "Error updating message" },
      { status: 500 }
    );
  }
}
