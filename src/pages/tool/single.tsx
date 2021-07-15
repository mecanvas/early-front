import dynamic from 'next/dynamic';
import Loading from 'src/components/common/Loading';
import { PreventPageLeave } from 'src/hoc/PreventPageLeave';
const SingleTool = dynamic(() => import('src/components/tool/single/SingleTool'), {
  loading: () => <Loading loading />,
});

export default PreventPageLeave(SingleTool);
