import dynamic from 'next/dynamic';
import Loading from 'src/components/common/Loading';
const Tool = dynamic(() => import('src/components/tool/divided/DividedTool'), { loading: () => <Loading loading /> });

export default Tool;
