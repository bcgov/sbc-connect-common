<script setup lang="ts">
import { useConnectWhatsNewStore } from '~/stores/connect-whats-new'

const { $sanitize } = useNuxtApp()
const store = useConnectWhatsNewStore()
</script>
<template>
  <USlideover
    title="Whats New at BC Registries"
    :overlay="false"
    :close="{
      color: 'neutral',
      variant: 'ghost',
      class: 'cursor-pointer hover:bg-gray-100/50 focus-visible:bg-transparent focus-visible:ring-2 rounded-full'
    }"
    :ui="{
      header: 'bg-bcGovColor-navDivider',
      title: 'text-midnightBlue-900',
      body: 'flex-1 overflow-y-auto p-0 sm:p-0'
    }"
  >
    <template #body>
      <div class="overflow-y-auto">
        <div class="flex-1">
          <ol>
            <li
              v-for="item, i in store.whatsNewItems"
              :key="i"
              class="flex flex-col border-b border-bcGovGray-500 p-4 last:border-0"
            >
              <h3 class="text-lg">
                {{ item.title }}
              </h3>
              <span class="text-sm text-bcGovGray-700">{{ item.date }}</span>
              <!-- eslint-disable vue/no-v-html -->
              <div
                class="pt-3 vhtml"
                v-html="$sanitize(item.description)"
              />
            </li>
          </ol>
        </div>
      </div>
    </template>
  </USlideover>
</template>
<!-- must style globally for vhtml style to work  -->
<style>
.vhtml a {
  color: #1A5A96;
  text-decoration: underline;
}
</style>
