import { axiosInstance as axios } from "../network";

const fetchHomePageData = async () => {
  return axios.get("/courses");
};

export { fetchHomePageData };
