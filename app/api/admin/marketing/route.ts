import clientBackend from "@/sanity/lib/clientBackend";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_ACCESS_QUERY = `*[_type == "adminAccess"][0].emails`;

async function getAllowedAdminEmails(): Promise<string[]> {
  try {
    const result = await clientBackend.fetch<{ emails?: string[] } | string[] | null>(ADMIN_ACCESS_QUERY);
    let emails: string[] = [];
    if (Array.isArray(result)) {
      emails = result;
    } else if (result && typeof result === "object" && "emails" in result) {
      emails = result.emails || [];
    }
    return Array.isArray(emails) ? emails.filter((e) => typeof e === "string" && e.includes("@")) : [];
  } catch (error) {
    console.error("Error fetching admin emails:", error);
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

    // Fetch all contacts that are subscribed
    const contacts = await clientBackend.fetch<Array<{
      _id: string;
      _createdAt: string;
      email: string;
      name?: string;
      source?: string;
      subscribed?: boolean;
    }>>(
      `*[_type == "contact" && subscribed == true] | order(_createdAt desc) {
        _id,
        _createdAt,
        email,
        name,
        source
      }`
    );

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching marketing subscribers:", error);
    return NextResponse.json(
      { message: "Error fetching subscribers" },
      { status: 500 }
    );
  }
}
