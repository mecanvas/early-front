import dynamic from 'next/dynamic';
const AdminCanvasOrderDetail = dynamic(() => import('src/components/admin/order/AdminCanvasOrderDetail'));

export default AdminCanvasOrderDetail;
