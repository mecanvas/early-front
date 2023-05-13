import { CanvasOrderDetail } from 'src/interfaces/admin/CanvasOrderInterface';
import adminOrderListFixture from '../fixtures/adminOrderListFixture.json';

export async function adminOrderListFetcher() {
  return Promise.resolve({
    total: adminOrderListFixture.length,
    results: adminOrderListFixture,
  });
}

export async function adminOrderDetailFetcher(canvasOrderId: string) {
  const order = adminOrderListFixture.find(({ id }) => Number(canvasOrderId) === id);

  if (!order) {
    return {
      canvasFrameUrls: [],
      id: 0,
      orderNo: 0,
      username: '',
      phone: '',
      orderRoute: 0,
      originImgUrl: '',
      scaleType: 1,
      paperNames: [],
      createdAt: '',
    };
  }

  const result: CanvasOrderDetail = {
    canvasFrameUrls: [order.originImgUrl],
    id: order.id,
    orderNo: order.orderNo,
    username: order.username,
    phone: order.phone,
    orderRoute: order.orderRoute,
    originImgUrl: order.originImgUrl,
    paperNames: order.paperNames,
    createdAt: order.createdAt,
    scaleType: Math.ceil(Math.random() * 3),
  };

  return result;
}
