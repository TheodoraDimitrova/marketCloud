import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { getAllowedAdminEmails } from "@/lib/adminAccess";

export async function GET(
  _req: NextRequest,
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

    const { data: message, error } = await supabaseServer
      .from("messages")
      .select(
        "id, created_at, contact_id, name, email, message, enquiry_type, order_number, status, admin_reply, replied_at"
      )
      .eq("id", id)
      .single();

    if (error || !message) {
      if (error?.code === "PGRST116") {
        return NextResponse.json({ message: "Message not found" }, { status: 404 });
      }
      console.error("Error fetching message from Supabase:", error);
      return NextResponse.json(
        { message: "Error fetching message" },
        { status: 500 }
      );
    }

    const contactId = message.contact_id;
    let subscribed = false;
    let allMessages: Array<{ _id: string; _createdAt: string; message: string }> = [];

    if (contactId) {
      const { data: contact, error: contactError } = await supabaseServer
        .from("contacts")
        .select("subscribed, email")
        .eq("id", contactId)
        .single();

      if (!contactError && contact) {
        subscribed = Boolean(contact.subscribed);

        const { data: msgs, error: msgsError } = await supabaseServer
          .from("messages")
          .select("id, created_at, message")
          .eq("email", contact.email)
          .order("created_at", { ascending: false });

        if (!msgsError && msgs) {
          allMessages = msgs.map((m) => ({
            _id: m.id as string,
            _createdAt: m.created_at as string,
            message: m.message,
          }));
        }
      }
    }

    return NextResponse.json({
      _id: message.id as string,
      contactId,
      _createdAt: message.created_at as string,
      name: message.name,
      email: message.email,
      message: message.message,
      enquiryType: message.enquiry_type ?? undefined,
      status: message.status || "new",
      orderNumber: message.order_number ?? undefined,
      adminReply: message.admin_reply ?? undefined,
      repliedAt: message.replied_at ?? undefined,
      subscribed,
      allMessages,
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
    const { status, adminReply } = body as {
      status?: string;
      adminReply?: string;
    };

    const updates: Record<string, unknown> = {};

    if (status !== undefined) {
      updates.status = status;
    }

    if (adminReply !== undefined) {
      const trimmed = String(adminReply).trim();
      updates.admin_reply = trimmed;
      if (trimmed) {
        updates.replied_at = new Date().toISOString();
        if (!status || status === "new" || status === "read") {
          updates.status = "replied";
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "No updates provided" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseServer
      .from("messages")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      console.error("Error updating message in Supabase:", updateError);
      return NextResponse.json(
        { message: "Error updating message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Message updated successfully" });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { message: "Error updating message" },
      { status: 500 }
    );
  }
}
