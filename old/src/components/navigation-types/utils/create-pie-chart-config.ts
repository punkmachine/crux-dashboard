import type { Fractions } from "../../../types/crux";

/**
 * Цвета для различных типов навигации.
 */
const NAVIGATION_TYPE_COLORS: Record<string, string> = {
  navigate: "#1a73e8",
  navigate_cache: "#34a853",
  reload: "#fbbc04",
  restore: "#ea4335",
};

/**
 * Локализованные названия типов навигации.
 */
const NAVIGATION_TYPE_LABELS: Record<string, string> = {
  navigate: "Переход",
  navigate_cache: "Из кэша",
  reload: "Перезагрузка",
  restore: "Восстановление",
};

/**
 * Создает Chart.js конфигурацию для круговой диаграммы типов навигации.
 *
 * @param fractions - Объект с долями типов навигации
 * @returns Конфигурация Chart.js для pie chart
 */
export function createNavigationTypesPieChartConfig(fractions: Fractions): any {
  const labels: string[] = [];
  const data: number[] = [];
  const backgroundColor: string[] = [];
  const borderColor: string[] = [];

  // Сортируем по ключам для консистентного отображения
  const sortedKeys = Object.keys(fractions).sort();

  for (const key of sortedKeys) {
    const value = fractions[key];
    if (typeof value === "number" && value > 0) {
      labels.push(NAVIGATION_TYPE_LABELS[key] || key);
      data.push(Math.round(value * 100 * 10) / 10); // Округляем до 1 знака после запятой
      backgroundColor.push(NAVIGATION_TYPE_COLORS[key] || "#5f6368");
      borderColor.push("#ffffff");
    }
  }

  return {
    type: "pie" as const,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            padding: 15,
            font: {
              size: 12,
            },
            usePointStyle: true,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context: any) => {
              const label = context.label || "";
              const value = context.parsed || 0;
              return `${label}: ${value.toFixed(1)}%`;
            },
          },
        },
      },
    },
  };
}
