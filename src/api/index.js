import axios from "axios";
import { VueAxios } from "./axios.js";
import { Message } from "element-ui";
const service = axios.create({
  baseURL: "",
  timeout: 30000
});
service.interceptors.request.use(
  config => {
    Object.assign(config.headers, {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    });
    config.params = {
      _t: new Date().getTime(),
      ...config.params
    };
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data || response.result;
    return res;
  },
  error => {
    Message.error(error.message);
    return Promise.reject(error);
  }
);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service);
  }
};

export { installer as VueAxios, service as axios };
