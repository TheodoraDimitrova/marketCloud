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
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactBody;
    const { source, email, name, message, enquiryType, subscribed } = body;

    if (!source || !email || typeof email !== "string" || !email.includes("@")) {
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

    const doc: Record<string, unknown> = {
      _type: "contact",
      source,
      email: email.trim(),
    };

    if (source === "newsletter") {
      doc.subscribed = true;
    }

    if (source === "contact") {
      if (name !== undefined) doc.name = String(name).trim();
      if (message !== undefined) doc.message = String(message).trim();
      if (enquiryType !== undefined) doc.enquiryType = String(enquiryType).trim();
      doc.subscribed = Boolean(subscribed);
    }

    await clientBackend.create(doc);

    return NextResponse.json({ message: "Saved successfully" });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { message: "Error saving" },
      { status: 500 }
    );
  }
}
