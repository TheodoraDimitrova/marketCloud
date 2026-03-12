import clientBackend from "@/sanity/lib/clientBackend";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseServer } from "@/lib/supabase/server";

const ADMIN_ACCESS_QUERY = `*[_type == "adminAccess"][0].emails`;

async function getAllowedAdminEmails(): Promise<string[]> {
  try {
    const result = await clientBackend.fetch<{ emails?: string[] } | string[] | null>(ADMIN_ACCESS_QUERY);
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

    // Fetch all subscribed contacts from Supabase (public.contacts)
    const { data, error } = await supabaseServer
      .from("contacts")
      .select("id, created_at, email, name, source, subscribed")
      .eq("subscribed", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching marketing subscribers from Supabase:", error);
      return NextResponse.json(
        { message: "Error fetching subscribers" },
        { status: 500 }
      );
    }

    const contacts =
      data?.map((row) => ({
        _id: row.id as string,
        _createdAt: row.created_at as string,
        email: row.email as string,
        name: row.name ?? undefined,
        source: row.source ?? undefined,
        subscribed: row.subscribed ?? undefined,
      })) ?? [];

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching marketing subscribers:", error);
    return NextResponse.json(
      { message: "Error fetching subscribers" },
      { status: 500 }
    );
  }
}
