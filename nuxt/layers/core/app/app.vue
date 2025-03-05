<script setup lang="ts">
const { localeProperties } = useI18n()

useHead({
  htmlAttrs: {
    lang: () => localeProperties.value.code,
    dir: () => localeProperties.value.dir
  }
})

onMounted(async () => {
  await useConnectWhatsNewStore().initWhatsNew()

  const { $authApi } = useNuxtApp()
  const res = await $authApi<UserSettings[]>('/users/orgs')

  console.log(res)
})
</script>
<template>
  <!-- TODO: add locale prop to UApp -->
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
