export interface Threshold {
  good: number;
  poor: number;
}

export type MetricStatus = "good" | "needs-improvement" | "poor";
