import React from 'react';
import { UserData } from 'src/store/reducers/user';

interface Props {
  user?: UserData;
}

const AdminHome = ({ user }: Props) => {
  console.log(user);

  return <div>g2</div>;
};

export default AdminHome;
