import { ConnectSlideoverWhatsNew } from '#components'

export const useConnectSlideover = () => {
  const overlay = useOverlay()
  // const slideover = useSlideover()

  const whatsNew = overlay.create(ConnectSlideoverWhatsNew)

  // async function openWhatsNewSlideover () {
  //   await whatsNewSlideover.open()
  //   // slideover.open(ConnectSlideoverWhatsNew)
  // }

  return {
    whatsNew
    // openWhatsNewSlideover
  }
}
