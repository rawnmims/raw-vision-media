import { supabase } from "../services/supabase";
import { slugify } from "./slugify";

export async function generateUniqueSlug(title, eventDate, currentId = null) {
  const baseSlug = slugify(title, eventDate);
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    let query = supabase
      .from("events")
      .select("id")
      .eq("slug", slug);

    if (currentId) {
      query = query.neq("id", currentId);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data.length) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}