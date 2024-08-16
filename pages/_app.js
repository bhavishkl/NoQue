import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import "@/styles/globals.css"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import Header from '../components/header'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { NextUIProvider } from '@nextui-org/react'

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <Provider store={store}>
      <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
        <NextUIProvider>
          <Header />
          <Component {...pageProps} />
          <ToastContainer />
        </NextUIProvider>
      </SessionContextProvider>
    </Provider>
  )
}

export default MyApp