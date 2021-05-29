import { AppProps } from 'next/dist/next-server/lib/router/router';
import '../style/style.less';
import styled from '@emotion/styled';
import AppLayout from 'src/components/layouts/AppLayout';
import axios from 'axios';

const AppContainer = styled.main`
  width: 100%;
  height: calc(100vh - 50px);
`;

axios.defaults.baseURL = 'http://localhost:4000';

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
