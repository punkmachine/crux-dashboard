import { registerChartComponents } from "./chart-registration";
import { renderCoreMetrics as renderCoreMetricsInternal } from "./render-core-metrics";
import type { CruxResponse } from "../../types/crux";

/**
 * Инициализирует модуль core-metrics и регистрирует необходимые компоненты Chart.js.
 */
function initCoreMetrics(): void {
  registerChartComponents();
}

/**
 * Рендерит блок с тремя основными метриками (LCP, INP, CLS).
 *
 * @param data - Ответ от CrUX API с данными о метриках производительности
 * @returns DOM-элемент контейнера с метриками или null, если данные недоступны
 */
export function renderCoreMetrics(data: CruxResponse): HTMLElement | null {
  return renderCoreMetricsInternal(data);
}

initCoreMetrics();
