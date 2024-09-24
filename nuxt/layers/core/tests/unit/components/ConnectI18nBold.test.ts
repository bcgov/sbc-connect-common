import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ConnectI18nBold } from '#components'
import { enI18n } from '~~/tests/unit/mocks/i18n'

describe('<ConnectI18nBold />', () => {
  it('should add bold tags around text', async () => {
    const wrapper = await mountSuspended(ConnectI18nBold, {
      props: {
        translationPath: 'test.i18nBold.strong'
      },
      global: {
        plugins: [enI18n]
      }
    })

    expect(wrapper.html()).toContain('<span>This should have <strong> bold </strong> text</span>')
  })

  it('should allow other props', async () => {
    const wrapper = await mountSuspended(ConnectI18nBold, {
      props: {
        translationPath: 'test.i18nBold.strongWithProps',
        prop: 'prop to be added'
      },
      global: {
        plugins: [enI18n]
      }
    })

    expect(wrapper.html()).toContain('<span prop="prop to be added">This should have <strong> bold </strong> text and allow a prop to be added</span>')
  })
})
