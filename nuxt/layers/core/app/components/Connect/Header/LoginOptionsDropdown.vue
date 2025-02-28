<script setup lang="ts">
import { useConnectWhatsNewStore } from '~/stores/connect-whats-new'

const { loggedOutUserOptions, loggedOutUserOptionsMobile } = useConnectNav()
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const whatsNewStore = useConnectWhatsNewStore()
</script>
<template>
  <UDropdownMenu
    id="logged-out-options-dropdown"
    :items="isLargeScreen ? loggedOutUserOptions : loggedOutUserOptionsMobile"
  >
    <UButton
      color="white"
      :label="isLargeScreen ? $t('btn.login') : undefined"
      :aria-label="isLargeScreen ? $t('label.selectLoginMethod') : $t('btn.mainMenu')"
      :icon="isLargeScreen ? 'i-mdi-caret-down' : 'i-mdi-menu'"
      trailing
    />

    <!-- whats new slot, only shows on small screens -->
    <template #whats-new="{ item }">
      <UIcon v-if="item.icon" :name="item.icon" class="size-6 shrink-0 text-bcGovColor-midGray" />
      <span class="truncate">{{ item.label }}</span>
      <span v-if="!whatsNewStore.hasViewedWhatsNew && !!whatsNewStore.whatsNewItems.length" class="size-2 rounded-full bg-red-500" />
    </template>
  </UDropdownMenu>
</template>
