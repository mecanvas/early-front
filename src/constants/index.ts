const { NODE_ENV, API_PORT } = process.env;

export const MAX_HEIGHT = 1000;

export const API_URL = NODE_ENV === 'production' ? 'https://mecanvas.herokuapp.com' : `http://localhost:${API_PORT}`;
