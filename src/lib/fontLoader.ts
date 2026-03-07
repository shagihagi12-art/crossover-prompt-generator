const loadedUrls = new Set<string>();

/** Google Fonts を動的に読み込む（二重読み込み防止付き） */
export function loadGoogleFont(url: string): void {
  if (!url || loadedUrls.has(url)) return;
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
  loadedUrls.add(url);
}

/** 複数のGoogle Fonts URLを一括読み込み */
export function loadGoogleFonts(urls: string[]): void {
  for (const url of urls) {
    loadGoogleFont(url);
  }
}
