import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { apolloClient } from '../apollo/client';
import { PageLayout } from '../components/layouts/PageLayout';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css';
import '../global.css';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <>
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <title>Центр финансово-правовых инициатив</title>
    </Head>
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <ToastContainer position="bottom-right" />
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </ApolloProvider>
    </SessionProvider>
  </>
);

export default App;
