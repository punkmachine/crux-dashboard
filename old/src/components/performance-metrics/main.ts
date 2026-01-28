import { registerChartComponents } from "./chart-registration";
import { renderPerformanceMetrics as renderPerformanceMetricsInternal } from "./render-performance-metrics";
import type { CruxResponse } from "../../types/crux";

/**
 * Инициализирует модуль performance-metrics и регистрирует необходимые компоненты Chart.js.
 */
function initPerformanceMetrics(): void {
  registerChartComponents();
}

/**
 * Рендерит блок с метриками производительности (FCP, TTFB, RTT).
 *
 * @param data - Ответ от CrUX API с данными о метриках производительности
 * @returns DOM-элемент контейнера с метриками или null, если данные недоступны
 */
export function renderPerformanceMetrics(
  data: CruxResponse,
): HTMLElement | null {
  return renderPerformanceMetricsInternal(data);
}

initPerformanceMetrics();
