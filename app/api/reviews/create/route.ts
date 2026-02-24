import clientBackend from "@/sanity/lib/clientBackend";
import { NextRequest, NextResponse } from "next/server";

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

    const emailTrimmed = typeof email === "string" ? email.trim().toLowerCase() : "";

    const createdReview = await clientBackend.create({
      _type: "review",
      product: {
        _type: "reference",
        _ref: productId,
      },
      author: name,
      email: emailTrimmed,
      rating: Number(rating),
      comment: comment,
    });

    // Link review to contact if contact exists
    try {
      const allContacts = await clientBackend.fetch<Array<{ _id: string; email: string; reviews?: Array<{ _ref: string }> }>>(
        `*[_type == "contact" && email == $email] { _id, email, reviews[] { _ref } }`,
        { email: emailTrimmed }
      );
      
      const existingContact = allContacts.find(
        (c) => c.email && c.email.trim().toLowerCase() === emailTrimmed
      );

      if (existingContact) {
        const existingReviewRefs = (existingContact.reviews || []).map((r) => r._ref);
        if (!existingReviewRefs.includes(createdReview._id)) {
          const reviewRefs = existingReviewRefs.map((ref) => ({
            _type: "reference" as const,
            _ref: ref,
            _key: `review-${ref}`,
          }));
          reviewRefs.push({
            _type: "reference" as const,
            _ref: createdReview._id,
            _key: `review-${createdReview._id}`,
          });
          
          await clientBackend.patch(existingContact._id).set({ reviews: reviewRefs }).commit();
          
          // Update name if not already set
          const currentName = await clientBackend.fetch<string | undefined>(
            `*[_type == "contact" && _id == $id][0].name`,
            { id: existingContact._id }
          );
          if ((!currentName || !currentName.trim()) && name && name.trim()) {
            await clientBackend.patch(existingContact._id).set({ name: String(name).trim() }).commit();
          }
        }
      } else {
        // Create new contact for this review
        const doc: Record<string, unknown> = {
          _type: "contact",
          source: "order", // Using "order" as default, could be "review" if we add it
          email: emailTrimmed,
          name: String(name).trim(),
          reviews: [
            {
              _type: "reference",
              _ref: createdReview._id,
              _key: `review-${createdReview._id}`,
            },
          ],
        };
        await clientBackend.create(doc);
      }
    } catch (contactError) {
      console.error("Error linking review to contact:", contactError);
      // Don't fail the review creation if contact linking fails
    }

    return NextResponse.json({
      message: "Review created successfully",
      review: createdReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Error creating review", error },
      { status: 500 }
    );
  }
}
