import FilterField from "./filter-field.vue"
import FilterForm from "./filter-form.vue"
import Filter from "./filter.vue"

export default {
    install(Vue) {
        Vue.component("FilterField", FilterField);
        Vue.component("FilterForm", FilterForm);
        Vue.component("Filter", Filter);
    }
}

export {
    FilterField,
    FilterForm,
    Filter
}