import { Chart } from "chart.js";
import type { MetricName } from "../types/crux.js";
import type { MetricEntity } from "../types/metric.js";
import type { Fractions } from "../types/crux.js";
import { getMetricDisplayName } from "../utils/formatters/metric-display-name.js";
import { getMetricUnit } from "../utils/formatters/metric-unit.js";

export type ChartType = "line" | "pie";

export interface ChartDataPoint {
  date: Date;
  value: number;
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
 * Извлекает данные fractions из метрики.
 */
function extractFractions(metricValue: any): Fractions | null {
  if ("fractions" in metricValue && metricValue.fractions) {
    return metricValue.fractions;
  }

  return null;
}

/**
 * Определяет тип графика для метрики.
 */
export function getChartType(metricName: MetricName): ChartType {
  const pieChartMetrics: MetricName[] = [
    "form_factors",
    "navigation_types",
    "largest_contentful_paint_resource_type",
  ];

  return pieChartMetrics.includes(metricName) ? "pie" : "line";
}

/**
 * Преобразует данные метрик в точки для line chart.
 */
function prepareLineChartData(
  metrics: MetricEntity[],
  metricName: MetricName,
): ChartDataPoint[] {
  const points: ChartDataPoint[] = [];

  for (const metric of metrics) {
    const cruxData = metric.cruxData as {
      record?: { metrics?: Record<string, unknown> };
    };

    const metricValue = cruxData.record?.metrics?.[metricName];
    if (!metricValue) {
      continue;
    }

    const p75 = extractP75Value(metricValue);
    if (p75 === null) {
      continue;
    }

    const date = new Date(metric.collectionPeriodStart);
    points.push({ date, value: p75 });
  }

  return points.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Преобразует данные метрик в fractions для pie chart.
 */
function preparePieChartData(
  metrics: MetricEntity[],
  metricName: MetricName,
): Fractions | null {
  // Берем последнюю запись
  if (metrics.length === 0) {
    return null;
  }

  const lastMetric = metrics[metrics.length - 1];
  const cruxData = lastMetric.cruxData as {
    record?: { metrics?: Record<string, unknown> };
  };

  const metricValue = cruxData.record?.metrics?.[metricName];
  if (!metricValue) {
    return null;
  }

  return extractFractions(metricValue);
}

/**
 * Форматирует дату для отображения на графике.
 */
function formatDateForChart(
  date: Date,
  groupBy: "day" | "week" | "month",
): string {
  if (groupBy === "month") {
    return date.toLocaleDateString("ru-RU", {
      month: "short",
      year: "numeric",
    });
  }
  if (groupBy === "week") {
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  }
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

/**
 * Создает конфигурацию для line chart.
 */
function createLineChartConfig(
  dataPoints: ChartDataPoint[],
  metricName: MetricName,
  groupBy: "day" | "week" | "month",
): any {
  const unit = getMetricUnit(metricName);
  const displayName = getMetricDisplayName(metricName);

  const labels = dataPoints.map((point) =>
    formatDateForChart(point.date, groupBy),
  );
  const data = dataPoints.map((point) => point.value);

  return {
    type: "line" as const,
    data: {
      labels,
      datasets: [
        {
          label: displayName,
          data,
          borderColor: "#1a73e8",
          backgroundColor: "rgba(26, 115, 232, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
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
              const value = context.parsed.y;
              if (unit === "ms") {
                return `${displayName}: ${Math.round(value).toLocaleString()} ${unit}`;
              }
              if (unit === "%") {
                return `${displayName}: ${(value * 100).toFixed(1)}%`;
              }
              return `${displayName}: ${value.toFixed(2)}${unit ? ` ${unit}` : ""}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => {
              if (unit === "ms") {
                return `${value} ${unit}`;
              }
              if (unit === "%") {
                return `${(value * 100).toFixed(0)}%`;
              }
              return value;
            },
          },
        },
      },
    },
  };
}

/**
 * Создает конфигурацию для pie chart.
 */
function createPieChartConfig(
  fractions: Fractions,
  metricName: MetricName,
): any {
  const labels: string[] = [];
  const data: number[] = [];
  const backgroundColor: string[] = [];
  const borderColor: string[] = [];

  // Цвета для различных типов метрик
  const colorMap: Record<string, Record<string, string>> = {
    form_factors: {
      phone: "#1a73e8",
      tablet: "#34a853",
      desktop: "#fbbc04",
    },
    navigation_types: {
      navigate: "#1a73e8",
      reload: "#34a853",
      "back-forward": "#fbbc04",
      prerender: "#ea4335",
    },
    largest_contentful_paint_resource_type: {
      image: "#1a73e8",
      video: "#34a853",
      text: "#fbbc04",
      svg: "#ea4335",
    },
  };

  const labelMap: Record<string, Record<string, string>> = {
    form_factors: {
      phone: "Мобильные",
      tablet: "Планшеты",
      desktop: "Десктопы",
    },
    navigation_types: {
      navigate: "Навигация",
      reload: "Перезагрузка",
      "back-forward": "Назад/Вперед",
      prerender: "Предзагрузка",
    },
    largest_contentful_paint_resource_type: {
      image: "Изображение",
      video: "Видео",
      text: "Текст",
      svg: "SVG",
    },
  };

  const colors = colorMap[metricName] || {};
  const labelsMap = labelMap[metricName] || {};

  const sortedKeys = Object.keys(fractions).sort();

  for (const key of sortedKeys) {
    const value = fractions[key];
    if (typeof value === "number" && value > 0) {
      labels.push(labelsMap[key] || key);
      data.push(Math.round(value * 100 * 10) / 10); // Преобразуем в проценты и округляем до 1 знака
      backgroundColor.push(colors[key] || "#5f6368");
      borderColor.push("#ffffff");
    }
  }

  return {
    type: "pie" as const,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            padding: 15,
            font: {
              size: 12,
            },
            usePointStyle: true,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context: any) => {
              const label = context.label || "";
              const value = context.parsed || 0;
              return `${label}: ${value.toFixed(1)}%`;
            },
          },
        },
      },
    },
  };
}

/**
 * Создает график метрики.
 *
 * @param container - Контейнер для графика
 * @param metrics - Массив метрик из API
 * @param metricName - Название метрики
 * @param groupBy - Группировка данных
 * @returns Экземпляр Chart.js или null
 */
export function createMetricChart(
  container: HTMLElement,
  metrics: MetricEntity[],
  metricName: MetricName,
  groupBy: "day" | "week" | "month",
): Chart | null {
  const chartType = getChartType(metricName);

  // Очищаем контейнер
  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);

  try {
    let chartConfig: any;

    if (chartType === "line") {
      const dataPoints = prepareLineChartData(metrics, metricName);
      if (dataPoints.length === 0) {
        return null;
      }
      chartConfig = createLineChartConfig(dataPoints, metricName, groupBy);
    } else {
      const fractions = preparePieChartData(metrics, metricName);
      if (!fractions || Object.keys(fractions).length === 0) {
        return null;
      }
      chartConfig = createPieChartConfig(fractions, metricName);
    }

    return new Chart(canvas, chartConfig);
  } catch (error) {
    console.error(`Error creating chart for ${metricName}:`, error);
    return null;
  }
}
