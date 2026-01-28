import "./style.css";
import { SitesState } from "./state/sites-state.js";
import { SiteList } from "./components/site-list.js";
import { SiteForm } from "./components/site-form.js";
import { EditSiteModal } from "./components/edit-site-modal.js";
import { createElement } from "./utils/dom.js";
import { ApiError } from "./utils/api.js";

class App {
  private appContainer: HTMLElement;
  private sitesState: SitesState;
  private siteList: SiteList;
  private siteForm: SiteForm;
  private editModal: EditSiteModal;
  private formContainer: HTMLElement;
  private showFormButton: HTMLButtonElement;

  constructor() {
    const appElement = document.querySelector<HTMLDivElement>("#app");
    if (!appElement) {
      throw new Error("Элемент #app не найден");
    }

    this.appContainer = appElement;
    this.sitesState = new SitesState();
    this.editModal = new EditSiteModal();

    this.init();
  }

  private init(): void {
    this.render();
    this.setupEventListeners();
    this.loadSites();
  }

  private render(): void {
    this.appContainer.innerHTML = "";

    const header = createElement("header", "app-header");
    const title = createElement("h1", "app-title");
    title.textContent = "Управление сайтами";
    header.appendChild(title);

    const main = createElement("main", "app-main");

    const controls = createElement("div", "app-controls");
    this.showFormButton = createElement(
      "button",
      "app-button app-button--primary",
    ) as HTMLButtonElement;
    this.showFormButton.textContent = "Добавить сайт";
    this.showFormButton.type = "button";
    this.showFormButton.addEventListener("click", () => this.showForm());
    controls.appendChild(this.showFormButton);

    this.formContainer = createElement("div", "app-form-container");
    this.formContainer.style.display = "none";
    this.siteForm = new SiteForm(this.formContainer);
    this.siteForm.onSubmit(async (data) => {
      await this.handleCreateSite(data);
    });
    this.siteForm.onCancel(() => {
      this.hideForm();
    });

    const listContainer = createElement("div", "app-list-container");
    this.siteList = new SiteList(listContainer);
    this.siteList.onEdit((site) => {
      this.editModal.show(site);
    });

    main.appendChild(controls);
    main.appendChild(this.formContainer);
    main.appendChild(listContainer);

    this.appContainer.appendChild(header);
    this.appContainer.appendChild(main);

    this.editModal.onSubmit(async (id, data) => {
      await this.handleUpdateSite(id, data);
    });
  }

  private setupEventListeners(): void {
    const unsubscribe = this.sitesState.subscribe(() => {
      this.updateUI();
    });

    // Сохраняем unsubscribe для возможной очистки (хотя в SPA это не критично)
    window.addEventListener("beforeunload", () => {
      unsubscribe();
    });
  }

  private async loadSites(): Promise<void> {
    try {
      await this.sitesState.loadSites();
    } catch (err) {
      console.error("Ошибка при загрузке сайтов:", err);
    }
  }

  private updateUI(): void {
    const sites = this.sitesState.getSites();
    const isLoading = this.sitesState.getLoading();
    const error = this.sitesState.getError();

    if (isLoading) {
      this.siteList.showLoading();
    } else if (error) {
      this.siteList.showError(error);
    } else {
      this.siteList.setSites(sites);
    }
  }

  private showForm(): void {
    this.formContainer.style.display = "block";
    this.showFormButton.style.display = "none";
  }

  private hideForm(): void {
    this.formContainer.style.display = "none";
    this.showFormButton.style.display = "block";
    this.siteForm.reset();
  }

  private async handleCreateSite(data: {
    url: string;
    name: string;
    isActive?: boolean;
  }): Promise<void> {
    try {
      await this.sitesState.createSite(data);
      this.hideForm();
      this.showSuccessMessage("Сайт успешно создан");
    } catch (err) {
      let errorMessage = "Ошибка при создании сайта";

      if (err instanceof ApiError) {
        if (err.status === 409) {
          errorMessage = "Сайт с таким URL уже существует";
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      this.showErrorMessage(errorMessage);
    }
  }

  private async handleUpdateSite(
    id: string,
    data: { name?: string; isActive?: boolean },
  ): Promise<void> {
    try {
      await this.sitesState.updateSite(id, data);
      this.editModal.hide();
      this.showSuccessMessage("Сайт успешно обновлен");
    } catch (err) {
      let errorMessage = "Ошибка при обновлении сайта";

      if (err instanceof ApiError) {
        if (err.status === 404) {
          errorMessage = "Сайт не найден";
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      this.showErrorMessage(errorMessage);
    }
  }

  private showSuccessMessage(message: string): void {
    const messageEl = createElement("div", "app-message app-message--success");
    messageEl.textContent = message;
    this.appContainer.appendChild(messageEl);

    setTimeout(() => {
      messageEl.remove();
    }, 3000);
  }

  private showErrorMessage(message: string): void {
    const messageEl = createElement("div", "app-message app-message--error");
    messageEl.textContent = message;
    this.appContainer.appendChild(messageEl);

    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }
}

// Инициализация приложения
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
