import axios from 'axios';

const TOKEN =
  '66aefd775b9cc8d9903e8c7ca502a6c65ac2992ee7e6f9d82dbcbb7e89c354ebf2109190a77091016ffd2c0eb1cb0815acaaa6eaef618cd10f7edd376df9c2d22c07fb2f20030e97e169d51fcfe13021efd2611feef462c66f1b36ea8f3111623a9fc366cd41be00226ef871b8938440f9c4a87761b3e7960a8e1ea2427a621e';
const request = axios.create({
  baseURL: 'https://flex2earn.virtualx.vn/',
  headers: {Accept: '*/*'},
});
// for multiple requests

request.interceptors.request.use(
  async (config) => {
    // Do something before API is sent
    const token = TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with API error
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Check network first
    // status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const {response} = error || {};
    const {data} = response || {};
    const {errorMessage, errorKey} = data || {};

    error.message = errorMessage;
    error.keyMessage = errorKey || '';
    return Promise.reject(error.message);
  },
);

export default request;
