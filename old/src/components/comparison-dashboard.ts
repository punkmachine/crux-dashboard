import type { CruxResponse } from "../types/crux";
import { renderDashboard } from "./dashboard";

interface ComparisonData {
  primary: CruxResponse;
  competitor: CruxResponse;
}

/**
 * Рендерит сравнительный дашборд с двумя колонками:
 * слева - основной сайт, справа - конкурент.
 * На мобильных устройствах колонки отображаются вертикально.
 *
 * @param data - Объект с данными для обоих сайтов
 * @param container - Контейнер, в который будет отрендерен дашборд
 */
export function renderComparisonDashboard(
  data: ComparisonData,
  container: HTMLElement,
): void {
  // Очищаем предыдущие результаты (как обычные, так и сравнительные)
  const existingComparison = container.querySelector(".comparison-container");
  if (existingComparison) {
    existingComparison.remove();
  }
  const existingResults = container.querySelector(".results");
  if (existingResults) {
    existingResults.remove();
  }

  const comparisonContainer = document.createElement("div");
  comparisonContainer.className = "comparison-container";

  // Колонка для основного сайта
  const primaryColumn = document.createElement("div");
  primaryColumn.className = "comparison-column comparison-column--primary";

  const primaryHeader = document.createElement("div");
  primaryHeader.className = "comparison-column__header";

  const primaryTitle = document.createElement("h2");
  primaryTitle.textContent = "Ваш сайт";

  const primaryUrl = document.createElement("p");
  primaryUrl.textContent =
    data.primary.record?.key.url ||
    data.primary.record?.key.origin ||
    "Неизвестный URL";

  primaryHeader.appendChild(primaryTitle);
  primaryHeader.appendChild(primaryUrl);
  primaryColumn.appendChild(primaryHeader);

  // Создаём контейнер для результатов основного сайта
  const primaryResultsContainer = document.createElement("div");
  primaryColumn.appendChild(primaryResultsContainer);

  // Рендерим дашборд для основного сайта
  renderDashboard(data.primary, primaryResultsContainer);

  // Колонка для конкурента
  const competitorColumn = document.createElement("div");
  competitorColumn.className =
    "comparison-column comparison-column--competitor";

  const competitorHeader = document.createElement("div");
  competitorHeader.className = "comparison-column__header";

  const competitorTitle = document.createElement("h2");
  competitorTitle.textContent = "Конкурент";

  const competitorUrl = document.createElement("p");
  competitorUrl.textContent =
    data.competitor.record?.key.url ||
    data.competitor.record?.key.origin ||
    "Неизвестный URL";

  competitorHeader.appendChild(competitorTitle);
  competitorHeader.appendChild(competitorUrl);
  competitorColumn.appendChild(competitorHeader);

  // Создаём контейнер для результатов конкурента
  const competitorResultsContainer = document.createElement("div");
  competitorColumn.appendChild(competitorResultsContainer);

  // Рендерим дашборд для конкурента
  renderDashboard(data.competitor, competitorResultsContainer);

  comparisonContainer.appendChild(primaryColumn);
  comparisonContainer.appendChild(competitorColumn);

  container.appendChild(comparisonContainer);
}
