import React from 'react';
import { useAppSelector } from 'src/hooks/useRedux';

const OrderSheets = () => {
  const { productOrder } = useAppSelector((state) => state.order);
  const { userData } = useAppSelector((state) => state.user);

  console.log(productOrder, userData);

  return <div></div>;
};

export default OrderSheets;
