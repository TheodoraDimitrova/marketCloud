import { supabaseServer } from "@/lib/supabase/server";

export async function getAllowedAdminEmails(): Promise<string[]> {
  try {
    const { data, error } = await supabaseServer
      .from("admin_access")
      .select("email");

    if (error || !data) {
      console.error("Error fetching admin emails from Supabase:", error);
      return [];
    }

    return data
      .map((row) => row.email as string | null)
      .filter((e): e is string => typeof e === "string" && e.includes("@"));
  } catch (error) {
    console.error(
      "Unexpected error fetching admin emails from Supabase:",
      error,
    );
    return [];
  }
}
