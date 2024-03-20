import request from '../../request';

export const checkNFC = async (nfcId) => {
  return await request.get(`api/list-nfcs?filters[IdNFC][$eq]=${nfcId}`);
};

export const getIndexQuestion = async (nfcId) => {
  return await request.get(`api/feedbacks?filters[IdNFC][$eq]=${nfcId}`);
};

export const getQuestion = async (index) => {
  return await request.get(`api/questions?filters[STT][$eq]=${index}`);
};

export const requestAnswer = async (body) => {
  return await request.post('api/feedbacks', body);
};

export const getHistory = async (nfcId) => {
  return await request.get(`api/feedbacks?filters[IdNFC][$eq]=${nfcId}`);
};

export const sendUserNameAPI = async (params) => {
  return await request.post(`api/players`, params);
};

export const checkFirstScanAPI = async (idNfc) => {
  return await request.get(`api/players?filters[IdNFC][$eq]=${idNfc}`);
};

export const updatePointAPI = async (params, id) => {
  return await request.put(`api/players/${id}`, params);
};

export const getShowGameAPI = async () => {
  return await request.get(`api/choose-games`);
};
