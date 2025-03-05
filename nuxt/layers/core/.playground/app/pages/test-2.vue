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

    <!-- input floating label example - must have empty placeholder - must use id/for or aria-label -->
    <UInput placeholder="" id="example-floating-label-input">
      <label for="example-floating-label-input" class="floating-label-input">
        Email address
      </label>
    </UInput>
    
    <!-- text area floating label example - must have empty placeholder - must use id/for or aria-label -->
    <UTextarea placeholder="" id="example-floating-label-textarea">
      <label class="floating-label-textarea" for="example-floating-label-textarea">
        Email address
      </label>
    </UTextarea>
  </div>
</template>
