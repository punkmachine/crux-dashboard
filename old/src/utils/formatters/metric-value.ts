/**
 * Форматирует числовое значение метрики с учетом единицы измерения.
 *
 * @param value - Значение метрики (число или строка)
 * @param unit - Единица измерения (ms, %, или пустая строка)
 * @returns Отформатированная строка с значением и единицей измерения, или "N/A" если значение некорректно
 */
export function formatMetricValue(
  value: number | string,
  unit: string,
): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    return "N/A";
  }

  if (unit === "ms") {
    return `${Math.round(numValue).toLocaleString()} ${unit}`;
  }

  if (unit === "%") {
    return `${(numValue * 100).toFixed(1)}%`;
  }

  if (unit === "") {
    return numValue.toFixed(2);
  }

  return `${numValue.toFixed(2)} ${unit}`;
}
