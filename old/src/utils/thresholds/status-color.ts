import type { MetricStatus } from "./types";

const STATUS_COLORS: Record<MetricStatus | "default", string> = {
  good: "var(--color-success)",
  "needs-improvement": "var(--color-warning)",
  poor: "var(--color-error)",
  default: "var(--color-success)",
};

/**
 * Возвращает CSS-переменную для цвета статуса метрики.
 *
 * @param status - Статус метрики
 * @returns CSS-переменная для цвета (var(--color-success), var(--color-warning) или var(--color-error))
 */
export function getStatusColor(status: MetricStatus): string {
  return STATUS_COLORS[status]
    ? STATUS_COLORS[status]
    : STATUS_COLORS["default"];
}
