import "./style.css";

import { fetchCruxData } from "./services/crux-api";
import { initUrlForm, type UrlFormData } from "./components/url-form";
import { renderDashboard } from "./components/dashboard";
import { showError, showLoading, hideLoading } from "./utils/ui";

const app = document.querySelector<HTMLDivElement>("#app")!;

/**
 * Обрабатывает отправку формы с URL или Origin.
 * Показывает индикатор загрузки, запрашивает данные из CrUX API
 * и отображает результаты или ошибки.
 *
 * @param data - Данные формы, содержащие URL/Origin и тип устройства.
 */
function handleFormSubmit(data: UrlFormData): void {
  showLoading(app);

  fetchCruxData(
    data.urlOrOrigin,
    data.formFactor === "ALL" ? undefined : data.formFactor,
  )
    .then((response) => {
      hideLoading();
      renderDashboard(response, app);
    })
    .catch((error) => {
      hideLoading();
      showError(error.message || "Произошла ошибка при загрузке данных", app);
    });
}

initUrlForm({ onSubmit: handleFormSubmit });
