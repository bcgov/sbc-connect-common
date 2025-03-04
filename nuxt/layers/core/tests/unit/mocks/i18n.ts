import { createI18n } from 'vue-i18n'
import en from '#core/i18n/locales/en-CA'
import fr from '#core/i18n/locales/fr-CA'

export const i18nMock = createI18n({
  legacy: false,
  locale: 'en-CA',
  messages: {
    'en-CA': en,
    'fr-CA': fr
  }
})

// export const frI18n = createI18n({
//   legacy: false,
//   locale: 'fr',
//   messages: {
//     fr
//   }
// })

// export const randomI18n = createI18n({
//   legacy: false,
//   locale: 'ja',
//   messages: {
//     ja: en
//   }
// })
