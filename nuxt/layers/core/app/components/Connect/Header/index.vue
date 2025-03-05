<script setup lang="ts">
const { isAuthenticated } = useKeycloak()
const ac = useAppConfig().connect.core.header.options
</script>
<template>
  <ConnectHeaderWrapper>
    <div class="flex items-center justify-between">
      <ConnectHeaderLogoHomeLink />
      <ClientOnly>
        <div class="flex gap-1">
          <ConnectHeaderAuthenticatedOptions v-if="isAuthenticated" />
          <ConnectHeaderUnauthenticatedOptions v-else />
          <ConnectLocaleSelect v-if="ac.localeSelect" />
        </div>
      </ClientOnly>
    </div>
  </ConnectHeaderWrapper>
</template>
