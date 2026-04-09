const envBaseUrl = process.env.EXPO_PUBLIC_API_URL as string | undefined;

function normalizeBaseUrl(url: string) {
  return url.endsWith('/') ? url : `${url}/`;
}

export const BASE_URL = normalizeBaseUrl(envBaseUrl ?? 'https://song-analysis.app/');
