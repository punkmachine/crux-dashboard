import { Chart } from "chart.js";

import type { Bin } from "../../../types/crux";
import type { CoreMetricName } from "../types";

import { formatMetricValue } from "../../../utils/formatters/metric-value";
import { getMetricDisplayName } from "../../../utils/formatters/metric-display-name";
import { getMetricUnit } from "../../../utils/formatters/metric-unit";
import { getMetricStatus } from "../../../utils/thresholds/metric-status";
import { getStatusColor } from "../../../utils/thresholds/status-color";

import { createChartConfig } from "./create-chart-config";

/**
 * Создает DOM-элемент для одной метрики с гистограммой.
 *
 * @param metricName - Название метрики
 * @param value - Значение метрики (p75)
 * @param histogram - Данные гистограммы
 * @returns DOM-элемент карточки метрики
 */
export function createMetricCard(
  metricName: CoreMetricName,
  value: number | null,
  histogram: Bin[] | null,
): HTMLElement {
  const card = document.createElement("div");
  card.className = "core-metric-card";

  const displayName = getMetricDisplayName(metricName);
  const unit = getMetricUnit(metricName);

  let status: "good" | "needs-improvement" | "poor" = "good";
  let formattedValue = "N/A";
  let statusColor = getStatusColor("good");

  if (value !== null && !isNaN(value)) {
    status = getMetricStatus(metricName, value);
    formattedValue = formatMetricValue(value, unit);
    statusColor = getStatusColor(status);
  }

  const header = document.createElement("div");
  header.className = "core-metric-card__header";

  const title = document.createElement("h3");
  title.className = "core-metric-card__title";
  title.textContent = displayName;

  const statusIndicator = document.createElement("div");
  statusIndicator.className = "core-metric-card__status";
  statusIndicator.style.backgroundColor = statusColor;

  header.appendChild(title);
  header.appendChild(statusIndicator);

  const valueDiv = document.createElement("div");
  valueDiv.className = "core-metric-card__value";
  valueDiv.textContent = formattedValue;

  card.appendChild(header);
  card.appendChild(valueDiv);

  if (histogram && histogram.length > 0) {
    const chartContainer = document.createElement("div");
    chartContainer.className = "core-metric-card__chart";

    const canvas = document.createElement("canvas");
    chartContainer.appendChild(canvas);
    card.appendChild(chartContainer);

    requestAnimationFrame(() => {
      try {
        if (!canvas.parentElement) {
          return;
        }

        const chartConfig = createChartConfig(histogram, metricName);
        new Chart(canvas, chartConfig);
      } catch (error) {
        console.error(`Error creating chart for ${metricName}:`, error);
      }
    });
  }

  return card;
}
