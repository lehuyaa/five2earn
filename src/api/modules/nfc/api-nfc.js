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
