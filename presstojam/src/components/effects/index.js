import Audit from "./audit.vue"
import MoveAction from "./move-action.vue"

export default {
    install(Vue) {
        Vue.component("Audit", Audit);
        Vue.component("MoveAction", MoveAction);
    }
}

export {
    Audit,
    MoveAction
}