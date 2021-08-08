import { AppProps } from 'next/dist/next-server/lib/router/router';
import '../style/style.less';
import styled from '@emotion/styled';
import AppLayout from 'src/components/layouts/AppLayout';
import axios from 'axios';
import { ThemeProvider } from '@emotion/react';
import { theme } from 'src/style/theme';
import { API_URL, MY_URL } from 'src/constants';
import { isIE } from 'react-device-detect';
import { icons } from 'public/icons';
import { store } from 'src/store/config';
import { Provider } from 'react-redux';
import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import { MAIN_DESC, MAIN_IMAGE_URL, MAIN_TITLE, SITE_NAME } from 'src/constants/SeoOnly';
import { useRouter } from 'next/router';

const AppContainer = styled.main`
  width: 100%;
`;

axios.defaults.baseURL = API_URL;

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  if (isIE) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <img src={icons.curi} width={150} height={200} style={{ marginBottom: '1em' }} />
        <p>
          얼리21은 <b>크롬</b>에 최적화 되어있습니다. <br />
          인터넷 익스플로러는 지원하지 않습니다.
          <br />
          쾌적한 이용을 위해 최신 버전의 크롬을 사용해 주세요.
        </p>
        <button
          type="button"
          style={{
            background: '#fff',
            borderRadius: '8px',
            color: '#333',
            border: '1px solid #dbdbdb',
            padding: '0.5em 1em',
            fontSize: '14px',
            outline: 'none',
          }}
        >
          <a href="https://www.google.co.kr/chrome/?brand=IBEF&gclid=Cj0KCQjw6NmHBhD2ARIsAI3hrM3WOKokUG0vn2pVSSAa1Sq9GAeovJp0XBLN-9f8mlccUatzaDs89akaAhHJEALw_wcB&gclsrc=aw.ds">
            크롬 다운로드
          </a>
        </button>
      </div>
    );
  }
  return (
    <>
      {pathname.includes('admin') ? (
        <DefaultSeo nofollow={true} noindex={true} title="얼리21 어드민" />
      ) : (
        <>
          <DefaultSeo
            title={MAIN_TITLE}
            description={MAIN_DESC}
            openGraph={{
              type: 'website',
              url: MY_URL,
              title: MAIN_TITLE,
              description: MAIN_DESC,
              site_name: SITE_NAME,
              images: [
                {
                  url: MAIN_IMAGE_URL,
                  alt: MAIN_TITLE,
                },
              ],
            }}
            twitter={{
              handle: '@handle',
              site: '@site',
              cardType: 'summary_large_image',
            }}
            canonical={MY_URL}
          />
          <Head>
            <meta name="keywords" content="얼리21, 캔버스액자, 포스터, 핸드폰사진제작"></meta>
          </Head>
        </>
      )}

      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AppLayout>
            <AppContainer>
              <Component {...pageProps} />
            </AppContainer>
          </AppLayout>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
