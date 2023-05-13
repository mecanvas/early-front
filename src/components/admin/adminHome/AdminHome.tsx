import React, { useEffect } from 'react';
import { useAppDispatch } from 'src/hooks/useRedux';
import { UserData, getUser } from 'src/store/reducers/user';

interface Props {
  user?: UserData;
}

const AdminHome = ({ user }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getUser(user));
    }
  }, [dispatch, user]);

  return (
    <div>
      <h1>이곳은 얼리21의 어드민입니다.</h1>
    </div>
  );
};

export default AdminHome;
