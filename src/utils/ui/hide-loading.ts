/**
 * Скрывает индикатор загрузки из интерфейса.
 */
export function hideLoading(): void {
  const loadingDiv = document.querySelector(".loading");

  if (loadingDiv) {
    loadingDiv.remove();
  }
}
