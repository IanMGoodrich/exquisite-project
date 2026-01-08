export const availableThemes  = [ 'default', 'typewriter', 'floral', 'sprawl', 'monitor'] as const;

export type Theme = (typeof availableThemes)[number];

export const isAvailableTheme = (theme: string) => {
 return availableThemes.includes(theme as Theme);
}

export const defaultTheme: Theme = 'default';

export const getDataThemeAttrib = () => {
  const docTheme = document.documentElement.getAttribute("data-theme") as Theme;
  if (docTheme && isAvailableTheme(docTheme)) {
    return docTheme;
  }
  return 'default';

}