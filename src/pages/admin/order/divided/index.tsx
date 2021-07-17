import dynamic from 'next/dynamic';
const AdminCanvasOrderList = dynamic(() => import('src/components/admin/canvasorder/AdminCanvasOrderList'));

export default AdminCanvasOrderList;
