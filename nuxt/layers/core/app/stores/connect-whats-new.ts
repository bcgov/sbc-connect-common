interface WhatsNewItem {
  app: string
  date: string
  description: string
  id:number
  priority: boolean
  read: boolean
  title: string
}

export const useConnectWhatsNewStore = defineStore('connect-core-whatsnew-store', () => {
  const statusApiUrl = useRuntimeConfig().public.statusApiURL
  const { whatsNew } = useConnectSlideover()

  const hasViewedWhatsNew = ref<boolean>(false)
  const whatsNewItems = ref<WhatsNewItem[]>([])

  async function initWhatsNew () {
    try {
      const res = await fetch(`${statusApiUrl}/whatsnew`) // $fetch not working correctly
      whatsNewItems.value = await res.json() as WhatsNewItem[]
    } catch (e) {
      logFetchError(e, 'Error fetching whats new items')
    }
  }

  async function openWhatsNewSlideover () {
    hasViewedWhatsNew.value = true
    await whatsNew.open()
  }

  function $reset () {
    sessionStorage.removeItem('connect-core-whatsnew-store')
    whatsNewItems.value = []
    hasViewedWhatsNew.value = false
  }

  return {
    initWhatsNew,
    openWhatsNewSlideover,
    whatsNewItems,
    hasViewedWhatsNew,
    $reset
  }
}, { persist: true }) // set has viewed in session storage to persist across page refreshes
