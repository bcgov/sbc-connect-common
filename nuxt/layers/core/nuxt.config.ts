// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from 'nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  devtools: { enabled: false },

  compatibilityDate: '2024-07-16',

  future: {
    compatibilityVersion: 4
  },

  nitro: {
    prerender: {
      ignore: [] // ignore tos/login pages by default
    }
  },

  // disable dark mode
  ui: {
    colorMode: false
  },

  css: [
    resolve('./app/assets/css/core-main.css'),
    resolve('./app/assets/css/core-layout.css')
  ],

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@nuxt/image'
  ],

  imports: {
    dirs: [
      'stores',
      'composables',
      'enums',
      'interfaces',
      'types',
      'utils'
    ]
  },

  alias: {
    BCGovFonts: resolve('./public/fonts/BCSans'),
    BCGovLogoSmEn: resolve('./public/BCGovLogo/gov_bc_logo_vert_en.png'),
    BCGovLogoSmFr: resolve('./public/BCGovLogo/gov_bc_logo_vert_fr.png'),
    BCGovLogoLgEn: resolve('./public/BCGovLogo/gov_bc_logo_horiz_en.png'),
    BCGovLogoLgFr: resolve('./public/BCGovLogo/gov_bc_logo_horiz_fr.png'),
    '#core': resolve('./')
  },

  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  },

  runtimeConfig: {
    public: {
      // Keys within public, will be also exposed to the client-side
      keycloakAuthUrl: process.env.NUXT_KEYCLOAK_AUTH_URL,
      keycloakRealm: process.env.NUXT_KEYCLOAK_REALM,
      keycloakClientId: process.env.NUXT_KEYCLOAK_CLIENTID,
      authWebURL: process.env.NUXT_AUTH_WEB_URL,
      authApiURL: `${process.env.NUXT_AUTH_API_URL || ''}${process.env.NUXT_AUTH_API_VERSION || ''}`,
      ldClientId: process.env.NUXT_LD_CLIENT_ID || '',
      appName: process.env.npm_package_name || '',
      registryHomeURL: process.env.NUXT_REGISTRY_HOME_URL,
      version: `Core UI v${process.env.npm_package_version || ''};`,
      environment: process.env.NUXT_ENVIRONMENT_HEADER || '',
      baseUrl: process.env.NUXT_BASE_URL,
      paymentPortalUrl: process.env.NUXT_PAYMENT_PORTAL_URL,
      payApiURL: `${process.env.NUXT_PAY_API_URL}${process.env.NUXT_PAY_API_VERSION}`,
      statusApiURL: `${process.env.NUXT_STATUS_API_URL}${process.env.NUXT_STATUS_API_VERSION}`,
      tokenRefreshInterval: parseInt(process.env.NUXT_KEYCLOAK_REFRESH_INTERVAL!) || 30000, // default 30 seconds
      tokenMinValidity: parseInt(process.env.NUXT_KEYCLOAK_MIN_TOKEN_VALIDITY!) || 120000, // default 2 mins
      sessionIdleTimeout: parseInt(process.env.NUXT_CONNECT_SESSION_INACTIVITY_TIMEOUT!) || 1800000, // default 30 mins
      sessionExpiredModalTimeout: parseInt(process.env.NUXT_CONNECT_SESSION_MODAL_TIMEOUT!) || 120000 // default 2 mins
    }
  },

  i18n: {
    locales: [
      {
        name: 'English',
        code: 'en-CA',
        language: 'en-CA',
        dir: 'ltr',
        file: 'en-CA.ts'
      },
      {
        name: 'Français',
        code: 'fr-CA',
        language: 'fr-CA',
        dir: 'ltr',
        file: 'fr-CA.ts'
      }
    ],
    strategy: 'prefix',
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en-CA',
    detectBrowserLanguage: false,
    vueI18n: resolve('./i18n.config.ts')
  },

  piniaPluginPersistedstate: {
    storage: 'sessionStorage'
  }

  // gtag: {
  //   id: 'G-FRKYT2LTDN'
  // }
})
