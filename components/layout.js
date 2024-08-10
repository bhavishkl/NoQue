import { useState } from 'react';
import Head from 'next/head';
import Header from './header';
import BottomBar from './BottomBar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>NoQue</title>
        <meta name="description" content="QueueMaster: The ultimate marketplace for queue management solutions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow pb-16 sm:pb-0">
        {children}
      </main>

      <BottomBar />
    </div>
  );
};

export default Layout;