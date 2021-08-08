import dynamic from 'next/dynamic';
import Loading from 'src/components/common/Loading';
import SEO from 'src/components/common/SEO';
import { TOOL_SEO } from 'src/constants/SeoOnly';
const DividedTool = dynamic(() => import('src/components/tool/divided/DividedTool'), {
  loading: () => <Loading loading />,
});

const Divided = () => {
  return (
    <>
      <SEO {...TOOL_SEO} />
      <DividedTool></DividedTool>
    </>
  );
};

export default Divided;
