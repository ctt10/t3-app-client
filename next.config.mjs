/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import { createHash } from 'crypto';
import {nanoid} from 'nanoid';

const generateCsp = () => {
  const hash = createHash('sha256');
  hash.update(nanoid());
  const production = process.env.NODE_ENV === 'production';

  // https://r.stripe.com/0

  return `default-src 'self' https://js.stripe.com/v3/; img-src 'self' https://*.stripe.com; style-src https://fonts.googleapis.com 'self' 'unsafe-inline'; script-src https://m.stripe.com/6 https://js.stripe.com/v3 'sha256-${hash.digest(
    'base64' 
  )}' 'self' ${production ? '' : "'unsafe-eval'"
    }; font-src https://fonts.gstatic.com 'self' data:"`;
};

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  images: {
    domains: [
      '*.stripe.com',
      "qmvirlrqiiehntmvzgdb.supabase.co"
    ],
  },

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  // Adding Content Security Policies:
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://r.stripe.com/0" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },

          {
            key: 'X-Frame-Options',
            value: 'https://checkout.stripe.com https://js.stripe.com',
          },
          {
            key: 'Content-Security-Policy',
            value: generateCsp()
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: "X-XXS-Protection",
            value: "1; mode=block"
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
        ],
      },
    ];
  },
};
export default config;
