import dynamic from 'next/dynamic';
const AdminCanvasOrderList = dynamic(() => import('src/components/admin/order/AdminCanvasOrderList'));

export default AdminCanvasOrderList;
