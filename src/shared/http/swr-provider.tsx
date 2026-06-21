import type { ReactNode } from 'react'
import { SWRConfig, type SWRConfiguration } from 'swr'

const config: SWRConfiguration = {
  revalidateOnFocus: false,
  shouldRetryOnError: true,
  errorRetryCount: 2,
  dedupingInterval: 2000,
}

export function SWRProvider({ children }: { children: ReactNode }) {
  return <SWRConfig value={config}>{children}</SWRConfig>
}
