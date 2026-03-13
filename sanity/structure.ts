import type { StructureResolver } from "sanity/structure";

// Simple Studio structure: show all document types (products, categories, etc.)
export const structure: StructureResolver = (S) =>
  S.list().title("Content").items(S.documentTypeListItems());
