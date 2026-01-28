import type { CruxResponse } from "../../types/crux";
import { NAVIGATION_TYPES_METRIC } from "./constants";
import { extractFractions } from "./utils/extract-fractions";
import { createNavigationTypesCard } from "./utils/create-navigation-types-card";

/**
 * Рендерит блок с метрикой типов навигации.
 *
 * @param data - Ответ от CrUX API с данными о метриках
 * @returns DOM-элемент контейнера с метрикой или null, если данные недоступны
 */
export function renderNavigationTypes(data: CruxResponse): HTMLElement | null {
  if (data.error || !data.record) {
    return null;
  }

  const metrics = data.record.metrics;
  if (!metrics) {
    return null;
  }

  const metricValue = metrics[NAVIGATION_TYPES_METRIC];
  if (!metricValue) {
    return null;
  }

  const fractions = extractFractions(metricValue);
  if (!fractions || Object.keys(fractions).length === 0) {
    return null;
  }

  const card = createNavigationTypesCard(fractions);

  const container = document.createElement("div");
  container.className = "distribution-metric";
  container.appendChild(card);

  return container;
}
