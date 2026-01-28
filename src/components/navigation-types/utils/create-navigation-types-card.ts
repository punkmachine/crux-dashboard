import { Chart } from "chart.js";

import type { Fractions } from "../../../types/crux";
import { getMetricDisplayName } from "../../../utils/formatters/metric-display-name";
import { createNavigationTypesPieChartConfig } from "./create-pie-chart-config";

/**
 * Создает DOM-элемент для метрики типов навигации с круговой диаграммой.
 *
 * @param fractions - Данные fractions с распределением типов навигации
 * @returns DOM-элемент карточки метрики
 */
export function createNavigationTypesCard(fractions: Fractions): HTMLElement {
  const card = document.createElement("div");
  card.className = "distribution-card";

  const displayName = getMetricDisplayName("navigation_types");

  const header = document.createElement("div");
  header.className = "distribution-card__header";

  const title = document.createElement("h3");
  title.className = "distribution-card__title";
  title.textContent = displayName;

  header.appendChild(title);
  card.appendChild(header);

  const chartContainer = document.createElement("div");
  chartContainer.className = "distribution-card__chart";

  const canvas = document.createElement("canvas");
  chartContainer.appendChild(canvas);
  card.appendChild(chartContainer);

  requestAnimationFrame(() => {
    try {
      if (!canvas.parentElement) {
        return;
      }

      const chartConfig = createNavigationTypesPieChartConfig(fractions);
      new Chart(canvas, chartConfig);
    } catch (error) {
      console.error("Error creating navigation types chart:", error);
    }
  });

  return card;
}
