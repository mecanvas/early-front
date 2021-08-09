import { GetServerSideProps } from 'next';
import AdminHome from 'src/components/admin/adminHome/AdminHome';

export const getServerSideProps: GetServerSideProps = async () => {
  const user = { role: 1 };

  if (user.role === 1) {
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
