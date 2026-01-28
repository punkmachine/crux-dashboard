import type { CruxResponse } from "../../types/crux";
import { FORM_FACTORS_METRIC } from "./constants";
import { extractFractions } from "./utils/extract-fractions";
import { createFormFactorsCard } from "./utils/create-form-factors-card";

/**
 * Рендерит блок с метрикой формфакторов.
 *
 * @param data - Ответ от CrUX API с данными о метриках
 * @returns DOM-элемент контейнера с метрикой или null, если данные недоступны
 */
export function renderFormFactors(data: CruxResponse): HTMLElement | null {
  if (data.error || !data.record) {
    return null;
  }

  const metrics = data.record.metrics;
  if (!metrics) {
    return null;
  }

  const metricValue = metrics[FORM_FACTORS_METRIC];
  if (!metricValue) {
    return null;
  }

  const fractions = extractFractions(metricValue);
  if (!fractions || Object.keys(fractions).length === 0) {
    return null;
  }

  const card = createFormFactorsCard(fractions);

  const container = document.createElement("div");
  container.className = "distribution-metric";
  container.appendChild(card);

  return container;
}
