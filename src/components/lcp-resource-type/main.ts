import { registerChartComponents } from "./chart-registration";
import { renderLcpResourceType as renderLcpResourceTypeInternal } from "./render-lcp-resource-type";
import type { CruxResponse } from "../../types/crux";

/**
 * Инициализирует модуль lcp-resource-type и регистрирует необходимые компоненты Chart.js.
 */
function initLcpResourceType(): void {
  registerChartComponents();
}

/**
 * Рендерит блок с метрикой типов ресурсов LCP.
 *
 * @param data - Ответ от CrUX API с данными о метриках производительности
 * @returns DOM-элемент контейнера с метрикой или null, если данные недоступны
 */
export function renderLcpResourceType(data: CruxResponse): HTMLElement | null {
  return renderLcpResourceTypeInternal(data);
}

initLcpResourceType();
