export const getPosition = (event: any) => {
  if (event.type === 'touchmove') {
    const touchs = event.changedTouches[0];
    const x = touchs.clientX;
    const y = touchs.clientY;
    return [x, y];
  }
  const x = event.clientX;
  const y = event.clientY;
  return [x, y];
};
