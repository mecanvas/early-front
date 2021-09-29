import OrderSheets from 'src/components/order/OrderSheets';
import Head from 'next/head';

const ProductOrder = () => {
  return (
    <>
      <Head>
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
      </Head>
      <OrderSheets />
    </>
  );
};

export default ProductOrder;
