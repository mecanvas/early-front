import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import AdminHome from 'src/components/admin/adminHome/AdminHome';
import axios from 'axios';

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const cookie = ctx.req.cookies;
  let user = null;

  if (cookie['early_auth']) {
    user = await axios.get('auth').then((res) => res.data);
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
