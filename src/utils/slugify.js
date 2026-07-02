export function slugify(title, eventDate) {
  const year = new Date(eventDate).getFullYear();

  return `${title}-${year}`
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}