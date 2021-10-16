// 조건부 무료배송시, 제한 조건에 닿았는지 확인

export const checkDeliverLimit = (price: number, limit: number) => {
  if (price > limit) {
    return true; // 무료 배송
  }
  return false;
};
