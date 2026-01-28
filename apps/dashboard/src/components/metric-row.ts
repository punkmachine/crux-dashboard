import { Chart } from "chart.js";
import type { MetricName } from "../types/crux.js";
import type { MetricEntity } from "../types/metric.js";
import type { Period, GroupBy } from "../services/metrics.api.js";
import { getMetrics } from "../services/metrics.api.js";
import { createMetricCard, type MetricCardData } from "./metric-card.js";
import { createMetricChart } from "./metric-chart.js";
import {
  createChartControls,
  type ChartControlsState,
} from "./chart-controls.js";
import type { Bin } from "../types/crux.js";

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
 * Извлекает данные для карточки метрики из последней записи.
 */
function extractCardData(
  metrics: MetricEntity[],
  metricName: MetricName,
): MetricCardData | null {
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

  const value = extractP75Value(metricValue);
  const histogram = extractHistogram(metricValue);

  return {
    metricName,
    value,
    histogram,
  };
}

/**
 * Создает строку метрики с карточкой слева и графиком справа.
 *
 * @param siteId - ID сайта
 * @param metricName - Название метрики
 * @returns DOM-элемент строки метрики
 */
export async function createMetricRow(
  siteId: string,
  metricName: MetricName,
): Promise<HTMLElement> {
  const row = document.createElement("div");
  row.className = "metric-row";

  const cardContainer = document.createElement("div");
  cardContainer.className = "metric-row__card";

  const chartContainer = document.createElement("div");
  chartContainer.className = "metric-row__chart-container";

  const controlsContainer = document.createElement("div");
  controlsContainer.className = "metric-row__controls";

  row.appendChild(cardContainer);
  row.appendChild(chartContainer);

  let currentChart: Chart | null = null;
  let currentPeriod: Period = "1m";
  let currentGroupBy: GroupBy = "day";

  // Функция для загрузки и отображения данных
  async function loadAndRender() {
    try {
      const metrics = await getMetrics({
        siteId,
        metric: metricName,
        period: currentPeriod,
        groupBy: currentGroupBy,
      });

      // Обновляем карточку
      const cardData = extractCardData(metrics, metricName);
      cardContainer.innerHTML = "";
      if (cardData) {
        const card = createMetricCard(cardData);
        cardContainer.appendChild(card);
      } else {
        const noData = document.createElement("div");
        noData.className = "metric-row__no-data";
        noData.textContent = "Нет данных";
        cardContainer.appendChild(noData);
      }

      // Обновляем график
      if (currentChart) {
        currentChart.destroy();
        currentChart = null;
      }

      chartContainer.innerHTML = "";
      const chartInnerContainer = document.createElement("div");
      chartInnerContainer.className = "metric-chart";
      chartContainer.appendChild(chartInnerContainer);

      // Добавляем селекты перед графиком
      controlsContainer.innerHTML = "";
      const controls = createChartControls(
        { period: currentPeriod, groupBy: currentGroupBy },
        {
          onPeriodChange: (period) => {
            currentPeriod = period;
            loadAndRender();
          },
          onGroupByChange: (groupBy) => {
            currentGroupBy = groupBy;
            loadAndRender();
          },
        },
      );
      controlsContainer.appendChild(controls);
      chartContainer.insertBefore(controlsContainer, chartInnerContainer);

      currentChart = createMetricChart(
        chartInnerContainer,
        metrics,
        metricName,
        currentGroupBy,
      );

      if (!currentChart) {
        const noData = document.createElement("div");
        noData.className = "metric-row__no-data";
        noData.textContent = "Нет данных для графика";
        chartInnerContainer.appendChild(noData);
      }
    } catch (error) {
      console.error(`Error loading metrics for ${metricName}:`, error);
      cardContainer.innerHTML = "";
      chartContainer.innerHTML = "";
      const errorDiv = document.createElement("div");
      errorDiv.className = "metric-row__error";
      errorDiv.textContent = "Ошибка загрузки данных";
      row.appendChild(errorDiv);
    }
  }

  await loadAndRender();

  return row;
}
