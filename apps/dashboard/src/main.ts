import "./style.css";
import { registerChartComponents } from "./components/chart-registration.js";
import { createSiteSelector } from "./components/site-selector.js";
import { renderDashboard } from "./components/dashboard.js";

// Регистрируем компоненты Chart.js
registerChartComponents();

const app = document.querySelector<HTMLDivElement>("#app")!;

/**
 * Инициализирует приложение.
 */
async function init(): Promise<void> {
  // Создаем селект сайта
  const siteSelector = await createSiteSelector({
    onSiteChange: (siteId) => {
      if (siteId) {
        // Очищаем предыдущий дашборд
        const dashboard = app.querySelector(".dashboard");
        if (dashboard) {
          dashboard.remove();
        }

        // Создаем контейнер для дашборда
        const dashboardContainer = document.createElement("div");
        dashboardContainer.className = "dashboard";
        app.appendChild(dashboardContainer);

        // Рендерим дашборд
        renderDashboard(siteId, dashboardContainer);
      } else {
        // Очищаем дашборд при сбросе выбора
        const dashboard = app.querySelector(".dashboard");
        if (dashboard) {
          dashboard.remove();
        }
      }
    },
  });

  app.appendChild(siteSelector);
}

init().catch((error) => {
  console.error("Ошибка инициализации приложения:", error);
  const errorDiv = document.createElement("div");
  errorDiv.className = "dashboard__error";
  errorDiv.textContent = "Ошибка инициализации приложения";
  app.appendChild(errorDiv);
});
