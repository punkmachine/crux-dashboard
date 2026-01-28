export type FormFactor = "PHONE" | "TABLET" | "DESKTOP";

export type FormFactorResponse = "phone" | "tablet" | "desktop";

export type MetricName =
  | "cumulative_layout_shift"
  | "first_contentful_paint"
  | "interaction_to_next_paint"
  | "largest_contentful_paint"
  | "experimental_time_to_first_byte"
  | "largest_contentful_paint_resource_type"
  | "largest_contentful_paint_image_time_to_first_byte"
  | "largest_contentful_paint_image_resource_load_delay"
  | "largest_contentful_paint_image_resource_load_duration"
  | "largest_contentful_paint_image_element_render_delay"
  | "navigation_types"
  | "round_trip_time"
  | "form_factors";

export interface DateValue {
  year: number;
  month: number;
  day: number;
}

export interface CollectionPeriod {
  firstDate: DateValue;
  lastDate: DateValue;
}

export interface Bin {
  start: number | string;
  end?: number | string;
  density: number;
}

export interface Histogram {
  histogram: Bin[];
}

export interface Percentiles {
  p75: number | string;
}

export interface Fractions {
  [key: string]: number;
}

export type MetricValue =
  | (Histogram & { percentiles?: Percentiles })
  | { percentiles: Percentiles }
  | { fractions: Fractions };

export interface Metric {
  [metricName: string]: MetricValue;
}

export interface RecordKey {
  formFactor?: FormFactorResponse;
  origin?: string;
  url?: string;
}

export interface Record {
  key: RecordKey;
  metrics: Metric;
  collectionPeriod?: CollectionPeriod;
}

export interface UrlNormalizationDetails {
  originalUrl: string;
  normalizedUrl: string;
}

export interface CruxResponse {
  record?: Record;
  urlNormalizationDetails?: UrlNormalizationDetails;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

export interface CruxRequest {
  origin?: string;
  url?: string;
  formFactor?: FormFactor;
  metrics?: MetricName[];
}
