import type { DropdownMenuItem } from '@nuxt/ui'
import { useConnectWhatsNewStore } from '~/stores/connect-whats-new'
import type { ConnectAppConfig } from '~/types/core-app-config'

// handle navigation items and functionality
export function useConnectNav () {
  const rtc = useRuntimeConfig()
  const authWebUrl = rtc.public.authWebURL
  const appBaseUrl = rtc.public.baseUrl
  const layerConfig = (useAppConfig() as ConnectAppConfig).connect.core
  const route = useRoute()
  const localePath = useLocalePath()
  const t = useNuxtApp().$i18n.t
  const locale = useNuxtApp().$i18n.locale.value
  const { login, logout, isAuthenticated, kcUser } = useKeycloak()
  const accountStore = useConnectAccountStore()
  const whatsNewStore = useConnectWhatsNewStore()

  /** return the correct account creation link based on auth state */
  function createAccountUrl (): string {
    if (isAuthenticated.value) {
      return authWebUrl + 'setup-account'
    } else {
      return authWebUrl + 'choose-authentication-method'
    }
  }

  const basicAccountOptions = computed<DropdownMenuItem[]>(() => {
    const options: DropdownMenuItem[] = [{ slot: 'account', type: 'label' }]
    if ([LoginSource.BCEID, LoginSource.BCSC].includes(kcUser?.value.loginSource)) {
      options.push({
        label: t('btn.editProfile'),
        icon: 'i-mdi-account-outline',
        to: authWebUrl + 'userprofile'
      })
    }
    options.push({
      label: t('btn.logout'),
      icon: 'i-mdi-logout-variant',
      onSelect: () => logout() // localePath(config.public.appBaseUrl) ?
    })
    return options
  })

  const accountSettingsOptions = computed<DropdownMenuItem[]>(() => {
    const options: DropdownMenuItem[] = [
      {
        label: t('label.accountSettings'),
        type: 'label'
      },
      {
        label: t('btn.accountInfo'),
        icon: 'i-mdi-information-outline',
        to: authWebUrl + `account/${accountStore.currentAccount.id}/settings/account-info`
      },
      {
        label: t('btn.teamMembers'),
        icon: 'i-mdi-account-group-outline',
        to: authWebUrl + `account/${accountStore.currentAccount.id}/settings/team-members`
      }
    ]
    if ([AccountType.PREMIUM, AccountType.SBC_STAFF, AccountType.STAFF].includes(accountStore.currentAccount.accountType)) {
      options.push({
        label: t('btn.transactions'),
        icon: 'i-mdi-file-document-outline',
        to: authWebUrl + `account/${accountStore.currentAccount.id}/settings/transactions`
      })
    }
    return options
  })

  const switchAccountOptions = computed<DropdownMenuItem[]>(() => {
    const options: DropdownMenuItem[] = []

    if (accountStore.userAccounts.length > 1) {
      options.push({ label: t('label.switchAccount'), type: 'label' })

      accountStore.userAccounts.forEach((account) => {
        const isActive = accountStore.currentAccount.id === account.id
        options.push({
          label: account.label,
          onSelect: () => {
            if (!isActive && account.id) {
              if (route.meta.onAccountChange) {
                const allowAccountChange = route.meta.onAccountChange(accountStore.currentAccount, account)
                if (allowAccountChange) {
                  accountStore.switchCurrentAccount(account.id)
                }
              } else {
                accountStore.switchCurrentAccount(account.id)
              }
            }
          },
          slot: 'account-item',
          icon: isActive ? 'i-mdi-check' : '',
          class: isActive ? 'bg-bcGovGray-100 text-bcGovColor-activeBlue' : ''
        })
      })
    }

    return options
  })

  const createAccountOptions = computed<DropdownMenuItem[]>(() => {
    if ([LoginSource.BCROS, LoginSource.IDIR].includes(kcUser?.value.loginSource)) {
      return []
    }
    return [{ label: t('btn.createAccount'), icon: 'i-mdi-plus', to: createAccountUrl() }]
  })

  const loggedInUserOptions = computed<DropdownMenuItem[][]>(() => {
    const options = [
      basicAccountOptions.value,
      accountSettingsOptions.value
    ]

    if (switchAccountOptions.value.length > 0) {
      options.push(switchAccountOptions.value)
    }

    if (createAccountOptions.value.length > 0) {
      options.push(createAccountOptions.value)
    }

    return options
  })

  const loginRedirectUrl = layerConfig.login.redirectPath
    ? appBaseUrl + locale + layerConfig.login.redirectPath
    : undefined

  const loginOptionsMap: Record<'bcsc' | 'bceid' | 'idir', { label: string; icon: string; onSelect: () => Promise<void> }> = {
    bcsc: {
      label: t('label.bcsc'),
      icon: 'i-mdi-account-card-details-outline',
      onSelect: () => login(IdpHint.BCSC, loginRedirectUrl)
    },
    bceid: {
      label: t('label.bceid'),
      icon: 'i-mdi-two-factor-authentication',
      onSelect: () => login(IdpHint.BCEID, loginRedirectUrl)
    },
    idir: {
      label: t('label.idir'),
      icon: 'i-mdi-account-group-outline',
      onSelect: () => login(IdpHint.IDIR, loginRedirectUrl)
    }
  }

  const loggedOutUserOptions = computed<DropdownMenuItem[][]>(() => {
    const options: DropdownMenuItem[][] = [[{ label: t('label.selectLoginMethod'), type: 'label' }]]

    const idps = layerConfig.login.idps.map(key => loginOptionsMap[key])

    options.push(idps)

    return options
  })

  const loggedOutUserOptionsMobile = computed<DropdownMenuItem[][]>(() => {
    const config = layerConfig.header.options.unauthenticated
    const options: DropdownMenuItem[][] = []

    if (config.loginMenu) {
      options.push(...loggedOutUserOptions.value)
    }
    if (config.whatsNew) {
      options.push([{ label: t('btn.whatsNew'), slot: 'whats-new', icon: 'i-mdi-new-box', onSelect: async () => await whatsNewStore.openWhatsNewSlideover() }])
    }
    if (config.createAccount) {
      options.push([{ label: t('btn.createAccount'), icon: 'i-mdi-plus', to: createAccountUrl() }])
    }

    return options
  })

  const notificationsOptions = computed<DropdownMenuItem[][]>(() => {
    const count = accountStore.pendingApprovalCount
    const options = []
    if (count > 0) {
      options.push([{
        label: 'n/a',
        to: authWebUrl + `account/${accountStore.currentAccount.id}/settings/team-members`,
        slot: 'notifications'
      }])
    } else {
      options.push([{ label: t('notifications.none') }])
    }
    return options
  })

  function handleExternalRedirect (url: string, params?: { [key: string]: string }, target = '_self') {
    // get account id and set in params
    const redirectURL = new URL(url)
    const accountId = accountStore.currentAccount.id
    if (accountId) {
      redirectURL.searchParams.append('accountid', accountId.toString())
    }
    for (const [key, value] of Object.entries(params ?? {})) {
      redirectURL.searchParams.append(key, value)
    }
    // assume URL is always reachable
    window.open(redirectURL, target)
  }

  async function handlePaymentRedirect (paymentToken: number, redirectPath: string): Promise<void> {
    const returnUrl = encodeURIComponent(window.location.origin + localePath(redirectPath))
    const payUrl = rtc.public.paymentPortalUrl + paymentToken + '/' + returnUrl

    await navigateTo(payUrl, { external: true })
  }

  return {
    basicAccountOptions,
    accountSettingsOptions,
    switchAccountOptions,
    createAccountOptions,
    loggedInUserOptions,
    loggedOutUserOptions,
    loggedOutUserOptionsMobile,
    notificationsOptions,
    createAccountUrl,
    handleExternalRedirect,
    handlePaymentRedirect
  }
}
