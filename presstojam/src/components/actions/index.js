import CreateAction from "./create-action.vue"
import DeleteAction from "./delete-action.vue"
import EditAction from "./edit-action.vue"
import ExportAction from "./export-action.vue"
import ImportAction from "./import-action.vue"
import MoveAction from "./move-action.vue"
import PrimaryAction from "./primary-action.vue"
import ReferenceCreate from "./reference-create.vue"
import ShowAudit from "./show-audit.vue"

export default {
    install(Vue) {
        Vue.component("CreateAction", CreateAction);
        Vue.component("DeleteAction", DeleteAction);
        Vue.component("EditAction", EditAction);
        Vue.component("ExportAction", ExportAction);
        Vue.component("ImportAction", ImportAction);
        Vue.component("MoveAction", MoveAction);
        Vue.component("PrimaryAction", PrimaryAction);
        Vue.component("ReferenceCreate", ReferenceCreate);
        Vue.component("ShowAudit", ShowAudit);
    }
}

export {
    CreateAction,
    DeleteAction,
    EditAction,
    ExportAction,
    ImportAction,
    MoveAction,
    PrimaryAction,
    ReferenceCreate,
    ShowAudit
}
