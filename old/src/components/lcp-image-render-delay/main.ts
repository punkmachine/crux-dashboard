import { renderLcpImageRenderDelay as renderLcpImageRenderDelayInternal } from "./render-lcp-image-render-delay";
import type { CruxResponse } from "../../types/crux";

/**
 * Рендерит блок с метрикой LCP Image Render Delay.
 *
 * @param data - Ответ от CrUX API с данными о метриках производительности
 * @returns DOM-элемент контейнера с метрикой или null, если данные недоступны
 */
export function renderLcpImageRenderDelay(
  data: CruxResponse,
): HTMLElement | null {
  return renderLcpImageRenderDelayInternal(data);
}
