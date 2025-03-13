<script setup lang="ts">
const { createAccountUrl } = useConnectNav()
</script>
<template>
  <UButton
    color="white"
    class="px-2 py-1"
    :label="$t('btn.createAccount')"
    :to="createAccountUrl()"
  />
</template>
