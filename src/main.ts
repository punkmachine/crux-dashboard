import "./style.css";
import { fetchCruxData } from "./services/crux-api";
import { createUrlForm, type UrlFormData } from "./components/url-form";
import { createMetricCard } from "./components/metric-card";
import { createHistogramChart } from "./components/histogram-chart";
import { createFormFactorsChart } from "./components/form-factors";
import type { CruxResponse, MetricName } from "./types/crux";

const app = document.querySelector<HTMLDivElement>("#app")!;

let charts: Map<string, any> = new Map();

function clearDashboard(): void {
  const resultsContainer = document.querySelector(".results");
  if (resultsContainer) {
    resultsContainer.remove();
  }
  charts.forEach((chart) => chart.destroy());
  charts.clear();
}

function showError(message: string): void {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error";
  errorDiv.textContent = message;
  app.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

function showLoading(): void {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading";
  loadingDiv.textContent = "Загрузка данных...";
  app.appendChild(loadingDiv);
}

function hideLoading(): void {
  const loadingDiv = document.querySelector(".loading");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

function renderDashboard(data: CruxResponse): void {
  clearDashboard();

  if (data.error) {
    showError(`Ошибка API: ${data.error.message}`);
    return;
  }

  if (!data.record) {
    showError("Данные не найдены для указанного URL/Origin");
    return;
  }

  const resultsContainer = document.createElement("div");
  resultsContainer.className = "results";

  const header = document.createElement("div");
  header.className = "results__header";

  const title = document.createElement("h2");
  title.textContent =
    data.record.key.url || data.record.key.origin || "Результаты";

  if (data.record.collectionPeriod) {
    const period = document.createElement("p");
    period.className = "results__period";
    const firstDate = new Date(
      data.record.collectionPeriod.firstDate.year,
      data.record.collectionPeriod.firstDate.month - 1,
      data.record.collectionPeriod.firstDate.day,
    );
    const lastDate = new Date(
      data.record.collectionPeriod.lastDate.year,
      data.record.collectionPeriod.lastDate.month - 1,
      data.record.collectionPeriod.lastDate.day,
    );
    period.textContent = `Период сбора данных: ${firstDate.toLocaleDateString("ru-RU")} - ${lastDate.toLocaleDateString("ru-RU")}`;
    header.appendChild(period);
  }

  header.appendChild(title);
  resultsContainer.appendChild(header);

  const metricsContainer = document.createElement("div");
  metricsContainer.className = "metrics-grid";

  const metrics = data.record.metrics;
  const metricNames = Object.keys(metrics) as MetricName[];

  metricNames.forEach((metricName) => {
    if (metricName === "form_factors") {
      const formFactorsContainer = document.createElement("div");
      formFactorsContainer.className = "form-factors-container";

      const canvas = document.createElement("canvas");
      canvas.id = `form-factors-chart`;
      formFactorsContainer.appendChild(canvas);

      resultsContainer.appendChild(formFactorsContainer);

      const chart = createFormFactorsChart({
        metric: metrics[metricName],
        canvasId: canvas.id,
      });
      if (chart) {
        charts.set(canvas.id, chart);
      }
      return;
    }

    const cardContainer = document.createElement("div");
    cardContainer.className = "metric-container";

    createMetricCard(cardContainer, {
      metricName,
      metric: metrics[metricName],
    });

    const chartContainer = document.createElement("div");
    chartContainer.className = "chart-container";

    const canvas = document.createElement("canvas");
    canvas.id = `chart-${metricName}`;
    chartContainer.appendChild(canvas);

    cardContainer.appendChild(chartContainer);
    metricsContainer.appendChild(cardContainer);

    const chart = createHistogramChart({
      metricName,
      metric: metrics[metricName],
      canvasId: canvas.id,
    });
    if (chart) {
      charts.set(canvas.id, chart);
    }
  });

  resultsContainer.appendChild(metricsContainer);
  app.appendChild(resultsContainer);
}

function handleFormSubmit(data: UrlFormData): void {
  showLoading();

  fetchCruxData(
    data.urlOrOrigin,
    data.formFactor === "ALL" ? undefined : data.formFactor,
  )
    .then((response) => {
      hideLoading();
      renderDashboard(response);
    })
    .catch((error) => {
      hideLoading();
      showError(error.message || "Произошла ошибка при загрузке данных");
    });
}

const formContainer = document.createElement("div");
formContainer.className = "form-container";
createUrlForm(formContainer, { onSubmit: handleFormSubmit });
app.appendChild(formContainer);
