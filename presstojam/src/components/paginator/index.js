import Pagination from "./pagination.vue"

export default {
    install(Vue) {
        Vue.component("Pagination", Pagination);
    }
}

export {
    Pagination
}