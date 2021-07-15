import dynamic from 'next/dynamic';
import Loading from 'src/components/common/Loading';
import { PreventPageLeave } from 'src/hoc/PreventPageLeave';
const DividedTool = dynamic(() => import('src/components/tool/divided/DividedTool'), {
  loading: () => <Loading loading />,
});

export default PreventPageLeave(DividedTool);
