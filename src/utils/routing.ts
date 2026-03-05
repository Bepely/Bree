export function localePath(lang: string, path = ""): string {
  return `/${lang}/${path}`.replace(/\/+/g, "/");
}

export function storyPath(lang: string, slug: string): string {
  return localePath(lang, `stories/${slug}/`);
}
