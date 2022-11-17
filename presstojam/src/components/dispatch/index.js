import Dispatch from "./dispatch-response.vue"

export default {
    install(Vue) {
        Vue.component("Dispatch", Dispatch);
    }
}

export {
    Dispatch
}