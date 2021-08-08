import dynamic from 'next/dynamic';
import React from 'react';
import Loading from 'src/components/common/Loading';
import SEO from 'src/components/common/SEO';
// const SingleTool = dynamic(() => import('src/components/tool/single/SingleTool'), {
//   loading: () => <Loading loading />,
// });
const MobileSingleTool = dynamic(() => import('src/components/tool/mobile/MobileSingleTool'), {
  loading: () => <Loading loading />,
});

const Single = () => {
  return (
    <>
      <SEO title="내가 직접 고른 이미지를 내 품으로" desc="내 공간에 어울리는 이미지를 골라 제작해 보세요." />
      <MobileSingleTool />
    </>
  );
};

export default Single;
