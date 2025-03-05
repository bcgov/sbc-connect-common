<script setup lang="ts">
import { useConnectWhatsNewStore } from '~/stores/connect-whats-new'

const store = useConnectWhatsNewStore()
</script>
<template>
  <UChip
    :show="!store.hasViewedWhatsNew && !!store.whatsNewItems.length"
    color="error"
    position="top-left"
    inset
  >
    <UButton
      color="white"
      :label="$t('btn.whatsNew')"
      @click="store.openWhatsNewSlideover"
    />
  </UChip>
</template>
