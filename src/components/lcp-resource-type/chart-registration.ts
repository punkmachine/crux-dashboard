import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

/**
 * Регистрирует необходимые компоненты Chart.js для работы круговой диаграммы.
 */
export function registerChartComponents(): void {
  try {
    Chart.register(ArcElement, Tooltip, Legend);
  } catch (error) {
    console.error("Error registering Chart.js components:", error);
  }
}
