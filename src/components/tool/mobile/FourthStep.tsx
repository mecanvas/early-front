import React, { useEffect, useRef } from 'react';
import { useAppSelector } from 'src/hooks/useRedux';

const FourthStep = () => {
  const { canvasSaveList } = useAppSelector((state) => state.canvas);

  return <div></div>;
};

export default FourthStep;
