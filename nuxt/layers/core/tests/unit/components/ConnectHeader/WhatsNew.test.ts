import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ConnectHeaderWhatsNew } from '#components'
import { i18nMock } from '~~/tests/unit/mocks/i18n'

// TODO: add tests when whats new is implemented
describe('<ConnectHeaderWhatsNew />', () => {
  it('renders', async () => {
    const wrapper = await mountSuspended(ConnectHeaderWhatsNew, {
      global: {
        plugins: [i18nMock]
      }
    })

    expect(wrapper).toBeDefined()
    expect(wrapper.html()).toContain("What's New")
  })
})
