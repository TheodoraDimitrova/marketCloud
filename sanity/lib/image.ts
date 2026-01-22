import client from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "jpg" | "png";
}

export function urlFor(
  source: { _type?: string; asset: { _ref: string } },
  options?: ImageOptions
) {
  let imageBuilder = builder.image(source);

  if (options?.width) {
    imageBuilder = imageBuilder.width(options.width);
  }
  if (options?.height) {
    imageBuilder = imageBuilder.height(options.height);
  }
  if (options?.quality) {
    imageBuilder = imageBuilder.quality(options.quality);
  } else {
    // Default quality for better performance
    imageBuilder = imageBuilder.quality(85);
  }
  if (options?.format) {
    imageBuilder = imageBuilder.format(options.format);
  } else {
    // Default to webp for better compression
    imageBuilder = imageBuilder.format("webp");
  }

  return imageBuilder.url();
}
