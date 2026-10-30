import Constants from 'expo-constants';

export function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '');
}

export function getApiBaseUrl() {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;

  if (typeof apiUrl !== 'string' || apiUrl.trim().length === 0) {
    throw new Error('Missing API_URL. Add API_URL to .env.local and restart Expo.');
  }

  return normalizeBaseUrl(apiUrl.trim());
}

export function getFptProxyBaseUrl() {
  const proxyUrl = Constants.expoConfig?.extra?.fptProxyUrl;

  if (typeof proxyUrl === 'string' && proxyUrl.trim().length > 0) {
    return normalizeBaseUrl(stripApiSuffix(proxyUrl.trim()));
  }

  // Không cấu hình proxy riêng thì gọi qua backend chính (xem services/api/fpt.ts).
  return null;
}

function stripApiSuffix(url: string) {
  return url.replace(/\/api\/?$/, '');
}
