import { registerChartComponents } from "./chart-registration";
import { renderFormFactors as renderFormFactorsInternal } from "./render-form-factors";
import type { CruxResponse } from "../../types/crux";

/**
 * Инициализирует модуль form-factors и регистрирует необходимые компоненты Chart.js.
 */
function initFormFactors(): void {
  registerChartComponents();
}

/**
 * Рендерит блок с метрикой формфакторов.
 *
 * @param data - Ответ от CrUX API с данными о метриках
 * @returns DOM-элемент контейнера с метрикой или null, если данные недоступны
 */
export function renderFormFactors(data: CruxResponse): HTMLElement | null {
  return renderFormFactorsInternal(data);
}

initFormFactors();
