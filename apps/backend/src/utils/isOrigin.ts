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
