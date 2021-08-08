import dynamic from 'next/dynamic';
import React from 'react';
import Loading from 'src/components/common/Loading';
import SEO from 'src/components/common/SEO';
import { TOOL_SEO } from 'src/constants/SeoOnly';
// const SingleTool = dynamic(() => import('src/components/tool/single/SingleTool'), {
//   loading: () => <Loading loading />,
// });
const MobileSingleTool = dynamic(() => import('src/components/tool/mobile/MobileSingleTool'), {
  loading: () => <Loading loading />,
});

const Single = () => {
  return (
    <>
      <SEO {...TOOL_SEO} />
      <MobileSingleTool />
    </>
  );
};

export default Single;
