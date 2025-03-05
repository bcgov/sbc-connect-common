import { describe, expect, it, vi } from 'vitest'
import { renderSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import defaultLayout from '~/layouts/default.vue'
import { i18nMock } from '~~/tests/unit/mocks/i18n'
import { UApp } from '#components'

mockNuxtImport('useRoute', () => {
  return () => ({
    meta: {
      breadcrumbs: []
    }
  })
})

const setLocaleMock = vi.fn()
mockNuxtImport('useI18n', () => {
  return () => (
    {
      locale: 'en-CA',
      locales: ref([
        {
          name: 'English',
          code: 'en-CA',
          iso: 'en-CA',
          dir: 'ltr',
          file: 'en-CA.ts'
        },
        {
          name: 'French',
          code: 'fr-CA',
          iso: 'fr-CA',
          dir: 'ltr',
          file: 'fr-CA.ts'
        }
      ]),
      t: (key: string) => key,
      setLocale: setLocaleMock
    }
  )
})

const mockSanitize = vi.fn()
mockNuxtImport('useNuxtApp', () => {
  return () => (
    {
      $sanitize: mockSanitize
    }
  )
})

// TODO: fix layout test
describe.skip('Default Layout', () => {
  it('mounts', async () => {
    const wrapper = await renderSuspended({
      components: { defaultLayout, UApp }, // UApp required for tooltip
      template: `
        <UApp>
          <defaultLayout />
        </UApp>
      `
    }, {
      global: {
        plugins: [i18nMock]
      }
    })
    // const wrapper = await renderSuspended(defaultLayout, {
    //   global: {
    //     plugins: [i18nMock]
    //   }
    // })

    const header = wrapper.getByTestId('connect-header-wrapper')
    const footer = wrapper.getByTestId('connect-main-footer')

    expect(wrapper).toBeTruthy()
    expect(header).toBeDefined()
    expect(footer).toBeDefined()
  })
})
