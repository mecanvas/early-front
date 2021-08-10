import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
const AdminCanvasOrderDetail = dynamic(() => import('src/components/admin/order/AdminCanvasOrderDetail'));

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const cookie = ctx.req.headers.cookie || '';
  let user = null;

  if (cookie) {
    user = await axios
      .get('/auth', {
        headers: {
          cookie,
        },
      })
      .then((res) => res.data);
  }

  if (user?.role === 1) {
    return {
      props: {
        user,
      },
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: '/admin/login',
    },
    props: {},
  };
};

export default AdminCanvasOrderDetail;
