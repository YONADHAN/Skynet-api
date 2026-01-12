const isProduction =
  process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
}
