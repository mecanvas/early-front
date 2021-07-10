import React from 'react';
import dynamic from 'next/dynamic';
import Loading from 'src/components/common/Loading';
const SingleTool = dynamic(() => import('src/components/tool/single/SingleTool'), {
  loading: () => <Loading loading />,
});

export default SingleTool;
