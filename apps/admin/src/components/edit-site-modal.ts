import type { Site, UpdateSiteDto } from "../types/site.js";
import { createElement } from "../utils/dom.js";

export class EditSiteModal {
  private modal: HTMLElement;
  private overlay: HTMLElement;
  private form: HTMLFormElement;
  private currentSite: Site | null = null;
  private onSubmitCallback?: (
    id: string,
    data: UpdateSiteDto,
  ) => void | Promise<void>;

  constructor() {
    this.overlay = createElement("div", "modal-overlay");
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });

    this.modal = createElement("div", "modal");
    this.form = createElement("form", "edit-site-form") as HTMLFormElement;
    this.form.addEventListener("submit", this.handleSubmit.bind(this));

    this.render();
    this.modal.appendChild(this.form);
    this.overlay.appendChild(this.modal);
  }

  private render(): void {
    this.form.innerHTML = "";

    const title = createElement("h2", "edit-site-form__title");
    title.textContent = "Редактировать сайт";
    this.form.appendChild(title);

    const urlGroup = createElement("div", "edit-site-form__group");
    const urlLabel = createElement("label", "edit-site-form__label");
    urlLabel.textContent = "URL";
    const urlInput = createElement(
      "input",
      "edit-site-form__input",
    ) as HTMLInputElement;
    urlInput.type = "text";
    urlInput.readOnly = true;
    urlInput.id = "edit-site-url";
    urlGroup.appendChild(urlLabel);
    urlGroup.appendChild(urlInput);
    this.form.appendChild(urlGroup);

    const nameGroup = createElement("div", "edit-site-form__group");
    const nameLabel = createElement("label", "edit-site-form__label");
    nameLabel.setAttribute("for", "edit-site-name");
    nameLabel.textContent = "Название *";
    const nameInput = createElement(
      "input",
      "edit-site-form__input",
    ) as HTMLInputElement;
    nameInput.id = "edit-site-name";
    nameInput.name = "name";
    nameInput.type = "text";
    nameInput.required = true;
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    this.form.appendChild(nameGroup);

    const activeGroup = createElement("div", "edit-site-form__group");
    const activeLabel = createElement(
      "label",
      "edit-site-form__checkbox-label",
    );
    const activeCheckbox = createElement(
      "input",
      "edit-site-form__checkbox",
    ) as HTMLInputElement;
    activeCheckbox.id = "edit-site-active";
    activeCheckbox.name = "isActive";
    activeCheckbox.type = "checkbox";
    activeLabel.appendChild(activeCheckbox);
    const activeText = createElement("span");
    activeText.textContent = "Активен";
    activeLabel.appendChild(activeText);
    activeGroup.appendChild(activeLabel);
    this.form.appendChild(activeGroup);

    const buttonsGroup = createElement("div", "edit-site-form__buttons");
    const submitButton = createElement(
      "button",
      "edit-site-form__submit",
    ) as HTMLButtonElement;
    submitButton.type = "submit";
    submitButton.textContent = "Сохранить";
    const cancelButton = createElement(
      "button",
      "edit-site-form__cancel",
    ) as HTMLButtonElement;
    cancelButton.type = "button";
    cancelButton.textContent = "Отмена";
    cancelButton.addEventListener("click", () => this.hide());
    buttonsGroup.appendChild(submitButton);
    buttonsGroup.appendChild(cancelButton);
    this.form.appendChild(buttonsGroup);
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    if (!this.currentSite) {
      return;
    }

    const formData = new FormData(this.form);
    const name = formData.get("name") as string;
    const isActive = formData.get("isActive") === "on";

    if (!name) {
      return;
    }

    const updateData: UpdateSiteDto = {};
    if (name !== this.currentSite.name) {
      updateData.name = name;
    }
    if (isActive !== this.currentSite.isActive) {
      updateData.isActive = isActive;
    }

    if (Object.keys(updateData).length === 0) {
      this.hide();
      return;
    }

    if (this.onSubmitCallback) {
      this.onSubmitCallback(this.currentSite.id, updateData);
    }
  }

  show(site: Site): void {
    this.currentSite = site;

    const urlInput = this.form.querySelector(
      "#edit-site-url",
    ) as HTMLInputElement;
    const nameInput = this.form.querySelector(
      "#edit-site-name",
    ) as HTMLInputElement;
    const activeCheckbox = this.form.querySelector(
      "#edit-site-active",
    ) as HTMLInputElement;

    if (urlInput) urlInput.value = site.url;
    if (nameInput) nameInput.value = site.name;
    if (activeCheckbox) activeCheckbox.checked = site.isActive;

    document.body.appendChild(this.overlay);
    this.overlay.style.display = "flex";
  }

  hide(): void {
    this.overlay.style.display = "none";
    this.currentSite = null;
  }

  onSubmit(
    callback: (id: string, data: UpdateSiteDto) => void | Promise<void>,
  ): void {
    this.onSubmitCallback = callback;
  }

  destroy(): void {
    this.overlay.remove();
  }
}
