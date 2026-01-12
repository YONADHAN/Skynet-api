export const AUTH_CONSTANTS = {
  ACCESS_TOKEN_EXPIRY: '15m' as const,
  REFRESH_TOKEN_EXPIRY: '30d' as const,

  ACCESS_TOKEN_COOKIE: 'access_token',
  REFRESH_TOKEN_COOKIE: 'refresh_token',
}
