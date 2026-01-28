import type { MetricName } from "../../types/crux";

const METRIC_UNITS: Record<MetricName, string> = {
  cumulative_layout_shift: "",
  first_contentful_paint: "ms",
  interaction_to_next_paint: "ms",
  largest_contentful_paint: "ms",
  experimental_time_to_first_byte: "ms",
  largest_contentful_paint_resource_type: "%",
  largest_contentful_paint_image_time_to_first_byte: "ms",
  largest_contentful_paint_image_resource_load_delay: "ms",
  largest_contentful_paint_image_resource_load_duration: "ms",
  largest_contentful_paint_image_element_render_delay: "ms",
  navigation_types: "%",
  round_trip_time: "ms",
  form_factors: "%",
};

/**
 * Возвращает единицу измерения для указанной метрики.
 *
 * @param metricName - Название метрики из CrUX API
 * @returns Единица измерения метрики (ms, %, или пустая строка)
 */
export function getMetricUnit(metricName: MetricName): string {
  return METRIC_UNITS[metricName] || "";
}
