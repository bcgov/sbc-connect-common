import { describe, expect, it } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ConnectHeaderUnauthenticatedOptions } from '#components'
import { i18nMock } from '~~/tests/unit/mocks/i18n'

mockNuxtImport('useConnectNav', () => {
  return () => ({
    loggedOutUserOptions: [[
      {
        label: 'Logged Out Desktop'
      }
    ]],
    loggedOutUserOptionsMobile: [[
      {
        label: 'Logged Out Mobile'
      }
    ]],
    createAccountUrl: () => 'some-url.com'
  })
})

let mockMediaQuery = true
mockNuxtImport('useMediaQuery', () => {
  return () => mockMediaQuery
})

describe('<ConnectHeaderUnauthenticatedOptions />', () => {
  it('renders', async () => {
    const wrapper = await mountSuspended(ConnectHeaderUnauthenticatedOptions, {
      global: {
        plugins: [i18nMock]
      }
    })

    expect(wrapper).toBeDefined()
  })

  it('displays login button and create account button on large screens', async () => {
    const wrapper = await mountSuspended(ConnectHeaderUnauthenticatedOptions, {
      global: {
        plugins: [i18nMock]
      }
    })

    expect(wrapper.html()).not.toContain('Logged Out Desktop')

    const loginDropdown = wrapper.find('button[aria-label="Select log in method"]')
    expect(loginDropdown).toBeDefined()
    await loginDropdown.trigger('click')
    // TODO: figure out how to test reka overlay components (components use teleport to display so they are separate from the trigger element)
    // console.log(wrapper.html())
    // expect(wrapper.html()).toContain('Log in')
    // expect(wrapper.html()).toContain('Create Account')
    // expect(wrapper.html()).toContain('Logged Out Desktop')
  })

  it('displays main menu button on small screens', async () => {
    mockMediaQuery = false
    const wrapper = await mountSuspended(ConnectHeaderUnauthenticatedOptions, {
      global: {
        plugins: [i18nMock]
      }
    })

    expect(wrapper.html()).not.toContain('Logged Out Mobile')

    const mainMenu = wrapper.find('button[aria-label="Main menu"]')
    expect(mainMenu).toBeDefined()
    // TODO: figure out how to test reka overlay components (components use teleport to display so they are separate from the trigger element)
    // await mainMenu.trigger('click')
    // expect(wrapper.html()).toContain('Logged Out Mobile')
  })
})
