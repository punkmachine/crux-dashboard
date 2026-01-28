/**
 * Извлекает значение p75 из метрики.
 *
 * @param metricValue - Значение метрики из CrUX API
 * @returns Значение p75 или null, если недоступно
 */
export function extractP75Value(metricValue: any): number | null {
  if (!metricValue) {
    return null;
  }

  if (metricValue.percentiles?.p75 !== undefined) {
    const p75 = metricValue.percentiles.p75;
    return typeof p75 === "string" ? parseFloat(p75) : p75;
  }

  return null;
}
