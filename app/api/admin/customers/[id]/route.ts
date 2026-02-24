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
    
    const contact = await clientBackend.fetch<{
      _id: string;
      _createdAt: string;
      name?: string;
      email: string;
      source?: string;
      subscribed?: boolean;
      orders?: Array<{ _ref: string }>;
      messages?: Array<{ _ref: string }>;
      reviews?: Array<{ _ref: string }>;
    }>(
      `*[_type == "contact" && _id == $id][0] {
        _id,
        _createdAt,
        name,
        email,
        source,
        subscribed,
        orders[] { _ref },
        messages[] { _ref },
        reviews[] { _ref }
      }`,
      { id }
    );

    if (!contact) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    // Fetch orders
    const orders = contact.orders && contact.orders.length > 0
      ? await clientBackend.fetch<Array<{
          _id: string;
          orderNumber: string;
          _createdAt: string;
          totalAmount?: number;
          paymentStatus?: string;
          status?: string;
        }>>(
          `*[_type == "order" && _id in $ids] | order(_createdAt desc) {
            _id,
            orderNumber,
            _createdAt,
            totalAmount,
            paymentStatus,
            status
          }`,
          { ids: contact.orders.map((o) => o._ref) }
        )
      : [];

    // Fetch messages
    const messages = contact.messages && contact.messages.length > 0
      ? await clientBackend.fetch<Array<{
          _id: string;
          _createdAt: string;
          message: string;
          enquiryType?: string;
          status?: string;
        }>>(
          `*[_type == "message" && _id in $ids] | order(_createdAt desc) {
            _id,
            _createdAt,
            message,
            enquiryType,
            status
          }`,
          { ids: contact.messages.map((m) => m._ref) }
        )
      : [];

    // Fetch reviews
    const reviews = contact.reviews && contact.reviews.length > 0
      ? await clientBackend.fetch<Array<{
          _id: string;
          _createdAt: string;
          rating: number;
          comment: string;
          product?: { _ref: string };
        }>>(
          `*[_type == "review" && _id in $ids] | order(_createdAt desc) {
            _id,
            _createdAt,
            rating,
            comment,
            product { _ref }
          }`,
          { ids: contact.reviews.map((r) => r._ref) }
        )
      : [];

    return NextResponse.json({
      ...contact,
      orders,
      messages,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { message: "Error fetching customer" },
      { status: 500 }
    );
  }
}
