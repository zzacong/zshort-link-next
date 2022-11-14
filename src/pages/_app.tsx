import type { AppProps } from 'next/app'

import { trpc } from '$lib/trpc'
import '$styles/globals.css'

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
  return <Component {...pageProps} />
}

export default trpc.withTRPC(MyApp)
