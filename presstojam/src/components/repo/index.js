import Repo from "./repo.vue"

export default {
    install(Vue) {
        Vue.component("Repo", Repo);
    }
}

export {
    Repo
}