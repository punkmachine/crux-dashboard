/**
 * Отображает индикатор загрузки в интерфейсе.
 *
 * @param container - Контейнер, в который будет добавлен индикатор загрузки.
 */
export function showLoading(container: HTMLElement): void {
  const loadingDiv = document.createElement("div");

  loadingDiv.className = "loading";
  loadingDiv.textContent = "Загрузка данных...";

  container.appendChild(loadingDiv);
}
