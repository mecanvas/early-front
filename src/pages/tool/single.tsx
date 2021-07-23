import dynamic from 'next/dynamic';
import { isMobile } from 'react-device-detect';
import Loading from 'src/components/common/Loading';
const SingleTool = dynamic(() => import('src/components/tool/single/SingleTool'), {
  loading: () => <Loading loading />,
});
const MobileSingleTool = dynamic(() => import('src/components/tool/mobile/MobileSingleTool'), {
  loading: () => <Loading loading />,
});

const Single = () => {
  return <>{!isMobile ? <MobileSingleTool /> : <SingleTool />}</>;
};

export default Single;
