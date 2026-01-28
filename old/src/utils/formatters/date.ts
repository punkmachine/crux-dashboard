/**
 * Форматирует дату в читаемый формат на русском языке.
 *
 * @param date - Объект с полями year, month, day
 * @returns Отформатированная строка даты в формате "день месяц год" на русском языке
 */
export function formatDate(date: {
  year: number;
  month: number;
  day: number;
}): string {
  const d = new Date(date.year, date.month - 1, date.day);

  return d.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
