import React from 'react';
import { UserData } from 'src/store/reducers/user';
import AdminGoldenKeywords from './AdminGoldenKeywords';

interface Props {
  user?: UserData;
}

const AdminHome = ({ user }: Props) => {
  console.log(user);

  return (
    <div>
      <AdminGoldenKeywords />
    </div>
  );
};

export default AdminHome;
