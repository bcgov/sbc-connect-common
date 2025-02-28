<script setup lang="ts">
import { useConnectWhatsNewStore } from './stores/connect-whats-new'

const i18nHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true
})

// set lang and dir attributes on head
useHead({
  htmlAttrs: {
    lang: () => i18nHead.value.htmlAttrs!.lang,
    dir: () => i18nHead.value.htmlAttrs!.dir
  }
})

onMounted(async () => {
  await useConnectWhatsNewStore().initWhatsNew()
})
</script>
<template>
  <NuxtLayout>
    <UApp>
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>
