import dynamic from 'next/dynamic';
const AdminCanvasOrderDetail = dynamic(() => import('src/components/admin/canvasorder/AdminCanvasOrderDetail'));

export default AdminCanvasOrderDetail;
