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
import { DefaultSeo, NextSeo } from 'next-seo';
import Head from 'next/head';
import { MAIN_DESC, MAIN_IMAGE_URL, MAIN_TITLE, SITE_NAME } from 'src/constants/SeoOnly';
import { useRouter } from 'next/router';

const AppContainer = styled.main`
  width: 100%;
`;

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

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
        <>
          <DefaultSeo title="얼리21 어드민" />
          <NextSeo nofollow={true} noindex={true} />
        </>
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
            <meta name="naver-site-verification" content="0d191c659af4271cc443f4c7217aa1f4f56625a3" />
            <meta name="keywords" content="얼리21, 캔버스액자, 포스터, 핸드폰사진제작"></meta>
            <link rel="shortcut icon" href="/favicons/favicon.ico" />
            <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-icon-57x57.png" />
            <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-icon-60x60.png" />
            <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-icon-72x72.png" />
            <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-icon-76x76.png" />
            <link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-icon-114x114.png" />
            <link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-icon-120x120.png" />
            <link rel="apple-touch-icon" sizes="144x144" href="/favicons/apple-icon-144x144.png" />
            <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-icon-152x152.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png" />
            <link rel="icon" type="image/png" sizes="192x192" href="/favicons/android-icon-192x192.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
            <link rel="manifest" href="/favicons/manifest.json" />
            <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta name="msapplication-TileImage" content="/favicons/ms-icon-144x144.png" />
            <meta name="theme-color" content="#ffffff"></meta>
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
