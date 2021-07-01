export const MAX_HEIGHT = 1000;

//  1_000_000  = 1MB
export const IMG_LIMIT_MINIMUM_SIZE = process.env.NODE_ENV === 'production' ? 500_000 : 0;
export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://mecanvas.herokuapp.com'
    : `http://localhost:${process.env.NEXT_PUBLIC_PORT}`;

// 해당하는 routes들은 false를 반환합니다.
export const exceptionRoutes = ['/tool', '/404'];

export const S3_URL = 'https://mecanvas-assets.s3.ap-northeast-2.amazonaws.com/assets';
