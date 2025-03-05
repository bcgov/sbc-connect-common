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
