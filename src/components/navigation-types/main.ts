import { registerChartComponents } from "./chart-registration";
import { renderNavigationTypes as renderNavigationTypesInternal } from "./render-navigation-types";
import type { CruxResponse } from "../../types/crux";

/**
 * Инициализирует модуль navigation-types и регистрирует необходимые компоненты Chart.js.
 */
function initNavigationTypes(): void {
  registerChartComponents();
}

/**
 * Рендерит блок с метрикой типов навигации.
 *
 * @param data - Ответ от CrUX API с данными о метриках
 * @returns DOM-элемент контейнера с метрикой или null, если данные недоступны
 */
export function renderNavigationTypes(data: CruxResponse): HTMLElement | null {
  return renderNavigationTypesInternal(data);
}

initNavigationTypes();
