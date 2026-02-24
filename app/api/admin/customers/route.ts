import clientBackend from "@/sanity/lib/clientBackend";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_ACCESS_QUERY = `*[_type == "adminAccess"][0].emails`;

async function getAllowedAdminEmails(): Promise<string[]> {
  try {
    const result = await clientBackend.fetch<{ emails?: string[] } | string[] | null>(ADMIN_ACCESS_QUERY);
    
    // Handle different response formats
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
    
    console.log("Customers API - Session:", { 
      hasSession: !!session, 
      email: email 
    });
    
    if (!email) {
      console.error("Customers API - No session");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allowedEmails = await getAllowedAdminEmails();
    console.log("Customers API - Allowed emails:", allowedEmails);
    
    if (!allowedEmails.includes(email)) {
      console.error("Customers API - Unauthorized:", { 
        email: email,
        allowedEmails: allowedEmails 
      });
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("Customers API - Fetching contacts...");
    const contacts = await clientBackend.fetch<Array<{
      _id: string;
      _createdAt: string;
      name?: string;
      email: string;
      source?: string;
      subscribed?: boolean;
      orders?: Array<{ _ref: string }>;
      messages?: Array<{ _ref: string }>;
      reviews?: Array<{ _ref: string }>;
    }>>(
      `*[_type == "contact"] | order(_createdAt desc) {
        _id,
        _createdAt,
        name,
        email,
        source,
        subscribed,
        orders[] { _ref },
        messages[] { _ref },
        reviews[] { _ref }
      }`
    );

    console.log("Customers API - Found contacts:", contacts.length);

    // Fetch order totals for each contact
    const contactsWithStats = await Promise.all(
      contacts.map(async (contact) => {
        let ordersCount = 0;
        let totalSpent = 0;

        if (contact.orders && contact.orders.length > 0) {
          try {
            const orderIds = contact.orders.map((o) => o._ref);
            const orders = await clientBackend.fetch<Array<{ totalAmount?: number }>>(
              `*[_type == "order" && _id in $ids] {
                totalAmount
              }`,
              { ids: orderIds }
            );
            ordersCount = orders.length;
            totalSpent = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
          } catch (orderError) {
            console.error(`Error fetching orders for contact ${contact._id}:`, orderError);
          }
        }

        return {
          _id: contact._id,
          name: contact.name || "—",
          email: contact.email,
          source: contact.source,
          subscribed: contact.subscribed || false,
          ordersCount,
          messagesCount: contact.messages?.length || 0,
          reviewsCount: contact.reviews?.length || 0,
          totalSpent,
          createdAt: contact._createdAt,
        };
      })
    );

    console.log("Customers API - Returning", contactsWithStats.length, "customers");
    return NextResponse.json(contactsWithStats);
  } catch (error) {
    console.error("Customers API - Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Customers API - Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { message: "Error fetching customers", error: errorMessage },
      { status: 500 }
    );
  }
}
