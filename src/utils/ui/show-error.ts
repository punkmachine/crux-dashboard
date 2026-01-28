/**
 * Отображает сообщение об ошибке в интерфейсе.
 * Сообщение автоматически удаляется через 5 секунд.
 *
 * @param message - Текст сообщения об ошибке для отображения.
 * @param container - Контейнер, в который будет добавлено сообщение об ошибке.
 */
export function showError(message: string, container: HTMLElement): void {
  const errorDiv = document.createElement("div");

  errorDiv.className = "error";
  errorDiv.textContent = message;

  container.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}
