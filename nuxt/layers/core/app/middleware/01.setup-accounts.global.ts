export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.client) { // only run on client
    const { isAuthenticated } = useKeycloak()
    if (isAuthenticated.value) {
      await useConnectAccountStore().initAccountStore()
    }
  }
})
