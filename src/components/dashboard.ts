import type { CruxResponse } from "../types/crux";
import { showError } from "../utils/ui";
import { renderCoreMetrics } from "./core-metrics/main";
import { renderPerformanceMetrics } from "./performance-metrics/main";

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

  container.appendChild(resultsContainer);
}
