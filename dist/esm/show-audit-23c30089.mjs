import { ref, openBlock, createElementBlock, Fragment, createVNode, unref, withCtx } from 'vue';
import { s as script$1 } from './inputtext.esm-98b20197.mjs';
import { e as script$2 } from './form-1144cc11.mjs';
import { f as script$3 } from './table-195bb781.mjs';

var script = {
  props: {
    repo : Object
},
  setup(__props) {



const dialog = ref(false);


function showAudit() {
    dialog.value = true;
}


return (_ctx, _cache) => {
  return (openBlock(), createElementBlock(Fragment, null, [
    createVNode(unref(script$1), {
      label: "Audit",
      icon: "pi pi-history",
      class: "mr-2 p-button-help",
      onClick: showAudit
    }),
    createVNode(unref(script$2), {
      visible: dialog.value,
      "onUpdate:visible": _cache[0] || (_cache[0] = $event => ((dialog).value = $event)),
      header: "Audit",
      modal: true,
      class: "p-fluid"
    }, {
      default: withCtx(() => [
        createVNode(script$3, {
          repo: __props.repo,
          id: __props.repo.active_id
        }, null, 8 /* PROPS */, ["repo", "id"])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["visible"])
  ], 64 /* STABLE_FRAGMENT */))
}
}

};

script.__file = "presstojam/src/components/actions/show-audit.vue";

export { script as s };
