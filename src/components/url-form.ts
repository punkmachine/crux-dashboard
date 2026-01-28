import type { FormFactor } from "../types/crux";

interface UrlFormData {
  urlOrOrigin: string;
  formFactor: FormFactor | "ALL";
}

interface UrlFormCallbacks {
  onSubmit: (data: UrlFormData) => void;
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
 * Инициализирует форму для ввода URL или origin.
 * Настраивает обработчик отправки формы и валидацию данных.
 *
 * @param callbacks - Объект с колбэками для обработки событий формы
 * @throws {Error} Если форма или необходимые элементы не найдены в DOM
 */
function initUrlForm(callbacks: UrlFormCallbacks): void {
  const form = document.querySelector<HTMLFormElement>(".url-form");
  if (!form) {
    throw new Error("Форма не найдена в DOM");
  }

  const urlInput = form.querySelector<HTMLInputElement>("[data-url-input]");
  const typeSelect =
    form.querySelector<HTMLSelectElement>("[data-type-select]");
  const formFactorSelect = form.querySelector<HTMLSelectElement>(
    "[data-form-factor-select]",
  );

  if (!urlInput || !typeSelect || !formFactorSelect) {
    throw new Error("Не найдены необходимые элементы формы");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const urlOrOrigin = urlInput.value.trim();
    if (!urlOrOrigin) {
      return;
    }

    const finalUrl = buildFinalUrl(urlOrOrigin, typeSelect.value);
    if (!finalUrl) {
      return;
    }

    callbacks.onSubmit({
      urlOrOrigin: finalUrl,
      formFactor: formFactorSelect.value as FormFactor | "ALL",
    });
  });
}

export { initUrlForm, type UrlFormData };
