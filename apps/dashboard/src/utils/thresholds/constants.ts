import type { Threshold } from "./types";

/**
 * Пороговые значения для различных метрик CrUX API.
 * Используются для определения статуса метрики (good, needs-improvement, poor).
 */
export const THRESHOLDS: Record<string, Threshold> = {
  largest_contentful_paint: { good: 2500, poor: 4000 },
  interaction_to_next_paint: { good: 200, poor: 500 },
  cumulative_layout_shift: { good: 0.1, poor: 0.25 },
  first_contentful_paint: { good: 1800, poor: 3000 },
  experimental_time_to_first_byte: { good: 800, poor: 1800 },
  round_trip_time: { good: 0, poor: 0 }, // RTT не имеет стандартных порогов
};
