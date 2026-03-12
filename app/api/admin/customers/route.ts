import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { getAllowedAdminEmails } from "@/lib/adminAccess";

export async function GET(_req: NextRequest) {
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

    console.log("Customers API - Fetching contacts from Supabase...");
    const { data: contacts, error: contactsError } = await supabaseServer
      .from("contacts")
      .select("id, created_at, email, name, source, subscribed")
      .order("created_at", { ascending: false });

    if (contactsError) {
      console.error("Customers API - Supabase contacts error:", contactsError);
      return NextResponse.json(
        { message: "Error fetching customers" },
        { status: 500 }
      );
    }

    console.log(
      "Customers API - Found contacts in Supabase:",
      contacts?.length || 0
    );

    // Fetch order totals and message counts for each contact
    const contactsWithStats = await Promise.all(
      (contacts || []).map(async (contact) => {
        let ordersCount = 0;
        let totalSpent = 0;
        let messagesCount = 0;
        let reviewsCount = 0;

        // Aggregate orders by email (if present)
        if (contact.email) {
          try {
            const { data: orders, error: ordersError } = await supabaseServer
              .from("orders")
              .select("total_amount")
              .eq("contact", contact.email);

            if (ordersError) {
              console.error(
                `Error fetching orders for contact ${contact.id}:`,
                ordersError
              );
            } else if (orders) {
              ordersCount = orders.length;
              totalSpent = orders.reduce(
                (sum, o) => sum + (Number(o.total_amount) || 0),
                0
              );
            }
          } catch (orderError) {
            console.error(
              `Error fetching orders for contact ${contact.id}:`,
              orderError
            );
          }
        }

        // Count messages by email (if present)
        if (contact.email) {
          try {
            const { data: msgs, error: msgsError } = await supabaseServer
              .from("messages")
              .select("id")
              .eq("email", contact.email);

            if (msgsError) {
              console.error(
                `Error fetching messages for contact ${contact.id}:`,
                msgsError
              );
            } else if (msgs) {
              messagesCount = msgs.length;
            }
          } catch (msgError) {
            console.error(
              `Error fetching messages for contact ${contact.id}:`,
              msgError
            );
          }
        }

        // Count reviews by email (if present)
        if (contact.email) {
          try {
            const { data: reviews, error: reviewsError } = await supabaseServer
              .from("product_reviews")
              .select("id")
              .eq("email", contact.email);

            if (reviewsError) {
              console.error(
                `Error fetching reviews for contact ${contact.id}:`,
                reviewsError
              );
            } else if (reviews) {
              reviewsCount = reviews.length;
            }
          } catch (revError) {
            console.error(
              `Error fetching reviews for contact ${contact.id}:`,
              revError
            );
          }
        }

        return {
          _id: contact.id as string,
          name: contact.name || "—",
          email: contact.email,
          source: contact.source,
          subscribed: contact.subscribed || false,
          ordersCount,
          messagesCount,
          reviewsCount,
          totalSpent,
          createdAt: contact.created_at,
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
