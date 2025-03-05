import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ConnectHeaderWhatsNew } from '#components'
import { i18nMock } from '~~/tests/unit/mocks/i18n'

// TODO: figure out how to test reka overlay components (components use teleport to display so they are separate from the trigger element)
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
