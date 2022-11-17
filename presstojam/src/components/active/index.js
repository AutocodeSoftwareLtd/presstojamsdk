import Active from "./active.vue"
import ChildPanel from "./child-panel.vue"

export default {
    install(Vue) {
        Vue.component("Active", Active);
        Vue.component("ChildPanel", ChildPanel);
    }
}

export {
    Active,
    ChildPanel
}
