<script setup lang="ts">
const { createAccountUrl } = useConnectNav()
</script>
<template>
  <UButton
    color="white"
    :label="$t('btn.createAccount')"
    :to="createAccountUrl()"
  />
</template>
