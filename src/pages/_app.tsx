import { AppProps } from 'next/dist/next-server/lib/router/router';
import '../style/style.less';
import styled from '@emotion/styled';
import AppLayout from 'src/components/layouts/AppLayout';
import axios from 'axios';
import { ThemeProvider } from '@emotion/react';
import { theme } from 'src/style/theme';

const AppContainer = styled.main`
  width: 100%;
`;

axios.defaults.baseURL = 'http://localhost:4000';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppLayout>
          <AppContainer>
            <Component {...pageProps} />
          </AppContainer>
        </AppLayout>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
