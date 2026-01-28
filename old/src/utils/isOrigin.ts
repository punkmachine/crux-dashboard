/**
 * Определяет, является ли переданная строка origin (домен с протоколом) или полным URL.
 *
 * Origin считается строка, которая содержит только протокол и домен без пути,
 * query-параметров и hash-фрагмента.
 *
 * @param urlOrOrigin - Строка для проверки (URL или origin)
 * @returns `true`, если строка является origin, `false` в противном случае
 */
export function isOrigin(urlOrOrigin: string): boolean {
  try {
    const url = new URL(urlOrOrigin);
    const hasOnlyRootPath = url.pathname === "/" || url.pathname === "";
    const hasNoQueryOrHash = !url.search && !url.hash;
    return hasOnlyRootPath && hasNoQueryOrHash;
  } catch {
    return false;
  }
}
