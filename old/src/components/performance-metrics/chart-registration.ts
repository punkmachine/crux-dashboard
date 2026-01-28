import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

/**
 * Регистрирует необходимые компоненты Chart.js для работы графиков.
 */
export function registerChartComponents(): void {
  try {
    Chart.register(
      CategoryScale,
      LinearScale,
      BarController,
      BarElement,
      Title,
      Tooltip,
      Legend,
    );
  } catch (error) {
    console.error("Error registering Chart.js components:", error);
  }
}
