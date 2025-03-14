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
    :ui="{
      base: 'ring-(--ui-error)'
    }"
  >
    <UButton
      color="white"
      class="px-2 py-1 text-sm"
      :label="$t('btn.whatsNew')"
      @click="store.openWhatsNewSlideover"
    />
  </UChip>
</template>
