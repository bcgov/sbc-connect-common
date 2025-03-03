<script setup lang="ts">
defineProps<{
  text: string
  id?: string
}>()

const isTouchScreen = useMediaQuery('(pointer: coarse)')
</script>
<template>
  <div class="inline-flex items-center align-text-top">
    <UPopover
      :mode="isTouchScreen ? 'click' : 'hover'"
      arrow
      :ui="{
        content: 'bg-gray-700 rounded ring-gray-700',
        arrow: 'fill-gray-700'
      }"
    >
      <template #default="{ open }">
        <UButton
          type="button"
          :padded="false"
          color="white"
          icon="i-mdi-info-outline"
          class="cursor-default"
          :aria-label="open ? $t('btn.appVersion.hide') : $t('btn.appVersion.show')"
        />
        <!-- live region will announce text when button opens popover -->
        <span role="status" class="sr-only">
          {{ open ? text : '' }}
        </span>
      </template>

      <template #content>
        <p class="p-2.5 text-xs font-normal text-white">
          {{ text }}
        </p>
      </template>
    </UPopover>
  </div>
</template>
