import dynamic from 'next/dynamic';
import Loading from 'src/components/common/Loading';
import SEO from 'src/components/common/SEO';
const DividedTool = dynamic(() => import('src/components/tool/divided/DividedTool'), {
  loading: () => <Loading loading />,
});

const Divided = () => {
  return (
    <>
      <SEO title="내가 직접 고른 이미지를 내 품으로" desc="내 공간에 어울리는 이미지를 골라 제작해 보세요." />
      <DividedTool></DividedTool>
    </>
  );
};

export default Divided;
