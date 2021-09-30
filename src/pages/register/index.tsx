import Register from 'src/components/register/Register';
import Head from 'next/head';

const Index = () => {
  return (
    <>
      <Head>
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
      </Head>
      <Register />
    </>
  );
};

export default Index;
