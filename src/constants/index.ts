export const MAX_HEIGHT = 1000;

//  1_000_000  = 1MB
export const IMG_LIMIT_MINIMUM_SIZE = process.env.NODE_ENV === 'production' ? 500_000 : 0;
export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://mecanvas.herokuapp.com'
    : `http://localhost:${process.env.NEXT_PUBLIC_PORT}`;
