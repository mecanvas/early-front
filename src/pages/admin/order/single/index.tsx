import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { mockAuthLogin } from 'src/utils';
const AdminCanvasOrderList = dynamic(() => import('src/components/admin/order/AdminCanvasOrderList'));

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const cookie = ctx.req.headers.cookie || '';
  let user = null;

  if (cookie) {
    user = await mockAuthLogin().then((res) => res);
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

export default AdminCanvasOrderList;
