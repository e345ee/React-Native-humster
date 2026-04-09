const envBaseUrl = typeof process !== 'undefined' ? (process.env.EXPO_PUBLIC_API_URL as string | undefined) : undefined;

function normalizeBaseUrl(url: string) {
  return url.endsWith('/') ? url : `${url}/`;
}

export const BASE_URL = normalizeBaseUrl(envBaseUrl ?? 'https://song-analysis.app/');
