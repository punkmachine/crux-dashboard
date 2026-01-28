import type { Site } from "../types/site.js";
import { fetchApi } from "../utils/api.js";

const API_BASE_URL = "/api/sites";

export async function getAllSites(): Promise<Site[]> {
  return fetchApi<Site[]>(API_BASE_URL);
}
