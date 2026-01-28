import type { MetricEntity } from "../types/metric.js";
import type { MetricName } from "../types/crux.js";
import { fetchApi } from "../utils/api.js";

export type Period = "1m" | "3m" | "6m" | "1y";
export type GroupBy = "day" | "week" | "month";
export type FormFactorFilter = "PHONE" | "TABLET" | "DESKTOP" | "ALL";

export interface GetMetricsParams {
  siteId: string;
  metric?: MetricName;
  period?: Period;
  groupBy?: GroupBy;
  formFactor?: FormFactorFilter;
}

export async function getMetrics(
  params: GetMetricsParams,
): Promise<MetricEntity[]> {
  const {
    siteId,
    metric,
    period = "1m",
    groupBy = "day",
    formFactor = "ALL",
  } = params;

  const queryParams = new URLSearchParams();
  if (metric) {
    queryParams.append("metric", metric);
  }
  queryParams.append("period", period);
  queryParams.append("groupBy", groupBy);
  queryParams.append("formFactor", formFactor);

  const url = `/api/metrics/${siteId}?${queryParams.toString()}`;
  return fetchApi<MetricEntity[]>(url);
}
