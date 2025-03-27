<script setup lang="ts">
const { loggedInUserOptions } = useConnectNav()
const { kcUser } = useKeycloak()
const accountStore = useConnectAccountStore()
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
</script>
<template>
  <UDropdownMenu
    id="account-options-dropdown"
    :items="loggedInUserOptions"
    :ui="{
      content: 'max-w-[90dvw]'
    }"
  >
    <UButton
      id="account-options-button"
      color="white"
      :aria-label="$t('btn.accountOptionsMenu')"
      :icon="isLargeScreen ? 'i-mdi-caret-down' : ''"
      trailing
      class="px-2 py-1"
    >
      <ConnectHeaderAccountLabel
        class="hidden lg:flex"
        :username="parseSpecialChars(kcUser.fullName, 'USER')"
        :account-name="accountStore.currentAccount.label ? parseSpecialChars(accountStore.currentAccount.label, 'ACCOUNT') : ''"
      />

      <UAvatar
        :text="parseSpecialChars(kcUser.fullName, 'U')[0]!.toUpperCase()"
        size="md"
        class="lg:hidden"
        :ui="{ root: 'bg-blue-300 rounded-none text-lg', fallback: 'text-white font-bold' }"
      />
    </UButton>
    <!-- account label slot -->
    <template #account>
      <ConnectHeaderAccountLabel
        :username="parseSpecialChars(kcUser.fullName, 'USER')"
        :account-name="accountStore.currentAccount.label ? parseSpecialChars(accountStore.currentAccount.label, 'ACCOUNT') : ''"
        theme="dropdown"
      />
    </template>

    <!-- account item slot required for icon color and label padding -->
    <template #account-item="{ item }">
      <UIcon
        v-if="item.icon"
        :name="item.icon"
        class="size-5 text-blue-500 shrink-0"
      />
      <span :class="{ 'pl-6': !item.icon }">
        {{ item.label }}
      </span>
    </template>
  </UDropdownMenu>
</template>
