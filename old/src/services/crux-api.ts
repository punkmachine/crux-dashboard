import type { CruxRequest, CruxResponse, FormFactor } from "../types/crux";
import { isOrigin } from "../utils/isOrigin";

/**
 * URL эндпоинта CrUX API для запроса данных о производительности веб-сайтов.
 */
const CRUX_API_URL =
  "https://chromeuxreport.googleapis.com/v1/records:queryRecord";

/**
 * Запрашивает данные о производительности веб-сайта из CrUX API.
 *
 * Функция автоматически определяет, является ли переданная строка origin или полным URL,
 * и формирует соответствующий запрос к API. При необходимости можно указать тип устройства
 * для фильтрации данных.
 *
 * @param urlOrOrigin - URL страницы или origin сайта для анализа
 * @param formFactor - Опциональный тип устройства для фильтрации данных.
 *                    Может быть `"PHONE"`, `"TABLET"` или `"DESKTOP"`.
 *                    Если не указан, возвращаются агрегированные данные по всем устройствам.
 *
 * @returns Промис, который разрешается объектом `CruxResponse` с данными о производительности
 *
 * @throws {Error} Выбрасывает ошибку, если:
 *                 - Не установлен `VITE_CRUX_API_KEY` в переменных окружения
 *                 - Запрос к API завершился с ошибкой (HTTP статус не 200-299)
 */
export async function fetchCruxData(
  urlOrOrigin: string,
  formFactor?: FormFactor,
): Promise<CruxResponse> {
  const apiKey = import.meta.env.VITE_CRUX_API_KEY;

  if (!apiKey) {
    throw new Error(
      "VITE_CRUX_API_KEY не установлен. Создайте файл .env с вашим API ключом.",
    );
  }

  const requestBody: CruxRequest = {
    [isOrigin(urlOrOrigin) ? "origin" : "url"]: urlOrOrigin,
  };

  if (formFactor) {
    requestBody.formFactor = formFactor;
  }

  const response = await fetch(`${CRUX_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: {
        code: response.status,
        message: response.statusText,
        status: "ERROR",
      },
    }));
    throw new Error(
      error.error?.message || `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  return response.json();
}
