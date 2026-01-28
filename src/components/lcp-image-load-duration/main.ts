import { renderLcpImageLoadDuration as renderLcpImageLoadDurationInternal } from "./render-lcp-image-load-duration";
import type { CruxResponse } from "../../types/crux";

/**
 * Рендерит блок с метрикой LCP Image Load Duration.
 *
 * @param data - Ответ от CrUX API с данными о метриках производительности
 * @returns DOM-элемент контейнера с метрикой или null, если данные недоступны
 */
export function renderLcpImageLoadDuration(
  data: CruxResponse,
): HTMLElement | null {
  return renderLcpImageLoadDurationInternal(data);
}
