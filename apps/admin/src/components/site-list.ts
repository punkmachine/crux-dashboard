import type { Site } from "../types/site.js";
import { createElement } from "../utils/dom.js";
import { createSiteItem } from "./site-item.js";

export class SiteList {
  private container: HTMLElement;
  private table: HTMLTableElement;
  private tbody: HTMLElement;
  private loadingElement: HTMLElement | null = null;
  private errorElement: HTMLElement | null = null;
  private emptyElement: HTMLElement | null = null;
  private onEditCallback?: (site: Site) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.table = createElement("table", "site-list") as HTMLTableElement;
    this.tbody = createElement("tbody", "site-list__body");
    this.render();
    this.container.appendChild(this.table);
  }

  private render(): void {
    this.table.innerHTML = "";

    const thead = createElement("thead", "site-list__header");
    const headerRow = createElement("tr", "site-list__header-row");

    const headers = ["URL", "Название", "Статус", "Дата создания", "Действия"];
    headers.forEach((headerText) => {
      const th = createElement("th", "site-list__header-cell");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    this.table.appendChild(thead);
    this.table.appendChild(this.tbody);
  }

  setSites(sites: Site[]): void {
    this.tbody.innerHTML = "";
    this.hideLoading();
    this.hideError();
    this.hideEmpty();

    if (sites.length === 0) {
      this.showEmpty();
      return;
    }

    sites.forEach((site) => {
      const row = createSiteItem(site, (site) => {
        if (this.onEditCallback) {
          this.onEditCallback(site);
        }
      });
      this.tbody.appendChild(row);
    });
  }

  showLoading(): void {
    this.hideError();
    this.hideEmpty();

    if (!this.loadingElement) {
      this.loadingElement = createElement("tr", "site-list__loading");
      const cell = createElement("td");
      cell.setAttribute("colspan", "5");
      cell.className = "site-list__loading-cell";
      cell.textContent = "Загрузка...";
      this.loadingElement.appendChild(cell);
    }

    this.tbody.innerHTML = "";
    this.tbody.appendChild(this.loadingElement);
  }

  hideLoading(): void {
    if (this.loadingElement && this.loadingElement.parentNode) {
      this.loadingElement.remove();
    }
  }

  showError(message: string): void {
    this.hideLoading();
    this.hideEmpty();

    if (!this.errorElement) {
      this.errorElement = createElement("tr", "site-list__error");
      const cell = createElement("td");
      cell.setAttribute("colspan", "5");
      cell.className = "site-list__error-cell";
      this.errorElement.appendChild(cell);
    }

    const cell = this.errorElement.querySelector(".site-list__error-cell");
    if (cell) {
      cell.textContent = `Ошибка: ${message}`;
    }

    this.tbody.innerHTML = "";
    this.tbody.appendChild(this.errorElement);
  }

  hideError(): void {
    if (this.errorElement && this.errorElement.parentNode) {
      this.errorElement.remove();
    }
  }

  showEmpty(): void {
    this.hideLoading();
    this.hideError();

    if (!this.emptyElement) {
      this.emptyElement = createElement("tr", "site-list__empty");
      const cell = createElement("td");
      cell.setAttribute("colspan", "5");
      cell.className = "site-list__empty-cell";
      cell.textContent = "Нет сайтов";
      this.emptyElement.appendChild(cell);
    }

    this.tbody.innerHTML = "";
    this.tbody.appendChild(this.emptyElement);
  }

  hideEmpty(): void {
    if (this.emptyElement && this.emptyElement.parentNode) {
      this.emptyElement.remove();
    }
  }

  onEdit(callback: (site: Site) => void): void {
    this.onEditCallback = callback;
  }

  destroy(): void {
    this.table.remove();
  }
}
