import type { Site, CreateSiteDto, UpdateSiteDto } from "../types/site.js";
import { fetchApi } from "../utils/api.js";

const API_BASE_URL = "/api/sites";

export async function getAllSites(): Promise<Site[]> {
  return fetchApi<Site[]>(API_BASE_URL);
}

export async function createSite(data: CreateSiteDto): Promise<Site> {
  return fetchApi<Site>(API_BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSite(
  id: string,
  data: UpdateSiteDto,
): Promise<Site> {
  return fetchApi<Site>(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
