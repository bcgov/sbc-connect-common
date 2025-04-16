<script setup lang="ts">
const isSmallScreen = useMediaQuery('(max-width: 640px)')
const modalTimeout = useRuntimeConfig().public.sessionExpiredModalTimeout
const { t } = useI18n()
const route = useRoute()

const emit = defineEmits<{ close: [] }>()

const timeRemaining = ref(toValue((modalTimeout as number) / 1000))

const intervalId = setInterval(async () => {
  const value = timeRemaining.value - 1
  timeRemaining.value = value < 0 ? 0 : value

  if (value === 0) {
    if (route.meta.onBeforeSessionExpired) {
      await route.meta.onBeforeSessionExpired()
    }
    sessionStorage.setItem(ConnectStorageKeys.CONNECT_SESSION_EXPIRED, 'true')
    await useKeycloak().logout()
  }
}, 1000)

const ariaCountdownText = computed(() => {
  if (timeRemaining.value === 30) { // trigger aria alert when 30 seconds remain
    return t('ConnectModalSessionExpiring.content', { count: timeRemaining.value })
  } else if (timeRemaining.value === 2) { // trigger aria alert when session expires
    return t('ConnectModalSessionExpiring.sessionExpired')
  } else {
    return ''
  }
})

function closeModal () {
  clearInterval(intervalId)
  emit('close')
}

onMounted(() => {
  // allow any keypress to close the modal
  window.addEventListener('keydown', closeModal)
})

onUnmounted(() => {
  // cleanup
  window.removeEventListener('keydown', closeModal)
})
</script>
<template>
  <UModal
    id="session-expired-dialog"
    overlay
    :title="$t('ConnectModalSessionExpiring.title')"
    :description="$t('ConnectModalSessionExpiring.content', { count: timeRemaining })"
    @after:leave="closeModal"
  >
    <template #content>
      <div class="px-6 py-6 flex flex-col gap-6">
        <div role="alert">
          <h2
            id="session-expired-dialog-title"
            class="text-xl font-semibold text-bcGovColor-darkGray"
          >
            {{ $t('ConnectModalSessionExpiring.title') }}
          </h2>
        </div>
        <div>
          <ConnectI18nHelper
            id="session-expired-dialog-description"
            translation-path="ConnectModalSessionExpiring.content"
            :count="timeRemaining"
          />

          <div role="alert">
            <span class="sr-only">{{ ariaCountdownText }}</span>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <UButton
            :block="isSmallScreen"
            :label="$t('ConnectModalSessionExpiring.continueBtn.main')"
            :aria-label="$t('ConnectModalSessionExpiring.continueBtn.aria')"
            size="xl"
            class="font-bold"
            @click="closeModal"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
