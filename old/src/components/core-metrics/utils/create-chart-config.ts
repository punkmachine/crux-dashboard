import type { Bin } from "../../../types/crux";
import type { CoreMetricName } from "../types";
import { groupBinsByZones } from "./group-bins";

/**
 * Создает Chart.js конфигурацию для горизонтального stacked bar chart по зонам.
 *
 * @param bins - Массив бинов гистограммы
 * @param metricName - Название метрики
 * @returns Конфигурация Chart.js
 */
export function createChartConfig(
  bins: Bin[],
  metricName: CoreMetricName,
): any {
  const zones = groupBinsByZones(bins, metricName);

  const colors = ["#34a853", "#fbbc04", "#ea4335"];

  return {
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
      indexAxis: "y",
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
}
