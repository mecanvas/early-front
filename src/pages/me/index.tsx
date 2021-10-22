import Me from 'src/components/me/Me';
import Head from 'next/head';

const Index = () => {
  return (
    <>
      <Head>
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
      </Head>
      <Me />
    </>
  );
};

export default Index;
