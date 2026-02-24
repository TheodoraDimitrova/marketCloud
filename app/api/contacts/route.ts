import clientBackend from "@/sanity/lib/clientBackend";
import { NextRequest, NextResponse } from "next/server";

type ContactSource = "newsletter" | "contact";

type ContactBody = {
  source: ContactSource;
  email: string;
  name?: string;
  message?: string;
  enquiryType?: string;
  subscribed?: boolean;
  orderNumber?: string;
};

const EXISTING_CONTACTS_QUERY = `*[_type == "contact"] { _id, email, source, subscribed }`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactBody;
    const { source, email, name, message, enquiryType, subscribed, orderNumber } = body;
    const emailTrimmed = typeof email === "string" ? email.trim().toLowerCase() : "";

    console.log("Contact API - Received data:", { source, email: emailTrimmed, name, hasMessage: !!message });

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

    // Check for existing contact by email
    const allContacts = await clientBackend.fetch<Array<{ _id: string; email: string; source?: string; subscribed?: boolean }>>(
      EXISTING_CONTACTS_QUERY
    );
    
    const existing = allContacts.find(
      (c) => c.email && c.email.trim().toLowerCase() === emailTrimmed
    );

    if (source === "newsletter") {
      if (existing) {
        if (existing.source === "newsletter") {
          if (!existing.subscribed) {
            await clientBackend.patch(existing._id).set({ subscribed: true }).commit();
          }
          return NextResponse.json({ message: "Already subscribed" });
        }
        if (existing.source === "order" || existing.source === "contact") {
          await clientBackend.patch(existing._id).set({ subscribed: true, source: "newsletter" }).commit();
          return NextResponse.json({ message: "Subscribed successfully" });
        }
      }
      // Create new newsletter subscription if no existing contact
      const doc: Record<string, unknown> = {
        _type: "contact",
        source: "newsletter",
        email: emailTrimmed,
        subscribed: true,
      };
      await clientBackend.create(doc);
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
        contactId = existing._id;
        
        // Update name if not already set
        if (name !== undefined && name.trim()) {
          const currentName = await clientBackend.fetch<string | undefined>(
            `*[_type == "contact" && _id == $id][0].name`,
            { id: existing._id }
          );
          if (!currentName || !currentName.trim()) {
            await clientBackend.patch(existing._id).set({ name: String(name).trim() }).commit();
          }
        }
        
        // Update subscribed status
        if (subscribed !== undefined) {
          await clientBackend.patch(existing._id).set({ subscribed: Boolean(subscribed) }).commit();
        }
      } else {
        // Create new contact for contact form submission
        const contactDoc: Record<string, unknown> = {
          _type: "contact",
          source: "contact",
          email: emailTrimmed,
        };
        
        if (name !== undefined && name.trim()) contactDoc.name = String(name).trim();
        contactDoc.subscribed = Boolean(subscribed);
        
        const createdContact = await clientBackend.create(contactDoc);
        contactId = createdContact._id;
        console.log("Contact API - Created new contact:", contactId);
      }

      // Create message document
      const messageDoc: Record<string, unknown> = {
        _type: "message",
        contact: {
          _type: "reference",
          _ref: contactId,
        },
        email: emailTrimmed,
        message: String(message).trim(),
        status: "new",
      };

      if (name !== undefined && name.trim()) {
        messageDoc.name = String(name).trim();
      }
      if (enquiryType !== undefined && enquiryType.trim()) {
        messageDoc.enquiryType = String(enquiryType).trim();
      }
      if (orderNumber !== undefined && orderNumber.trim()) {
        messageDoc.orderNumber = String(orderNumber).trim();
      }

      const createdMessage = await clientBackend.create(messageDoc);
      console.log("Contact API - Created message:", createdMessage._id);

      // Add message reference to contact's messages array
      const existingMessages = await clientBackend.fetch<Array<{ _ref: string }>>(
        `*[_type == "contact" && _id == $id][0].messages[] { _ref }`,
        { id: contactId }
      );
      
      const messageRefs = (existingMessages || []).map((m) => ({
        _type: "reference" as const,
        _ref: m._ref,
        _key: `message-${m._ref}`,
      }));
      
      messageRefs.push({
        _type: "reference" as const,
        _ref: createdMessage._id,
        _key: `message-${createdMessage._id}`,
      });

      await clientBackend.patch(contactId).set({ messages: messageRefs }).commit();

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
