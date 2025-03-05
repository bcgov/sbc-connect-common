import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { i18nMock } from '~~/tests/unit/mocks/i18n'
import { ConnectHeaderAccountLabel } from '#components'

describe('<ConnectHeaderAccountLabel />', () => {
  it('renders with default props', async () => {
    const wrapper = await mountSuspended(ConnectHeaderAccountLabel, {
      global: {
        plugins: [i18nMock]
      }
    })

    expect(wrapper).toBeDefined()
    expect(wrapper.html()).toContain('N/A')
  })

  it('renders with props', async () => {
    const wrapper = await mountSuspended(ConnectHeaderAccountLabel, {
      global: {
        plugins: [i18nMock]
      },
      props: {
        accountName: 'John Doe',
        username: 'jdoe',
        theme: 'header'
      }
    })
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('jdoe')
  })

  it('renders correctly with empty username', async () => {
    const wrapper = await mountSuspended(ConnectHeaderAccountLabel, {
      global: {
        plugins: [i18nMock]
      },
      props: {
        accountName: 'Jane Doe',
        username: '',
        theme: 'header'
      }
    })
    expect(wrapper.text()).toContain('Jane Doe')
    expect(wrapper.html()).toContain('U') // default initial when username is empty
  })
})
