import { createCoreMetrics } from "./metrics/core-metrics.js";
import { createPerformanceMetrics } from "./metrics/performance-metrics.js";
import { createDistributionMetrics } from "./metrics/distribution-metrics.js";
import { createLcpDetailMetrics } from "./metrics/lcp-detail-metrics.js";

/**
 * Очищает дашборд.
 */
function clearDashboard(container: HTMLElement): void {
  const metricsContainer = container.querySelector(".dashboard__metrics");
  if (metricsContainer) {
    metricsContainer.innerHTML = "";
  }
}

/**
 * Показывает индикатор загрузки.
 */
function showLoading(container: HTMLElement): void {
  const loading = document.createElement("div");
  loading.className = "dashboard__loading";
  loading.textContent = "Загрузка данных...";
  container.appendChild(loading);
}

/**
 * Скрывает индикатор загрузки.
 */
function hideLoading(container: HTMLElement): void {
  const loading = container.querySelector(".dashboard__loading");
  if (loading) {
    loading.remove();
  }
}

/**
 * Показывает сообщение об ошибке.
 */
function showError(message: string, container: HTMLElement): void {
  const error = document.createElement("div");
  error.className = "dashboard__error";
  error.textContent = message;
  container.appendChild(error);
}

/**
 * Рендерит дашборд с метриками для выбранного сайта.
 *
 * @param siteId - ID сайта
 * @param container - Контейнер для дашборда
 */
export async function renderDashboard(
  siteId: string,
  container: HTMLElement,
): Promise<void> {
  clearDashboard(container);
  showLoading(container);

  try {
    const metricsContainer = document.createElement("div");
    metricsContainer.className = "dashboard__metrics";

    // Загружаем все группы метрик параллельно
    const [
      coreMetricsRows,
      performanceMetricsRows,
      distributionMetricsRows,
      lcpDetailMetricsRows,
    ] = await Promise.all([
      createCoreMetrics(siteId),
      createPerformanceMetrics(siteId),
      createDistributionMetrics(siteId),
      createLcpDetailMetrics(siteId),
    ]);

    hideLoading(container);

    // Добавляем секции с заголовками
    if (coreMetricsRows.length > 0) {
      const section = document.createElement("section");
      section.className = "dashboard__section";
      const title = document.createElement("h2");
      title.className = "dashboard__section-title";
      title.textContent = "Основные метрики";
      section.appendChild(title);
      coreMetricsRows.forEach((row) => section.appendChild(row));
      metricsContainer.appendChild(section);
    }

    if (performanceMetricsRows.length > 0) {
      const section = document.createElement("section");
      section.className = "dashboard__section";
      const title = document.createElement("h2");
      title.className = "dashboard__section-title";
      title.textContent = "Метрики производительности";
      section.appendChild(title);
      performanceMetricsRows.forEach((row) => section.appendChild(row));
      metricsContainer.appendChild(section);
    }

    if (distributionMetricsRows.length > 0) {
      const section = document.createElement("section");
      section.className = "dashboard__section";
      const title = document.createElement("h2");
      title.className = "dashboard__section-title";
      title.textContent = "Распределительные метрики";
      section.appendChild(title);
      distributionMetricsRows.forEach((row) => section.appendChild(row));
      metricsContainer.appendChild(section);
    }

    if (lcpDetailMetricsRows.length > 0) {
      const section = document.createElement("section");
      section.className = "dashboard__section";
      const title = document.createElement("h2");
      title.className = "dashboard__section-title";
      title.textContent = "Детальные метрики LCP";
      section.appendChild(title);
      lcpDetailMetricsRows.forEach((row) => section.appendChild(row));
      metricsContainer.appendChild(section);
    }

    container.appendChild(metricsContainer);
  } catch (error) {
    hideLoading(container);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Произошла ошибка при загрузке данных";
    showError(errorMessage, container);
  }
}
