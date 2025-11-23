import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Public client for READ operations (with CDN caching)
const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion,
  useCdn: true,
});

export default client;
