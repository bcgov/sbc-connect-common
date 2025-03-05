<script setup lang="ts">
const ac = useAppConfig().connect.core.header.options.unauthenticated
</script>
<template>
  <div
    id="connect-header-unauth-options"
    class="flex gap-1"
  >
    <!-- whats new slideover -->
    <ConnectHeaderWhatsNew v-if="ac.whatsNew" class="hidden lg:flex" />
    <!-- login options dropdown or main menu on small screens -->
    <ConnectHeaderLoginOptionsDropdown v-if="ac.loginMenu" />
    <!-- create account button, hidden on small screens -->
    <ConnectHeaderCreateAccountBtn v-if="ac.createAccount" class="hidden lg:flex" />
  </div>
</template>
