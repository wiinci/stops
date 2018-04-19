import moment from "moment";

export default {
    install(Vue, name = "$moment") {
        Object.defineProperty(Vue.prototype, name, { value: moment });
    }
};
