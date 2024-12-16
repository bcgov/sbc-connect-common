export default defineNuxtPlugin({
  name: 'core-pay-api-plugin',
  parallel: true,
  dependsOn: ['core-keycloak-plugin'],
  setup () {
    const payApiUrl = useRuntimeConfig().public.payApiURL
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
          await navigateTo(localePath('/'))
        }
      }
    })

    return {
      provide: {
        payApi: api
      }
    }
  }
})
