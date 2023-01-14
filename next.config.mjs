// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
const { NODE_ENV, ...env } = (await import('./src/env/server.mjs')).env;
!process.env.SKIP_ENV_VALIDATION && env;

/** @type {import("next").NextConfig} */
const config = {
  env,
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};
export default config;
