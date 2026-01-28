import { Chart } from "chart.js";
import type { MetricName } from "../types/crux.js";
import type { Bin } from "../types/crux.js";
import { formatMetricValue } from "../utils/formatters/metric-value.js";
import { getMetricDisplayName } from "../utils/formatters/metric-display-name.js";
import { getMetricUnit } from "../utils/formatters/metric-unit.js";
import { getMetricStatus } from "../utils/thresholds/metric-status.js";
import { getStatusColor } from "../utils/thresholds/status-color.js";
import { groupBinsByZones } from "./utils/group-bins.js";

export interface MetricCardData {
  metricName: MetricName;
  value: number | null;
  histogram: Bin[] | null;
}

/**
 * Извлекает значение p75 из метрики.
 */
function extractP75Value(metricValue: any): number | null {
  if (!metricValue) {
    return null;
  }

  if (metricValue.percentiles?.p75 !== undefined) {
    const p75 = metricValue.percentiles.p75;
    return typeof p75 === "string" ? parseFloat(p75) : p75;
  }

  return null;
}

/**
 * Извлекает данные гистограммы из метрики.
 */
function extractHistogram(metricValue: any): Bin[] | null {
  if (!metricValue || !metricValue.histogram) {
    return null;
  }

  return Array.isArray(metricValue.histogram) ? metricValue.histogram : null;
}

/**
 * Создает DOM-элемент карточки метрики.
 *
 * @param data - Данные метрики
 * @returns DOM-элемент карточки
 */
export function createMetricCard(data: MetricCardData): HTMLElement {
  const card = document.createElement("div");
  card.className = "metric-card";

  const displayName = getMetricDisplayName(data.metricName);
  const unit = getMetricUnit(data.metricName);

  let status: "good" | "needs-improvement" | "poor" = "good";
  let formattedValue = "N/A";
  let statusColor = getStatusColor("good");

  if (data.value !== null && !isNaN(data.value)) {
    status = getMetricStatus(data.metricName, data.value);
    formattedValue = formatMetricValue(data.value, unit);
    statusColor = getStatusColor(status);
  }

  const header = document.createElement("div");
  header.className = "metric-card__header";

  const title = document.createElement("h3");
  title.className = "metric-card__title";
  title.textContent = displayName;

  const statusIndicator = document.createElement("div");
  statusIndicator.className = "metric-card__status";
  statusIndicator.style.backgroundColor = statusColor;

  header.appendChild(title);
  header.appendChild(statusIndicator);

  const valueDiv = document.createElement("div");
  valueDiv.className = "metric-card__value";
  valueDiv.textContent = formattedValue;

  card.appendChild(header);
  card.appendChild(valueDiv);

  if (data.histogram && data.histogram.length > 0) {
    const chartContainer = document.createElement("div");
    chartContainer.className = "metric-card__chart";

    const canvas = document.createElement("canvas");
    chartContainer.appendChild(canvas);
    card.appendChild(chartContainer);

    requestAnimationFrame(() => {
      try {
        if (!canvas.parentElement) {
          return;
        }

        const zones = groupBinsByZones(data.histogram, data.metricName);
        const colors = ["#34a853", "#fbbc04", "#ea4335"];

        const chartConfig = {
          type: "bar" as const,
          data: {
            labels: [""],
            datasets: [
              {
                label: "Хорошо",
                data: [zones.good],
                backgroundColor: colors[0],
                borderColor: colors[0],
                borderWidth: 0,
              },
              {
                label: "Нужно улучшить",
                data: [zones.needsImprovement],
                backgroundColor: colors[1],
                borderColor: colors[1],
                borderWidth: 0,
              },
              {
                label: "Плохо",
                data: [zones.poor],
                backgroundColor: colors[2],
                borderColor: colors[2],
                borderWidth: 0,
              },
            ],
          },
          options: {
            indexAxis: "y" as const,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: (context: any) => {
                    const datasetLabel = context.dataset.label || "";
                    const value = context.parsed.x;
                    return `${datasetLabel}: ${value.toFixed(1)}%`;
                  },
                },
              },
            },
            scales: {
              x: {
                stacked: true,
                display: false,
                max: 100,
                beginAtZero: true,
              },
              y: {
                stacked: true,
                display: false,
              },
            },
          },
        };

        new Chart(canvas, chartConfig);
      } catch (error) {
        console.error(`Error creating chart for ${data.metricName}:`, error);
      }
    });
  }

  return card;
}
