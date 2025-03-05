<script setup lang="ts">
import { manageAccountChangeAbort } from '../utils/manageAccountChangeAbort';
const localePath = useLocalePath()

setBreadcrumbs([
  { label: 'test 2nd page', to: useRuntimeConfig().public.registryHomeURL }
])

definePageMeta({
  onAccountChange: (newAccount, oldAccount) => manageAccountChangeAbort(newAccount, oldAccount)
})
const user = ref('')
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
</script>
<template>
  <div class="flex flex-col gap-8 border border-black px-2 py-8 bg-white">
    <h1>
      Testing 2 page
    </h1>
    <UButton label="home page" :to="localePath('/')" />

    <!-- input floating label example -->
    <UInput placeholder="">
      <label class="floating-label-input">
        Email address
      </label>
    </UInput>
    
    <UTextarea placeholder="" :ui="{ base: 'peer' }">
      <label class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-norma">
        <span class="inline-flex bg-(--ui-bg) px-1">Email address</span>
      </label>
    </UTextarea>
  </div>
</template>
