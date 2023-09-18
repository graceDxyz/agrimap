// const BE_BASE_URL = "http://192.168.254.126:5000/api";
const isProd = import.meta.env.PROD;
export const SERVER = isProd
  ? `${window.location.origin}`
  : `http://${window.location.hostname}:5000`;
