import type { CreateSiteDto } from "../types/site.js";
import { createElement } from "../utils/dom.js";

export class SiteForm {
  private form: HTMLFormElement;
  private onSubmitCallback?: (data: CreateSiteDto) => void | Promise<void>;
  private onCancelCallback?: () => void;

  constructor(container: HTMLElement) {
    this.form = createElement("form", "site-form") as HTMLFormElement;
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
    this.render();
    container.appendChild(this.form);
  }

  private render(): void {
    this.form.innerHTML = "";

    const title = createElement("h2", "site-form__title");
    title.textContent = "Добавить сайт";
    this.form.appendChild(title);

    const urlGroup = createElement("div", "site-form__group");
    const urlLabel = createElement("label", "site-form__label");
    urlLabel.setAttribute("for", "site-url");
    urlLabel.textContent = "URL *";
    const urlInput = createElement(
      "input",
      "site-form__input",
    ) as HTMLInputElement;
    urlInput.id = "site-url";
    urlInput.name = "url";
    urlInput.type = "url";
    urlInput.required = true;
    urlInput.placeholder = "https://example.com";
    urlGroup.appendChild(urlLabel);
    urlGroup.appendChild(urlInput);
    this.form.appendChild(urlGroup);

    const nameGroup = createElement("div", "site-form__group");
    const nameLabel = createElement("label", "site-form__label");
    nameLabel.setAttribute("for", "site-name");
    nameLabel.textContent = "Название *";
    const nameInput = createElement(
      "input",
      "site-form__input",
    ) as HTMLInputElement;
    nameInput.id = "site-name";
    nameInput.name = "name";
    nameInput.type = "text";
    nameInput.required = true;
    nameInput.placeholder = "Название сайта";
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    this.form.appendChild(nameGroup);

    const activeGroup = createElement("div", "site-form__group");
    const activeLabel = createElement("label", "site-form__checkbox-label");
    const activeCheckbox = createElement(
      "input",
      "site-form__checkbox",
    ) as HTMLInputElement;
    activeCheckbox.id = "site-active";
    activeCheckbox.name = "isActive";
    activeCheckbox.type = "checkbox";
    activeCheckbox.checked = true;
    activeLabel.appendChild(activeCheckbox);
    const activeText = createElement("span");
    activeText.textContent = "Активен";
    activeLabel.appendChild(activeText);
    activeGroup.appendChild(activeLabel);
    this.form.appendChild(activeGroup);

    const buttonsGroup = createElement("div", "site-form__buttons");
    const submitButton = createElement(
      "button",
      "site-form__submit",
    ) as HTMLButtonElement;
    submitButton.type = "submit";
    submitButton.textContent = "Создать";
    const cancelButton = createElement(
      "button",
      "site-form__cancel",
    ) as HTMLButtonElement;
    cancelButton.type = "button";
    cancelButton.textContent = "Отмена";
    cancelButton.addEventListener("click", () => {
      if (this.onCancelCallback) {
        this.onCancelCallback();
      }
    });
    buttonsGroup.appendChild(submitButton);
    buttonsGroup.appendChild(cancelButton);
    this.form.appendChild(buttonsGroup);
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const formData = new FormData(this.form);
    const url = formData.get("url") as string;
    const name = formData.get("name") as string;
    const isActive = formData.get("isActive") === "on";

    if (!url || !name) {
      return;
    }

    // Валидация URL
    try {
      new URL(url);
    } catch {
      alert("Некорректный формат URL");
      return;
    }

    if (this.onSubmitCallback) {
      this.onSubmitCallback({ url, name, isActive });
    }
  }

  onSubmit(callback: (data: CreateSiteDto) => void | Promise<void>): void {
    this.onSubmitCallback = callback;
  }

  onCancel(callback: () => void): void {
    this.onCancelCallback = callback;
  }

  reset(): void {
    this.form.reset();
    const checkbox = this.form.querySelector(
      "#site-active",
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = true;
    }
  }

  show(): void {
    this.form.style.display = "block";
  }

  hide(): void {
    this.form.style.display = "none";
  }

  destroy(): void {
    this.form.remove();
  }
}
