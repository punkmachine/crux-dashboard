import type { UrlFormData } from "../components/url-form";

/**
 * Данные формы для режима сравнения.
 * Содержит информацию о двух сайтах: основном и конкуренте.
 */
export interface ComparisonFormData {
  primary: UrlFormData; // Основной сайт
  competitor: UrlFormData; // Конкурент
}
