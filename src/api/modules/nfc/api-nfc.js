import request from '../../request';

export const checkNFC = async (nfcId) => {
  return await request.get(`api/list-nfcs?filters[IdNFC][$eq]=${nfcId}`);
};
