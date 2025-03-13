<script setup lang="ts">
const { login } = useKeycloak()
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>
<template>
  <div class="flex flex-col gap-8 border border-black px-2 py-8">
    <h1>
      Testing
    </h1>

    <div class="size-20 bg-midnightBlue-600"></div>

    <ConnectSpinner />

    <USelect v-model="value" :items="items" class="w-48" />

    <ClientOnly>
      <UButton v-if="!isAuthenticated" label="Login" @click="login(IdpHint.BCSC)" />
      <UButton v-else-if="isAuthenticated" label="Logout" @click="logout()" />
      <div> {{ isAuthenticated }} </div>
    </ClientOnly>

    <ConnectPageSection
      :heading="{ label: 'Hello World', icon: 'i-mdi-account-multiple', ui: 'rounded-t-sm bg-red-200' }"
      :actions="actions"
    >
      some stuff
    </ConnectPageSection>

    <ConnectI18nHelper translation-path="test.i18nBold.italic" />

    <UButton 
      label="test resetPiniaStores"
      @click="resetPiniaStores(['core-test-store'])"
    />
  </div>
</template>
