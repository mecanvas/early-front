import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import AdminHome from 'src/components/admin/adminHome/AdminHome';
import axios from 'axios';

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

export default AdminHome;
