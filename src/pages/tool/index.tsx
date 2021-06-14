import dynamic from 'next/dynamic';
import Loading from 'src/components/common/Loading';
const Tool = dynamic(() => import('src/components/tool/Tool'), { loading: () => <Loading loading /> });

export default Tool;
