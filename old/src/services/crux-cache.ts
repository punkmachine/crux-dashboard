import type { CruxResponse, FormFactor } from "../types/crux";
import { fetchCruxData } from "./crux-api";

/**
 * Кэш ответов API по ключу (url + formFactor).
 * Ключ формируется как: `${url}::${formFactor || 'ALL'}`.
 */
const cache = new Map<string, CruxResponse>();

/**
 * Формирует ключ кэша на основе URL и типа устройства.
 *
 * @param url - URL или origin сайта
 * @param formFactor - Опциональный тип устройства
 * @returns Ключ для кэша
 */
function getCacheKey(url: string, formFactor?: FormFactor): string {
  return `${url}::${formFactor || "ALL"}`;
}

/**
 * Получает данные из кэша или делает запрос к API.
 * Компоненты вызывают эту функцию — она сама решает,
 * нужен ли реальный запрос или данные уже есть в кэше.
 *
 * @param url - URL или origin сайта для анализа
 * @param formFactor - Опциональный тип устройства для фильтрации данных
 * @returns Промис с данными CrUX API
 */
export async function getCruxData(
  url: string,
  formFactor?: FormFactor,
): Promise<CruxResponse> {
  const key = getCacheKey(url, formFactor);

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const data = await fetchCruxData(url, formFactor);
  cache.set(key, data);
  return data;
}

/**
 * Очищает кэш (например, при новом запросе).
 * Полезно для сброса данных при переходе в обычный режим.
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Предзагружает данные для нескольких URL параллельно.
 * Полезно для режима сравнения — запускаем оба запроса сразу.
 *
 * @param urls - Массив объектов с URL и опциональным formFactor
 * @returns Промис, который разрешается после загрузки всех данных
 */
export async function prefetchCruxData(
  urls: Array<{ url: string; formFactor?: FormFactor }>,
): Promise<void> {
  await Promise.all(
    urls.map(({ url, formFactor }) => getCruxData(url, formFactor)),
  );
}
