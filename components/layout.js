import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from './header';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const DynamicBottomBar = dynamic(() => import('./BottomBar'), {
  ssr: false
});

const Layout = ({ children }) => {
  const router = useRouter();
  const [pageKey, setPageKey] = useState('');

  useEffect(() => {
    const handleRouteChange = (url) => {
      setPageKey(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>NoQue</title>
        <meta name="description" content="QueueMaster: The ultimate marketplace for queue management solutions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main key={pageKey} className="flex-grow pb-16 sm:pb-0 transition-opacity duration-300 ease-in-out">
        {children}
      </main>

      <DynamicBottomBar />
    </div>
  );
};

export default Layout;