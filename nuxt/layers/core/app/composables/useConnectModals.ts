// https://ui.nuxt.com/components/modal#control-programmatically
import {
  ConnectModalSessionExpiring
} from '#components'

export const useConnectModals = () => {
  // const modal = useModal()
  const overlay = useOverlay()

  async function openSessionExpiringModal () {
    const modal = overlay.create(ConnectModalSessionExpiring)

    await modal.open()
  }

  return {
    openSessionExpiringModal
  }
}
