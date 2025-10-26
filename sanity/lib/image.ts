import clientBackend from "./clientBackend";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(clientBackend);

export function urlFor(source: { _type?: string; asset: { _ref: string } }) {
  return builder.image(source).url();
}
