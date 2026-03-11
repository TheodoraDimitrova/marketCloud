import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      source: "newsletter" | "contact";
      email: string;
      name?: string;
      message?: string;
      enquiryType?: string;
      subscribed?: boolean;
      orderNumber?: string;
    };

    const { source, email, name, message, enquiryType, subscribed, orderNumber } =
      body;
    const emailTrimmed = typeof email === "string" ? email.trim().toLowerCase() : "";

    console.log("Contact API - Received data:", {
      source,
      email: emailTrimmed,
      name,
      hasMessage: !!message,
    });

    if (!source || !emailTrimmed || !emailTrimmed.includes("@")) {
      console.error("Contact API - Invalid request:", { source, email: emailTrimmed });
      return NextResponse.json(
        { message: "Invalid request: source and valid email required" },
        { status: 400 }
      );
    }

    if (source !== "newsletter" && source !== "contact") {
      return NextResponse.json(
        { message: "Invalid source: use 'newsletter' or 'contact'" },
        { status: 400 }
      );
    }

    // Check for existing contact by email in Supabase
    const { data: existing, error: existingError } = await supabaseServer
      .from("contacts")
      .select("id, email, source, subscribed, name, phone")
      .eq("email", emailTrimmed)
      .maybeSingle();

    if (existingError && existingError.code !== "PGRST116") {
      console.error("Contact API - Supabase contacts fetch error:", existingError);
      return NextResponse.json(
        { message: "Error checking existing contact" },
        { status: 500 }
      );
    }

    if (source === "newsletter") {
      if (existing) {
        if (existing.source === "newsletter" && existing.subscribed) {
          return NextResponse.json({ message: "Already subscribed" });
        }

        const { error: updateError } = await supabaseServer
          .from("contacts")
          .update({ subscribed: true, source: "newsletter" })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Contact API - Supabase newsletter update error:", updateError);
          return NextResponse.json(
            { message: "Error updating subscription" },
            { status: 500 }
          );
        }

        return NextResponse.json({ message: "Subscribed successfully" });
      }

      const { error: insertError } = await supabaseServer.from("contacts").insert({
        email: emailTrimmed,
        name: name && name.trim() ? name.trim() : null,
        source: "newsletter",
        subscribed: true,
      });

      if (insertError) {
        console.error("Contact API - Supabase newsletter insert error:", insertError);
        return NextResponse.json(
          { message: "Error subscribing" },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: "Subscribed successfully" });
    }

    // Handle contact form submission
    if (source === "contact") {
      if (!message || !message.trim()) {
        return NextResponse.json(
          { message: "Message is required" },
          { status: 400 }
        );
      }

      let contactId: string;

      if (existing) {
        contactId = existing.id as string;

        const updates: Record<string, unknown> = {};

        if (name !== undefined && name.trim() && !existing.name) {
          updates.name = String(name).trim();
        }
        if (subscribed !== undefined) {
          updates.subscribed = Boolean(subscribed);
        }

        if (Object.keys(updates).length > 0) {
          const { error: contactUpdateError } = await supabaseServer
            .from("contacts")
            .update(updates)
            .eq("id", existing.id);

          if (contactUpdateError) {
            console.error(
              "Contact API - Supabase contact update error:",
              contactUpdateError
            );
          }
        }
      } else {
        const { data: newContact, error: contactInsertError } = await supabaseServer
          .from("contacts")
          .insert({
            email: emailTrimmed,
            name: name && name.trim() ? name.trim() : null,
            phone: undefined,
            source: "contact",
            subscribed: Boolean(subscribed),
          })
          .select("id")
          .single();

        if (contactInsertError || !newContact) {
          console.error(
            "Contact API - Supabase contact create error:",
            contactInsertError
          );
          return NextResponse.json(
            { message: "Error saving contact" },
            { status: 500 }
          );
        }

        contactId = newContact.id as string;
        console.log("Contact API - Created new contact:", contactId);
      }

      // Create message row in Supabase
      const { error: messageInsertError } = await supabaseServer
        .from("messages")
        .insert({
          contact_id: contactId,
          email: emailTrimmed,
          name: name && name.trim() ? name.trim() : null,
          message: String(message).trim(),
          enquiry_type: enquiryType && enquiryType.trim() ? enquiryType.trim() : null,
          order_number:
            orderNumber && orderNumber.trim() ? orderNumber.trim() : null,
          status: "new",
        });

      if (messageInsertError) {
        console.error(
          "Contact API - Supabase message insert error:",
          messageInsertError
        );
        return NextResponse.json(
          { message: "Error saving message" },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: "Message saved successfully" });
    }

    return NextResponse.json(
      { message: "Invalid source" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Contact API - Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Contact API - Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { message: "Error saving", error: errorMessage },
      { status: 500 }
    );
  }
}
