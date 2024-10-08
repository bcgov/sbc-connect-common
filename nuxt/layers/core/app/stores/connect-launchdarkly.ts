import { initialize } from 'launchdarkly-js-client-sdk'
import type { LDClient, LDFlagSet, LDOptions, LDMultiKindContext } from 'launchdarkly-js-client-sdk'

export const useConnectLaunchdarklyStore = defineStore('nuxt-core-connect-ld-store', () => {
  const keycloak = reactive(useKeycloak())
  const accountStore = useConnectAccountStore()
  const ldClient: Ref<LDClient | null> = ref(null)
  const ldContext = ref({
    kind: 'multi',
    org: { key: 'anonymous' },
    user: { key: 'anonymous' }
  } as LDMultiKindContext)
  const ldFlagSet: Ref<LDFlagSet> = ref({})
  const ldInitialized = ref(false)

  function init () {
    if (ldInitialized.value) {
      console.info('Launchdarkly already initialized.')
      return
    }
    const ldClientId = useRuntimeConfig().public.ldClientId
    if (!ldClientId) {
      console.info('No launchdarkly sdk variable set. Aborting launchdarkly setup.')
      return
    }
    const appName = useRuntimeConfig().public.appName
    let user: any = { key: 'anonymous', appSource: appName }
    let org: any = { key: 'anonymous', appName }
    if (keycloak.isAuthenticated) {
      user = {
        key: keycloak.kcUser.keycloakGuid,
        firstName: keycloak.kcUser.firstName,
        lastName: keycloak.kcUser.lastName,
        email: keycloak.kcUser.email,
        roles: keycloak.kcUser.roles,
        loginSource: keycloak.kcUser.loginSource,
        appSource: appName
      }
    }
    if (accountStore.currentAccount.id) {
      org = {
        key: accountStore.currentAccount.id,
        accountType: accountStore.currentAccount.accountType,
        accountStatus: accountStore.currentAccount.accountStatus,
        type: accountStore.currentAccount.type,
        label: accountStore.currentAccount.label,
        appSource: appName
      }
    }
    ldContext.value = { kind: 'multi', org, user }
    const options: LDOptions = {
      streaming: false,
      useReport: false,
      diagnosticOptOut: true
    }
    ldClient.value = initialize(ldClientId, ldContext.value, options)
    ldClient.value.on('initialized', () => {
      ldFlagSet.value = ldClient.value?.allFlags() || {}
      ldInitialized.value = true
      console.info('launchdarkly initialization complete.')
    })
  }

  function getFeatureFlag (name: string): any {
    return ldClient.value ? ldClient.value.variation(name) : null
  }

  function getStoredFlag (name: string): any {
    if (!ldInitialized) {
      console.warn('Accessing ldarkly stored flag, but ldarkly is not initialized.')
    }
    return ldFlagSet.value[name]
  }

  function $reset () {
    ldInitialized.value = false
    ldClient.value = null
    ldFlagSet.value = {}
  }

  return {
    ldClient,
    ldContext,
    ldFlagSet,
    ldInitialized,
    init,
    getFeatureFlag,
    getStoredFlag,
    $reset
  }
})
