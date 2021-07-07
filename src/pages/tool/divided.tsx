import dynamic from 'next/dynamic';
import Loading from 'src/components/common/Loading';
const DividedTool = dynamic(() => import('src/components/tool/divided/DividedTool'), {
  loading: () => <Loading loading />,
});

export default DividedTool;
