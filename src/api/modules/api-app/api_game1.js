import request from '../../request';

//1
export const checkFirstJoinAPI = async (params) => {
  return await request.get(`api/odt-on-outs`, {params});
};

//2
export const checkExistMatchPendingAPI = async (params) => {
  return await request.get(`api/odt-on-outs`, {params});
};

//3
export const updateMatchStatusToCloseAPI = async (params, id) => {
  return await request.put(`api/odt-on-outs/${id}`, params);
};

//4
export const checkExistMatchProgressAPI = async (params) => {
  return await request.get(`api/odt-on-outs`, {params});
};

//5 same 15 same 17
export const updateMatchStatusToLoseAPI = async (params, id) => {
  return await request.put(`api/odt-on-outs/${id}`, params);
};

//6
export const checkExistPreviousMatchAPI = async (params) => {
  return await request.get(`api/odt-on-outs`, {params});
};

//7
export const checkMatchPendingAPI = async (params) => {
  return await request.get(`api/odt-on-outs`, {params});
};

//8
export const updateStatusToProgressAPI = async (params) => {
  return await request.post(`api/odt-on-outs`, params);
};

//9
export const updateMatchStatusToProgressAPI = async (params, id) => {
  return await request.put(`api/odt-on-outs/${id}`, params);
};

//10
export const updateStatusToPendingAPI = async (params) => {
  return await request.post(`api/odt-on-outs`, params);
};

//11
export const checkCanStartGameAPI = async (params) => {
  return await request.get(`api/odt-on-outs`, {params});
};

//12
export const updateStatusCloseWhenTimeoutAPI = async (params) => {
  return await request.put(`api/odt-on-outs`, params);
};

//13 same 16
export const checkProgressionCompetitorAPI = async (params) => {
  return await request.get(`api/odt-on-outs`, {params});
};

//14
export const updateStatusToLoseAPI = async (params) => {
  return await request.put(`api/odt-on-outs`, params);
};

//15
// export const updateMatchStatusToLoseAPI = async (params) => {
//     return await request.get(`api/odt-on-outs`, { params });
// };

//16
// export const checkExistMatchReady = async (params) => {
//     return await request.get(`api/odt-on-outs`, { params });
// };

//17
// export const checkExistMatchReady = async (params) => {
//     return await request.get(`api/odt-on-outs`, { params });
// };

//18
export const updateStatusToWinAPI = async (params) => {
  return await request.put(`api/odt-on-outs`, params);
};
