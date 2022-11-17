import Form from "./form.vue"
import EditField from "./edit-field.vue"

export default {
    install(Vue) {
        Vue.component("Form", Form);
        Vue.component("EditField", EditField);
    }
}

export {
    Form,
    EditField
}