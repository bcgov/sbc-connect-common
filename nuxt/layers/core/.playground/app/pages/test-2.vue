<script setup lang="ts">
import { manageAccountChangeAbort } from '../utils/manageAccountChangeAbort';
const localePath = useLocalePath()

setBreadcrumbs([
  { label: 'test 2nd page', to: useRuntimeConfig().public.registryHomeURL }
])

definePageMeta({
  onAccountChange: (newAccount, oldAccount) => manageAccountChangeAbort(newAccount, oldAccount)
})
const items = ref([
  {
    label: 'Backlog',
    id: 'backlog',
    icon: 'i-mdi-checkbox-blank-outline'
  },
  {
    label: 'Todo',
    id: 'todo',
    icon: 'i-mdi-checkbox-marked'
  },
  {
    label: 'In Progress',
    id: 'in_progress'
  },
  {
    label: 'Done',
    id: 'done'
  }
])
const value = ref([])
</script>
<template>
  <div class="flex flex-col gap-1 border border-black px-2 py-8 bg-white">
    <h1>
      Testing 2 page
    </h1>
    <UButton icon="i-mdi-menu" label="home page" :to="localePath('/')" size="sm" />
    <UButton label="home page" :to="localePath('/')" size="md" />
    <UButton label="home page" :to="localePath('/')" size="lg" />
    <UButton label="home page" :to="localePath('/')" size="xl" />

    <!-- input floating label example - must have empty placeholder - must use id/for or aria-label -->
    <h2>UInput</h2>
    <UInput placeholder="" id="example-floating-label-input">
      <label for="example-floating-label-input" class="floating-label-input">
        Email address
      </label>
    </UInput>
    
    <!-- text area floating label example - must have empty placeholder - must use id/for or aria-label -->
    <h2>UTextarea</h2>
    <UTextarea placeholder="" id="example-floating-label-textarea">
      <label class="floating-label-textarea" for="example-floating-label-textarea">
        Email address
      </label>
    </UTextarea>
    
    <!-- select floating label example - must have aria-label -->
    <h2>USelect</h2>
    <USelect 
      v-model="value"
      :items
      multiple
      value-key="id"
      :selected-icon="' '"
      aria-label="Select Email Address"
    >
      <template #default="{ modelValue }">
        <div class="relative px-2.5 pb-1.5 pt-5 w-full">
          <span 
            aria-hidden="true"
            class="absolute left-0 px-2.5 text-sm transition-all"
            :class="isEmpty(modelValue)
              ? 'top-1/2 -translate-y-1/2' 
              : 'top-1 -translate-y-none text-xs'"
          >
            Email Address
          </span>
          <div class="h-6">
            <span v-if="!isEmpty(modelValue)" class="line-clamp-1 text-left">
              {{ Array.isArray(modelValue) ? modelValue.join(', ') : modelValue }}
            </span>
          </div>
        </div>
      </template>
    </USelect>
  </div>
</template>
