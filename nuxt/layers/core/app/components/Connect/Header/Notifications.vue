<script setup lang="ts">
const { notificationsOptions } = useConnectNav()
const accountStore = useConnectAccountStore()
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
</script>
<template>
  <UDropdownMenu
    :items="notificationsOptions"
  >
    <!-- chip/badge displays only if pendingApprovalCount > 0 -->
    <UChip
      color="error"
      position="top-left"
      inset
      :show="accountStore.pendingApprovalCount > 0"
    >
      <UButton
        color="white"
        :label="isLargeScreen ? $t('btn.notifications.main') : undefined"
        :aria-label="$t('btn.notifications.aria', { count: accountStore.pendingApprovalCount })"
        :icon="isLargeScreen ? 'i-mdi-caret-down' : ''"
        trailing
        class="text-sm"
      >
        <template #leading>
          <UIcon name="i-mdi-bell-outline" class="size-6 shrink-0" />
        </template>
      </UButton>
    </UChip>
    <!-- notifications slot for info -->
    <template #notifications>
      <p>
        {{ $t('notifications.teamMemberApproval', { count: accountStore.pendingApprovalCount }, accountStore.pendingApprovalCount) }}
      </p>
    </template>
  </UDropdownMenu>
</template>
