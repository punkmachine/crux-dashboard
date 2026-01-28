import "./style.css";

import {
  initUrlForm,
  type UrlFormData,
  extractFormData,
} from "./components/url-form";
import { renderDashboard } from "./components/dashboard";
import { renderComparisonDashboard } from "./components/comparison-dashboard";
import {
  prefetchCruxData,
  clearCache,
  getCruxData,
} from "./services/crux-cache";
import { showError, showLoading, hideLoading } from "./utils/ui";

const app = document.querySelector<HTMLDivElement>("#app")!;

// Хранилище данных форм
let primaryFormData: UrlFormData | null = null;
let competitorFormData: UrlFormData | null = null;

/**
 * Проверяет, заполнены ли обе формы, и запускает сравнение, если да.
 */
function checkAndRunComparison(): void {
  if (primaryFormData && competitorFormData) {
    clearCache();
    showLoading(app);

    const primaryFormFactor =
      primaryFormData.formFactor === "ALL"
        ? undefined
        : primaryFormData.formFactor;
    const competitorFormFactor =
      competitorFormData.formFactor === "ALL"
        ? undefined
        : competitorFormData.formFactor;

    prefetchCruxData([
      { url: primaryFormData.urlOrOrigin, formFactor: primaryFormFactor },
      {
        url: competitorFormData.urlOrOrigin,
        formFactor: competitorFormFactor,
      },
    ])
      .then(() => {
        return Promise.all([
          getCruxData(primaryFormData!.urlOrOrigin, primaryFormFactor),
          getCruxData(competitorFormData!.urlOrOrigin, competitorFormFactor),
        ]);
      })
      .then(([primaryResponse, competitorResponse]) => {
        hideLoading();
        renderComparisonDashboard(
          {
            primary: primaryResponse,
            competitor: competitorResponse,
          },
          app,
        );
      })
      .catch((error) => {
        hideLoading();
        showError(error.message || "Произошла ошибка при загрузке данных", app);
      });
  }
}

/**
 * Обрабатывает нажатие кнопки "Анализировать".
 * Собирает данные из форм и запускает анализ или сравнение.
 */
function handleAnalyze(): void {
  const formContainer = document.querySelector<HTMLElement>(".form-container");
  const firstForm = formContainer?.querySelector<HTMLFormElement>(
    ".url-form[data-form-index='0']",
  );
  const secondForm = formContainer?.querySelector<HTMLFormElement>(
    ".url-form[data-form-index='1']",
  );

  if (!firstForm) {
    return;
  }

  // Извлекаем данные из первой формы
  const primaryData = extractFormData(firstForm, 0);
  if (!primaryData) {
    return;
  }

  // Если есть вторая форма, извлекаем данные из неё
  if (secondForm) {
    const competitorData = extractFormData(secondForm, 1);
    if (!competitorData) {
      return;
    }

    // Запускаем сравнение
    primaryFormData = primaryData;
    competitorFormData = competitorData;
    checkAndRunComparison();
  } else {
    // Запускаем обычный анализ
    clearCache();
    showLoading(app);

    const formFactor =
      primaryData.formFactor === "ALL" ? undefined : primaryData.formFactor;

    prefetchCruxData([{ url: primaryData.urlOrOrigin, formFactor }])
      .then(() => {
        return getCruxData(primaryData.urlOrOrigin, formFactor);
      })
      .then((response) => {
        hideLoading();
        renderDashboard(response, app);
      })
      .catch((error) => {
        hideLoading();
        showError(error.message || "Произошла ошибка при загрузке данных", app);
      });
  }
}

initUrlForm({
  onAnalyze: handleAnalyze,
});
