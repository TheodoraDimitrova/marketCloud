import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientBackend from "@/sanity/lib/clientBackend";
import { supabaseServer } from "@/lib/supabase/server";

const ADMIN_ACCESS_QUERY = `*[_type == "adminAccess"][0].emails`;

async function getAllowedAdminEmails(): Promise<string[]> {
  try {
    const emails = await clientBackend.fetch<string[]>(ADMIN_ACCESS_QUERY);
    return Array.isArray(emails) ? emails.filter((e) => typeof e === "string" && e.includes("@")) : [];
  } catch {
    return [];
  }
}

export async function GET(_req: NextRequest) {
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

    const { data: messages, error } = await supabaseServer
      .from("messages")
      .select(
        "id, created_at, contact_id, name, email, message, enquiry_type, order_number, status, admin_reply, replied_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages from Supabase:", error);
      return NextResponse.json(
        { message: "Error fetching messages" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      (messages || []).map((msg) => ({
        _id: msg.id as string,
        contactId: msg.contact_id ?? null,
        _createdAt: msg.created_at as string,
        name: msg.name,
        email: msg.email,
        message: msg.message,
        enquiryType: msg.enquiry_type ?? undefined,
        status: msg.status || "new",
        orderNumber: msg.order_number ?? undefined,
        adminReply: msg.admin_reply ?? undefined,
        repliedAt: msg.replied_at ?? undefined,
      }))
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Error fetching messages" },
      { status: 500 }
    );
  }
}
