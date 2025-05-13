export default defineNuxtPlugin(() => {
  const authApiUrl = useRuntimeConfig().public.authApiURL
  const authApiKey = useRuntimeConfig().public.authApiKey
  const errorRedirectPath = useAppConfig().connect.core.plugin.authApi.errorRedirect[401]
  const { $keycloak } = useNuxtApp()
  const localePath = useLocalePath()

  const api = $fetch.create({
    baseURL: authApiUrl,
    onRequest ({ options }) {
      const headers = options.headers ||= {} as Headers
      const bearerToken = `Bearer ${$keycloak.token}`
      if (Array.isArray(headers)) {
        headers.push(['Authorization', bearerToken])
        if (authApiKey) {
          headers.push(['x-apikey', authApiKey])
        }
      } else if (headers instanceof Headers) {
        headers.set('Authorization', bearerToken)
        if (authApiKey) {
          headers.set('x-apikey', authApiKey)
        }
      } else {
        // @ts-expect-error - 'Authorization' doesnt exist on type Headers
        headers.Authorization = bearerToken
        if (authApiKey) {
          // @ts-expect-error - 'Authorization' doesnt exist on type Headers
          headers['x-apikey'] = authApiKey
        }
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
      authApi: api
    }
  }
})
