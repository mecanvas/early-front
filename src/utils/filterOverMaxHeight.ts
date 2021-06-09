export const filterOverMaxHeight = (px: number) => {
  let newPx = 0;
  if (px > 1000) {
    newPx = 1000;
  } else {
    newPx = px;
  }
  return newPx;
};
