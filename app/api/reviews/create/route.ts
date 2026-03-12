import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const reviewData = await req.json();
    const { productId, name, email, comment, rating } = reviewData;

    if (!productId || !name || !email || !comment || !rating) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const emailTrimmed =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    // Try to find existing contact in Supabase
    const { data: existingContact, error: contactError } = await supabaseServer
      .from("contacts")
      .select("id, name")
      .eq("email", emailTrimmed)
      .maybeSingle();

    if (contactError && contactError.code !== "PGRST116") {
      console.error("Error fetching contact for review:", contactError);
    }

    const contactId = existingContact?.id ?? null;

    const { data: inserted, error: insertError } = await supabaseServer
      .from("product_reviews")
      .insert({
        product_id: productId,
        contact_id: contactId,
        author: name,
        email: emailTrimmed,
        rating: Number(rating),
        comment: comment,
        status: "published",
      })
      .select("*")
      .limit(1);

    if (insertError || !inserted || inserted.length === 0) {
      console.error("Error creating review in Supabase:", insertError);
      return NextResponse.json(
        { message: "Error creating review" },
        { status: 500 }
      );
    }

    const created = inserted[0];

    // Optionally create contact if not existing
    if (!existingContact) {
      try {
        const { error: contactInsertError } = await supabaseServer
          .from("contacts")
          .insert({
            email: emailTrimmed,
            name: String(name).trim(),
            source: "review",
            subscribed: false,
          });

        if (contactInsertError) {
          console.error(
            "Error creating contact from review:",
            contactInsertError
          );
        }
      } catch (e) {
        console.error("Error creating contact from review:", e);
      }
    }

    return NextResponse.json({
      message: "Review created successfully",
      review: created,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Error creating review", error },
      { status: 500 }
    );
  }
}
