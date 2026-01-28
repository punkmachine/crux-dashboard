import type { Site } from "../types/site.js";
import { getAllSites } from "../services/sites.api.js";

export interface SiteSelectorCallbacks {
  onSiteChange: (siteId: string | null) => void;
}

/**
 * Создает селект для выбора сайта.
 *
 * @param callbacks - Колбэки для обработки событий
 * @returns DOM-элемент селекта
 */
export async function createSiteSelector(
  callbacks: SiteSelectorCallbacks,
): Promise<HTMLElement> {
  const container = document.createElement("div");
  container.className = "site-selector";

  const label = document.createElement("label");
  label.className = "site-selector__label";
  label.textContent = "Выберите сайт:";
  label.setAttribute("for", "site-select");

  const select = document.createElement("select");
  select.id = "site-select";
  select.className = "site-selector__select";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Выберите сайт...";
  select.appendChild(defaultOption);

  container.appendChild(label);
  container.appendChild(select);

  try {
    const sites = await getAllSites();
    const activeSites = sites.filter((site) => site.isActive);

    if (activeSites.length === 0) {
      const noSitesOption = document.createElement("option");
      noSitesOption.value = "";
      noSitesOption.textContent = "Нет доступных сайтов";
      noSitesOption.disabled = true;
      select.appendChild(noSitesOption);
      select.disabled = true;
      return container;
    }

    for (const site of activeSites) {
      const option = document.createElement("option");
      option.value = site.id;
      option.textContent = site.name;
      select.appendChild(option);
    }

    select.addEventListener("change", () => {
      const siteId = select.value || null;
      callbacks.onSiteChange(siteId);
    });
  } catch (error) {
    console.error("Ошибка при загрузке сайтов:", error);
    const errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Ошибка загрузки сайтов";
    errorOption.disabled = true;
    select.appendChild(errorOption);
    select.disabled = true;
  }

  return container;
}
