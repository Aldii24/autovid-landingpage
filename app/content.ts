export type Locale = 'id' | 'en';

export function path(locale: Locale, route = '') {
  return `${locale === 'en' ? '/en' : ''}${route}` || '/';
}
