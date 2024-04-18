export function applyDynamicPathParams(url: string, params?: Record<string, string|number>): string {
    if (!params) return url;
    return Object.keys(params).reduce((currentUrl, key) => {
      return currentUrl.replace(`:${key}`, encodeURIComponent(params[key]));
    }, url);
}