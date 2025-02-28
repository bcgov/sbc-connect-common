<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const items = computed(() => {
  const options = locales.value.map((loc) => {
    const isCurrentLocal = loc.code === locale.value
    return {
      label: loc.name || 'N/A',
      icon: isCurrentLocal ? 'i-mdi-check' : '',
      onSelect: () => setLocale(loc.code),
      class: isCurrentLocal ? 'bg-bcGovGray-100 text-bcGovColor-activeBlue' : '',
      iconClass: isCurrentLocal ? 'text-bcGovColor-activeBlue' : ''
    }
  })
  return [options]
})
</script>
<template>
  <UDropdownMenu
    v-if="items[0] && items[0].length > 1"
    :items
  >
    <UButton
      icon="i-mdi-web"
      :aria-label="$t('ConnectLocaleSelect.label')"
      size="lg"
      color="white"
    />

    <template #item="{ item }">
      <div class="group flex items-center gap-1.5 w-full">
        <UIcon v-if="item.icon" :name="item.icon" :class="[item.iconClass, 'flex-shrink-0 w-5 h-5']" />
        <span :class="[item.labelClass, 'truncate']">{{ item.label }}</span>
      </div>
    </template>
  </UDropdownMenu>
</template>
