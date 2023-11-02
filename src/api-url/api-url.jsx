import axios from "axios";

export const callAPI = async ({ endpoint, method, headers, params, data }) => {
  const baseURL = "https://themealdb.com/api/json/v1/1";
  const options = {
    baseURL,
    url: endpoint,
    method,
    headers,
    params,
    data,
  };
  const response = await axios(options);
  return response?.data;
};