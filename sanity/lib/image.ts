import client from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

export function urlFor(source: { _type?: string; asset: { _ref: string } }) {
  return builder.image(source).url();
}
