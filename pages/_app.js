import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import "@/styles/globals.css"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import Header from '../components/header'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import ErrorBoundary from '../components/ErrorHandlers/ErrorBoundary'
import { ConfigProvider } from 'antd'

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <ConfigProvider>
      <Provider store={store}>
        <ErrorBoundary>
          <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
            <Header />
            <Component {...pageProps} />
            <ToastContainer />
          </SessionContextProvider>
        </ErrorBoundary>
      </Provider>
    </ConfigProvider>
  )
}

export default MyApp