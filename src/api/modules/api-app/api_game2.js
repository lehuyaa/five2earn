import request from '../../request';

export const getListAnswer = async () => {
  return await request.get(`api/passwords`);
};

export const checkStatusGame = async (params) => {
  return await request.get(`api/password-hunts`, {params});
};

export const createSessionGame = async (params) => {
  return await request.post(`api/password-hunts`, params);
};

export const updateStatusGame = async (params, id) => {
  return await request.put(`api/password-hunts/${id}`, params);
};
