import type { CruxResponse } from "../types/crux";
import { showError } from "../utils/ui";
import { renderCoreMetrics } from "./core-metrics/main";
import { renderPerformanceMetrics } from "./performance-metrics/main";
import { renderFormFactors } from "./form-factors/main";
import { renderNavigationTypes } from "./navigation-types/main";
import { renderLcpResourceType } from "./lcp-resource-type/main";
import { renderLcpImageTtfb } from "./lcp-image-ttfb/main";
import { renderLcpImageLoadDelay } from "./lcp-image-load-delay/main";
import { renderLcpImageLoadDuration } from "./lcp-image-load-duration/main";
import { renderLcpImageRenderDelay } from "./lcp-image-render-delay/main";

/**
 * Очищает дашборд, удаляя контейнер с результатами из DOM.
 */
export function clearDashboard(): void {
  const resultsContainer = document.querySelector(".results");

  if (resultsContainer) {
    resultsContainer.remove();
  }
}

/**
 * Рендерит дашборд с данными из CrUX API.
 * Очищает предыдущие результаты, обрабатывает ошибки и отображает метрики.
 *
 * @param data - Ответ от CrUX API с данными о метриках производительности.
 * @param container - Контейнер, в который будет отрендерен дашборд.
 */
export function renderDashboard(
  data: CruxResponse,
  container: HTMLElement,
): void {
  clearDashboard();

  if (data.error) {
    showError(`Ошибка API: ${data.error.message}`, container);
    return;
  }

  if (!data.record) {
    showError("Данные не найдены для указанного URL/Origin", container);
    return;
  }

  const resultsContainer = document.createElement("div");
  resultsContainer.className = "results";

  const header = document.createElement("div");
  header.className = "results__header";

  const title = document.createElement("h2");
  title.textContent =
    data.record.key.url || data.record.key.origin || "Результаты";

  if (data.record.collectionPeriod) {
    const period = document.createElement("p");
    period.className = "results__period";
    const firstDate = new Date(
      data.record.collectionPeriod.firstDate.year,
      data.record.collectionPeriod.firstDate.month - 1,
      data.record.collectionPeriod.firstDate.day,
    );
    const lastDate = new Date(
      data.record.collectionPeriod.lastDate.year,
      data.record.collectionPeriod.lastDate.month - 1,
      data.record.collectionPeriod.lastDate.day,
    );
    period.textContent = `Период сбора данных: ${firstDate.toLocaleDateString("ru-RU")} - ${lastDate.toLocaleDateString("ru-RU")}`;
    header.appendChild(period);
  }

  header.appendChild(title);
  resultsContainer.appendChild(header);

  // Рендерим блок с основными метриками (LCP, INP, CLS)
  const coreMetricsElement = renderCoreMetrics(data);
  if (coreMetricsElement) {
    resultsContainer.appendChild(coreMetricsElement);
  }

  // Рендерим блок с метриками производительности (FCP, TTFB, RTT)
  const performanceMetricsElement = renderPerformanceMetrics(data);
  if (performanceMetricsElement) {
    resultsContainer.appendChild(performanceMetricsElement);
  }

  // Рендерим блок с распределительными метриками (Form Factors и Navigation Types)
  const formFactorsElement = renderFormFactors(data);
  const navigationTypesElement = renderNavigationTypes(data);

  if (formFactorsElement || navigationTypesElement) {
    const distributionContainer = document.createElement("div");
    distributionContainer.className = "distribution-metrics";

    if (formFactorsElement) {
      distributionContainer.appendChild(formFactorsElement);
    }

    if (navigationTypesElement) {
      distributionContainer.appendChild(navigationTypesElement);
    }

    resultsContainer.appendChild(distributionContainer);
  }

  // Рендерим блок с метриками детализации LCP
  const lcpResourceTypeElement = renderLcpResourceType(data);
  const lcpImageTtfbElement = renderLcpImageTtfb(data);
  const lcpImageLoadDelayElement = renderLcpImageLoadDelay(data);
  const lcpImageLoadDurationElement = renderLcpImageLoadDuration(data);
  const lcpImageRenderDelayElement = renderLcpImageRenderDelay(data);

  const lcpDetailElements = [
    lcpResourceTypeElement,
    lcpImageTtfbElement,
    lcpImageLoadDelayElement,
    lcpImageLoadDurationElement,
    lcpImageRenderDelayElement,
  ].filter((el) => el !== null) as HTMLElement[];

  if (lcpDetailElements.length > 0) {
    const lcpDetailsContainer = document.createElement("div");
    lcpDetailsContainer.className = "lcp-details";

    // Первая строка: первые 3 элемента
    const row1Elements = lcpDetailElements.slice(0, 3);
    row1Elements.forEach((el) => lcpDetailsContainer.appendChild(el));

    // Вторая строка: оставшиеся 2 элемента (центрированные)
    const row2Elements = lcpDetailElements.slice(3, 5);
    if (row2Elements.length === 2) {
      const row2Container = document.createElement("div");
      row2Container.className = "lcp-details__row-2";
      row2Elements.forEach((el) => row2Container.appendChild(el));
      lcpDetailsContainer.appendChild(row2Container);
    } else if (row2Elements.length === 1) {
      // Если только один элемент во второй строке, добавляем его напрямую
      lcpDetailsContainer.appendChild(row2Elements[0]);
    }

    resultsContainer.appendChild(lcpDetailsContainer);
  }

  container.appendChild(resultsContainer);
}
