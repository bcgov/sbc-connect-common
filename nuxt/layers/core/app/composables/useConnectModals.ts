// https://ui.nuxt.com/components/modal#control-programmatically
import {
  ConnectModalSessionExpiring
} from '#components'

export const useConnectModals = () => {
  // const modal = useModal()
  const overlay = useOverlay()

  async function openSessionExpiringModal (cb: () => void) {
    const modal = overlay.create(ConnectModalSessionExpiring, {
      props: {
        onAfterLeave () {
          cb()
        },
        closeFn: () => modal.close()
      }
    })

    await modal.open()
  }

  return {
    openSessionExpiringModal
  }
}
