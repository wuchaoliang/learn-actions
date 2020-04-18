import axios from "axios";
import { Message } from "element-ui";
const service = axios.create({
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
    const res = response.data;
    return res;
  },
  error => {
    Message.error(error.message);
    return Promise.reject(error);
  }
);

const VueAxios = {
  install(Vue) {
    if (this.installed) {
      return;
    }
    this.installed = true;
    if (!service) {
      console.error("You have to install axios");
      return;
    }
    Vue.axios = service;
    Object.defineProperties(Vue.prototype, {
      axios: {
        get: function get() {
          return service;
        }
      },
      $http: {
        get: function get() {
          return service;
        }
      }
    });
  }
};

export default VueAxios;
