import { CruxRequest, CruxResponse } from "../types/crux.js";
import { isOrigin } from "../utils/isOrigin.js";

const CRUX_API_URL =
  "https://chromeuxreport.googleapis.com/v1/records:queryRecord";

export class CruxApiService {
  private apiKey: string;

  constructor() {
    const apiKey = process.env.CRUX_API_KEY;
    if (!apiKey) {
      throw new Error(
        "CRUX_API_KEY не установлен. Установите переменную окружения CRUX_API_KEY.",
      );
    }
    this.apiKey = apiKey;
  }

  async fetchCruxData(origin: string): Promise<CruxResponse> {
    const requestBody: CruxRequest = {
      [isOrigin(origin) ? "origin" : "url"]: origin,
    };

    const response = await fetch(`${CRUX_API_URL}?key=${this.apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorResponse: CruxResponse;
      try {
        errorResponse = (await response.json()) as CruxResponse;
      } catch {
        errorResponse = {
          error: {
            code: response.status,
            message: response.statusText,
            status: "ERROR",
          },
        };
      }
      throw new Error(
        errorResponse.error?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return (await response.json()) as CruxResponse;
  }
}
