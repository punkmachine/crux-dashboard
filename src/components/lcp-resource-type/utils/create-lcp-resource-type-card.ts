import { Chart } from "chart.js";

import type { Fractions } from "../../../types/crux";
import { getMetricDisplayName } from "../../../utils/formatters/metric-display-name";
import { METRIC_NAME } from "../constants";
import { createLcpResourceTypePieChartConfig } from "./create-pie-chart-config";

/**
 * Создает DOM-элемент для метрики типов ресурсов LCP с круговой диаграммой.
 *
 * @param fractions - Данные fractions с распределением типов ресурсов
 * @returns DOM-элемент карточки метрики
 */
export function createLcpResourceTypeCard(fractions: Fractions): HTMLElement {
  const card = document.createElement("div");
  card.className = "lcp-detail-card";

  const displayName = getMetricDisplayName(METRIC_NAME);

  const header = document.createElement("div");
  header.className = "lcp-detail-card__header";

  const title = document.createElement("h3");
  title.className = "lcp-detail-card__title";
  title.textContent = displayName;

  header.appendChild(title);
  card.appendChild(header);

  const description = document.createElement("p");
  description.className = "lcp-detail-card__description";
  description.textContent =
    "Распределение типов ресурсов, которые становятся LCP-элементом (image, text, video и т.д.).";
  card.appendChild(description);

  const chartContainer = document.createElement("div");
  chartContainer.className = "lcp-detail-card__chart";

  const canvas = document.createElement("canvas");
  chartContainer.appendChild(canvas);
  card.appendChild(chartContainer);

  requestAnimationFrame(() => {
    try {
      if (!canvas.parentElement) {
        return;
      }

      const chartConfig = createLcpResourceTypePieChartConfig(fractions);
      new Chart(canvas, chartConfig);
    } catch (error) {
      console.error("Error creating LCP resource type chart:", error);
    }
  });

  return card;
}
