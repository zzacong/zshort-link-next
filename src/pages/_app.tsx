import type { AppType } from 'next/app';
import { Toaster } from 'react-hot-toast';

import { api } from '~/lib/api';
import '~/styles/globals.css';

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />;
    </>
  );
};

export default api.withTRPC(MyApp);
