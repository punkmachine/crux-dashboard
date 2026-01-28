import { renderLcpImageTtfb as renderLcpImageTtfbInternal } from "./render-lcp-image-ttfb";
import type { CruxResponse } from "../../types/crux";

/**
 * Рендерит блок с метрикой LCP Image TTFB.
 *
 * @param data - Ответ от CrUX API с данными о метриках производительности
 * @returns DOM-элемент контейнера с метрикой или null, если данные недоступны
 */
export function renderLcpImageTtfb(data: CruxResponse): HTMLElement | null {
  return renderLcpImageTtfbInternal(data);
}
