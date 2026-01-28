import type { MetricName } from "../../types/crux";

const METRIC_DISPLAY_NAMES: Record<MetricName, string> = {
  cumulative_layout_shift: "CLS",
  first_contentful_paint: "FCP",
  interaction_to_next_paint: "INP",
  largest_contentful_paint: "LCP",
  experimental_time_to_first_byte: "TTFB",
  largest_contentful_paint_resource_type: "LCP Resource Type",
  largest_contentful_paint_image_time_to_first_byte: "LCP Image TTFB",
  largest_contentful_paint_image_resource_load_delay: "LCP Image Load Delay",
  largest_contentful_paint_image_resource_load_duration:
    "LCP Image Load Duration",
  largest_contentful_paint_image_element_render_delay: "LCP Image Render Delay",
  navigation_types: "Navigation Types",
  round_trip_time: "RTT",
  form_factors: "Form Factors",
};

/**
 * Возвращает отображаемое имя для указанной метрики.
 *
 * @param metricName - Название метрики из CrUX API
 * @returns Человекочитаемое название метрики или исходное название, если отображение не найдено
 */
export function getMetricDisplayName(metricName: MetricName): string {
  return METRIC_DISPLAY_NAMES[metricName] || metricName;
}
