import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import AdminHome from 'src/components/admin/adminHome/AdminHome';
import { mockAuthLogin } from 'src/utils';

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const cookie = ctx.req.headers.cookie?.includes('mockAuth=hi') || '';

  let user = null;

  if (cookie) {
    user = await mockAuthLogin().then((data) => data);
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

export default AdminHome;
