import axios from 'axios';

const TOKEN =
  '5f16f99c48ad8384188157dc189e0a6abf31cf4aa6b574fea055e387223aacf33067ca9e05bd48e5f03aa56b2657585aa75ed6dabbcdb47d5e6ddccf9922b91848c94ad399421c2e6e2673f99b9eb480fb9b3215e6ff2a2b2bc101528cce0e92ebfea46ef2b3741f3510873601eaf51ea0b410cbfb8c7577ceb758ed74ece18f';
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
