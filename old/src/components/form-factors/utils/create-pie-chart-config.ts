import type { Fractions } from "../../../types/crux";

/**
 * Цвета для различных формфакторов.
 */
const FORM_FACTOR_COLORS: Record<string, string> = {
  phone: "#1a73e8",
  tablet: "#34a853",
  desktop: "#fbbc04",
};

/**
 * Локализованные названия формфакторов.
 */
const FORM_FACTOR_LABELS: Record<string, string> = {
  phone: "Мобильные",
  tablet: "Планшеты",
  desktop: "Десктопы",
};

/**
 * Создает Chart.js конфигурацию для круговой диаграммы формфакторов.
 *
 * @param fractions - Объект с долями формфакторов
 * @returns Конфигурация Chart.js для pie chart
 */
export function createFormFactorsPieChartConfig(fractions: Fractions): any {
  const labels: string[] = [];
  const data: number[] = [];
  const backgroundColor: string[] = [];
  const borderColor: string[] = [];

  // Сортируем по ключам для консистентного отображения
  const sortedKeys = Object.keys(fractions).sort();

  for (const key of sortedKeys) {
    const value = fractions[key];
    if (typeof value === "number" && value > 0) {
      labels.push(FORM_FACTOR_LABELS[key] || key);
      data.push(Math.round(value * 100 * 10) / 10); // Округляем до 1 знака после запятой
      backgroundColor.push(FORM_FACTOR_COLORS[key] || "#5f6368");
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
