import { d as script$2, a as script$3, g as script$5, c as script$7 } from './table-195bb781.mjs';
export { d as CreateAction, a as DeleteAction, g as ExportAction, c as PrimaryAction } from './table-195bb781.mjs';
import { s as script$4, a as script$6 } from './edit-action-61488f7b.mjs';
export { s as EditAction, a as MoveAction } from './edit-action-61488f7b.mjs';
import { openBlock, createBlock, unref } from 'vue';
import { h as script$1, i as script$8 } from './form-1144cc11.mjs';
export { i as ReferenceCreate } from './form-1144cc11.mjs';
import { s as script$9 } from './show-audit-23c30089.mjs';
export { s as ShowAudit } from './show-audit-23c30089.mjs';
import './card.esm-aa1399ba.mjs';
import './dropdown.esm-42467633.mjs';
import './inputtext.esm-98b20197.mjs';
import './ripple.esm-9120ee72.mjs';
import './utils.esm-d009df4f.mjs';
import './portal.esm-7deedf95.mjs';
import './reactivestores-e540cb98.mjs';
import './routes-c7b670d2.mjs';
import './configs-be955862.mjs';
import './fieldset.esm-bceed8ae.mjs';
import './view-field-0425b8ce.mjs';
import './pagination-c43fca32.mjs';
import './filter-form-fbb35642.mjs';
import './overlaypanel.esm-03472203.mjs';
import './focustrap.esm-2e0fe540.mjs';
import './style-inject.es-04d8aa40.mjs';
import './move-action-7538dcd6.mjs';
import './dispatch-response-339e84f1.mjs';

var script = {
  setup(__props) {

    
return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$1), {
    mode: "basic",
    accept: "image/*",
    maxFileSize: 1000000,
    label: "Import",
    chooseLabel: "Import",
    class: "mr-2 inline-block"
  }))
}
}

};

script.__file = "presstojam/src/components/actions/import-action.vue";

var index = {
  install(Vue) {
    Vue.component("CreateAction", script$2);
    Vue.component("DeleteAction", script$3);
    Vue.component("EditAction", script$4);
    Vue.component("ExportAction", script$5);
    Vue.component("ImportAction", script);
    Vue.component("MoveAction", script$6);
    Vue.component("PrimaryAction", script$7);
    Vue.component("ReferenceCreate", script$8);
    Vue.component("ShowAudit", script$9);
  }

};

export { script as ImportAction, index as default };
