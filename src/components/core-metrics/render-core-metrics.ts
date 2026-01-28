import type { CruxResponse } from "../../types/crux";
import type { Metric } from "../../types/crux";
import { CORE_METRICS } from "./constants";
import { extractP75Value } from "./utils/extract-p75";
import { extractHistogram } from "./utils/extract-histogram";
import { createMetricCard } from "./utils/create-metric-card";

/**
 * Создает массив DOM-элементов карточек для основных метрик.
 *
 * @param metrics - Объект с метриками из CrUX API
 * @returns Массив DOM-элементов карточек метрик
 */
function createMetricCards(metrics: Metric): HTMLElement[] {
  const cards: HTMLElement[] = [];

  for (const metricName of CORE_METRICS) {
    const metricValue = metrics[metricName];
    if (!metricValue) {
      continue;
    }

    const p75Value = extractP75Value(metricValue);
    const histogram = extractHistogram(metricValue);
    const card = createMetricCard(metricName, p75Value, histogram);
    cards.push(card);
  }

  return cards;
}

/**
 * Рендерит блок с тремя основными метриками (LCP, INP, CLS).
 *
 * @param data - Ответ от CrUX API с данными о метриках производительности
 * @returns DOM-элемент контейнера с метриками или null, если данные недоступны
 */
export function renderCoreMetrics(data: CruxResponse): HTMLElement | null {
  if (data.error || !data.record) {
    return null;
  }

  const metrics = data.record.metrics;
  if (!metrics) {
    return null;
  }

  const cards = createMetricCards(metrics);

  if (cards.length === 0) {
    return null;
  }

  const container = document.createElement("div");
  container.className = "core-metrics";

  cards.forEach((card) => container.appendChild(card));

  return container;
}
