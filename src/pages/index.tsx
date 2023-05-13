import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import Spinner from '$components/Spinner';

const CreateLink = dynamic(() => import('$components/CreateLink'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Link Shortener | Next</title>
        <meta name="description" content="A custom link shortener built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-8 text-white">
        <Suspense fallback={<Spinner />}>
          <CreateLink />
        </Suspense>
      </div>
    </>
  );
}
