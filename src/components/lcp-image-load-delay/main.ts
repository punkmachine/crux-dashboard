import { renderLcpImageLoadDelay as renderLcpImageLoadDelayInternal } from "./render-lcp-image-load-delay";
import type { CruxResponse } from "../../types/crux";

/**
 * Рендерит блок с метрикой LCP Image Load Delay.
 *
 * @param data - Ответ от CrUX API с данными о метриках производительности
 * @returns DOM-элемент контейнера с метрикой или null, если данные недоступны
 */
export function renderLcpImageLoadDelay(
  data: CruxResponse,
): HTMLElement | null {
  return renderLcpImageLoadDelayInternal(data);
}
