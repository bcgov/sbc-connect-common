import type { Pinia, Store } from 'pinia'
import { getActivePinia } from 'pinia'

interface ExtendedPinia extends Pinia {
  _s: Map<string, Store>;
}

/**
 * Resets specific Pinia stores if store IDs are specified. If no IDs are provided, resets all stores that have a `$reset` method.
 * @param {string[]} storeIds - Array of store IDs to reset. If empty, all stores will be reset.
 */
export function resetPiniaStores (storeIds: string[] = []): void {
  const pinia = getActivePinia() as ExtendedPinia
  const env = useRuntimeConfig().public.environment

  if (!pinia) {
    console.error('There are no stores')
  }

  // null check still fails so must catch error instead
  pinia._s.forEach((store) => {
    if (storeIds.length === 0 || storeIds.includes(store.$id)) {
      try {
        store.$reset()
      } catch {
        if (env === 'Development') {
          console.warn(`Store "${store.$id}" does not implement $reset. Skipping reset.`)
        }
      }
    }
  })
}
