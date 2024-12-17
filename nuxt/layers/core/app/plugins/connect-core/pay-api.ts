export default defineNuxtPlugin(() => {
  const payApiUrl = useRuntimeConfig().public.payApiURL
  const errorRedirectPath = useAppConfig().connect.core.plugin.payApi.errorRedirect[401]
  const { $keycloak } = useNuxtApp()
  const localePath = useLocalePath()

  const api = $fetch.create({
    baseURL: payApiUrl,
    onRequest ({ options }) {
      const headers = options.headers ||= {}
      if (Array.isArray(headers)) {
        headers.push(['Authorization', `Bearer ${$keycloak.token}`])
      } else if (headers instanceof Headers) {
        headers.set('Authorization', `Bearer ${$keycloak.token}`)
      } else {
        headers.Authorization = `Bearer ${$keycloak.token}`
      }
    },
    async onResponseError ({ response }) {
      if (response.status === 401) {
        await navigateTo(localePath(errorRedirectPath))
      }
    }
  })

  return {
    provide: {
      payApi: api
    }
  }
})
