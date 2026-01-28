import { Chart, ArcElement, PieController, Tooltip, Legend } from "chart.js";

/**
 * Регистрирует необходимые компоненты Chart.js для работы круговых диаграмм.
 */
export function registerChartComponents(): void {
  try {
    Chart.register(ArcElement, PieController, Tooltip, Legend);
  } catch (error) {
    console.error("Error registering Chart.js components:", error);
  }
}
