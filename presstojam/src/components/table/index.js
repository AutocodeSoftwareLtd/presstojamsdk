import TableDisplay from "./table-display.vue"
import Table from "./table.vue"

export default {
    install(Vue) {
        Vue.component("TableDisplay", TableDisplay);
        Vue.component("Table", Table);
    }
}

export {
    TableDisplay,
    Table
}