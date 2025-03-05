<script setup lang="ts">
const ac = useAppConfig().connect.core.header.options.authenticated
</script>
<template>
  <div
    id="connect-header-auth-options"
    class="flex gap-1"
  >
    <!-- notifications dropdown -->
    <ConnectHeaderNotifications v-if="ac.notifications" />
    <!-- account options dropdown -->
    <ConnectHeaderAccountOptionsDropdown v-if="ac.accountOptionsMenu" />
    <!-- <ConnectHeaderAccountOptionsDropdownV2 /> -->
  </div>
</template>
