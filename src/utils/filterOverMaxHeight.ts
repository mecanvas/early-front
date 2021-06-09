import { MAX_HEIGHT } from 'src/constants';

export const filterOverMaxHeight = (px: number) => {
  let newPx = 0;
  if (px > MAX_HEIGHT) {
    newPx = MAX_HEIGHT;
  } else {
    newPx = px;
  }
  return newPx;
};
