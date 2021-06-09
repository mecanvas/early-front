export const MAX_HEIGHT = 1000;

export const API_URL =
  process.env.NODE_ENV === 'production' ? 'https://mecanvas.herokuapp.com' : `http://localhost:${process.env.API_PORT}`;
