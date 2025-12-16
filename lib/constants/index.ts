export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Adora Cosmetics";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_NAME ||
  "Explore a luxurious collection of cosmetics, carefully curated to inspire and empower you to look and feel your best";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const COUNTRIES = [
  { value: "gr", code: "GR", label: "Greece" },
  { value: "bg", code: "BG", label: "Bulgaria" },
] as const;

// Free shipping threshold
export const FREE_SHIPPING_THRESHOLD = 60;
