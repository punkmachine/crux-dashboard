import type { LcpImageTtfbMetricName } from "../types";
import { formatMetricValue } from "../../../utils/formatters/metric-value";
import { getMetricDisplayName } from "../../../utils/formatters/metric-display-name";
import { getMetricUnit } from "../../../utils/formatters/metric-unit";

/**
 * Создает DOM-элемент для метрики LCP Image TTFB.
 *
 * @param metricName - Название метрики
 * @param value - Значение метрики (p75)
 * @returns DOM-элемент карточки метрики
 */
export function createLcpImageTtfbCard(
  metricName: LcpImageTtfbMetricName,
  value: number | null,
): HTMLElement {
  const card = document.createElement("div");
  card.className = "lcp-detail-card";

  const displayName = getMetricDisplayName(metricName);
  const unit = getMetricUnit(metricName);

  let formattedValue = "N/A";

  if (value !== null && !isNaN(value)) {
    formattedValue = formatMetricValue(value, unit);
  }

  const header = document.createElement("div");
  header.className = "lcp-detail-card__header";

  const title = document.createElement("h3");
  title.className = "lcp-detail-card__title";
  title.textContent = displayName;

  header.appendChild(title);
  card.appendChild(header);

  const valueDiv = document.createElement("div");
  valueDiv.className = "lcp-detail-card__value";
  valueDiv.textContent = formattedValue;

  card.appendChild(valueDiv);

  const description = document.createElement("p");
  description.className = "lcp-detail-card__description";
  description.textContent =
    "Время до получения первого байта изображения, которое является LCP-элементом. Показывает скорость сервера и сетевую задержку.";
  card.appendChild(description);

  return card;
}
