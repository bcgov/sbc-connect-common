export default defineNuxtPlugin((nuxtApp) => {
  // load whats new only once
  nuxtApp.hook('app:mounted', async () => {
    const { $keycloak } = useNuxtApp()
    if (!$keycloak.authenticated) {
      await useConnectWhatsNewStore().initWhatsNew()
    }
  })
})