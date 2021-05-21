import { AppProps } from 'next/dist/next-server/lib/router/router';
import '../styles/globals.css';
import styled from '@emotion/styled';
import AppLayout from 'src/components/layouts/AppLayout';

const AppContainer = styled.main`
  width: 100%;
  height: calc(100vh - 50px);
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppLayout>
      <AppContainer>
        <Component {...pageProps} />
      </AppContainer>
    </AppLayout>
  );
}

export default MyApp;