import type { CruxResponse } from "../../types/crux";
import type { Metric } from "../../types/crux";
import { METRIC_NAME } from "./constants";
import { extractP75Value } from "./utils/extract-p75";
import { createLcpImageTtfbCard } from "./utils/create-lcp-image-ttfb-card";

/**
 * Рендерит блок с метрикой LCP Image TTFB.
 *
 * @param data - Ответ от CrUX API с данными о метриках производительности
 * @returns DOM-элемент контейнера с метрикой или null, если данные недоступны
 */
export function renderLcpImageTtfb(data: CruxResponse): HTMLElement | null {
  if (data.error || !data.record) {
    return null;
  }

  const metrics = data.record.metrics;
  if (!metrics) {
    return null;
  }

  const metricValue = metrics[METRIC_NAME];
  if (!metricValue) {
    return null;
  }

  const p75Value = extractP75Value(metricValue);
  if (p75Value === null) {
    return null;
  }

  return createLcpImageTtfbCard(METRIC_NAME, p75Value);
}
