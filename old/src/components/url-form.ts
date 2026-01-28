import type { FormFactor } from "../types/crux";
import type { ComparisonFormData } from "../types/comparison";

export interface UrlFormData {
  urlOrOrigin: string;
  formFactor: FormFactor | "ALL";
  formIndex?: number;
}

interface UrlFormCallbacks {
  onAnalyze: () => void;
  onAddComparison?: () => void;
}

/**
 * Формирует финальный URL на основе введенного значения и типа выбора.
 * Добавляет протокол, если он отсутствует, и обрабатывает логику для типов "origin" и "auto".
 *
 * @param urlOrOrigin - Исходный URL или origin, введенный пользователем
 * @param type - Тип обработки: "origin" (только origin), "auto" (автоматическое определение) или "url" (полный URL)
 * @returns Обработанный URL или null, если URL некорректен
 */
function buildFinalUrl(urlOrOrigin: string, type: string): string | null {
  let finalUrl = urlOrOrigin;

  if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
    finalUrl = `https://${finalUrl}`;
  }

  if (type === "origin") {
    try {
      const url = new URL(finalUrl);
      finalUrl = `${url.protocol}//${url.host}`;
    } catch {
      return null;
    }
  } else if (type === "auto") {
    try {
      const url = new URL(finalUrl);

      if (url.pathname === "/" || url.pathname === "") {
        finalUrl = `${url.protocol}//${url.host}`;
      }
    } catch {
      return null;
    }
  }

  return finalUrl;
}

/**
 * Создаёт HTML-разметку формы для ввода URL.
 *
 * @param formIndex - Индекс формы (0 для первой, 1 для второй)
 * @returns HTML-строка с разметкой формы
 */
function createFormHTML(formIndex: number): string {
  return `
    <form class="url-form" data-form-index="${formIndex}">
      <input
        type="text"
        class="url-form__input"
        data-url-input
        placeholder="https://example.com или https://example.com/page"
        required
      />
      <select class="url-form__select" data-type-select>
        <option value="auto">Автоопределение</option>
        <option value="url">URL</option>
        <option value="origin">Origin</option>
      </select>
      <select class="url-form__select" data-form-factor-select>
        <option value="ALL">Все устройства</option>
        <option value="PHONE">Телефон</option>
        <option value="TABLET">Планшет</option>
        <option value="DESKTOP">Десктоп</option>
      </select>
    </form>
  `;
}

/**
 * Извлекает данные из формы.
 *
 * @param form - Элемент формы
 * @param formIndex - Индекс формы (0 или 1)
 * @returns Данные формы или null, если форма невалидна
 */
export function extractFormData(
  form: HTMLFormElement,
  formIndex: number,
): UrlFormData | null {
  const urlInput = form.querySelector<HTMLInputElement>("[data-url-input]");
  const typeSelect =
    form.querySelector<HTMLSelectElement>("[data-type-select]");
  const formFactorSelect = form.querySelector<HTMLSelectElement>(
    "[data-form-factor-select]",
  );

  if (!urlInput || !typeSelect || !formFactorSelect) {
    return null;
  }

  const urlOrOrigin = urlInput.value.trim();
  if (!urlOrOrigin) {
    return null;
  }

  const finalUrl = buildFinalUrl(urlOrOrigin, typeSelect.value);
  if (!finalUrl) {
    return null;
  }

  return {
    urlOrOrigin: finalUrl,
    formFactor: formFactorSelect.value as FormFactor | "ALL",
    formIndex,
  };
}

/**
 * Инициализирует форму для ввода URL или origin.
 * Настраивает обработчик отправки формы и валидацию данных.
 * Поддерживает добавление второй формы для сравнения.
 *
 * @param callbacks - Объект с колбэками для обработки событий формы
 * @throws {Error} Если форма или необходимые элементы не найдены в DOM
 */
function initUrlForm(callbacks: UrlFormCallbacks): void {
  const formContainer = document.querySelector<HTMLElement>(".form-container");
  if (!formContainer) {
    throw new Error("Контейнер формы не найден в DOM");
  }

  const firstForm = formContainer.querySelector<HTMLFormElement>(
    ".url-form[data-form-index='0']",
  );
  if (!firstForm) {
    throw new Error("Первая форма не найдена в DOM");
  }

  // Обработчик кнопки добавления сравнения
  const addComparisonButton = document.querySelector<HTMLButtonElement>(
    "[data-add-comparison]",
  );
  if (addComparisonButton) {
    addComparisonButton.addEventListener("click", () => {
      // Проверяем, не добавлена ли уже вторая форма
      const secondForm = formContainer.querySelector<HTMLFormElement>(
        ".url-form[data-form-index='1']",
      );

      if (!secondForm) {
        // Создаём вторую форму
        const addComparisonDiv = formContainer.querySelector<HTMLElement>(
          ".form-container__add-comparison",
        );
        if (addComparisonDiv) {
          const secondFormHTML = createFormHTML(1);
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = secondFormHTML;
          const newForm = tempDiv.firstElementChild as HTMLFormElement;

          // Вставляем форму перед кнопкой добавления
          addComparisonDiv.insertAdjacentElement("beforebegin", newForm);

          // Скрываем кнопку добавления
          addComparisonButton.style.display = "none";

          // Вызываем колбэк, если он есть
          if (callbacks.onAddComparison) {
            callbacks.onAddComparison();
          }
        }
      }
    });
  }

  // Обработчик кнопки анализа
  const analyzeButton = document.querySelector<HTMLButtonElement>(
    "[data-analyze-button]",
  );
  if (analyzeButton) {
    analyzeButton.addEventListener("click", () => {
      callbacks.onAnalyze();
    });
  }
}

export { initUrlForm, type UrlFormData };
