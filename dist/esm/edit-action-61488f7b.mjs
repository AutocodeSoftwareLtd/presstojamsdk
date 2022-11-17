import { ref, openBlock, createElementBlock, Fragment, createVNode, unref, withCtx, createElementVNode, renderList, toDisplayString, resolveComponent } from 'vue';
import { e as script$3 } from './form-1144cc11.mjs';
import { s as script$2 } from './inputtext.esm-98b20197.mjs';
import { s as script$4 } from './move-action-7538dcd6.mjs';
import { g as getStore } from './reactivestores-e540cb98.mjs';
import { i as getLabel } from './routes-c7b670d2.mjs';

const _hoisted_1 = /*#__PURE__*/createElementVNode("p", null, "Moving", -1 /* HOISTED */);

    
var script$1 = {
  props: {
        name : {
            type : String,
            required : true
        }
    },
  emits: ['onMove'],
  setup(__props, { emit: emits }) {

const props = __props;

    

    

    const repo = getStore(props.name);
    const store = repo.store;

    
    const dialog = ref(false);

    function moveRow() {
        dialog.value =true;
    }

    function onMove() {
        dialog.value = false;
        emits("onMove");
    }



return (_ctx, _cache) => {
  return (openBlock(), createElementBlock(Fragment, null, [
    createVNode(unref(script$2), {
      icon: "pi pi-pencil",
      class: "p-button-success mr-2",
      label: "move",
      onClick: moveRow,
      disabled: !unref(repo).selected.value.length
    }, null, 8 /* PROPS */, ["disabled"]),
    createVNode(unref(script$3), {
      visible: dialog.value,
      "onUpdate:visible": _cache[1] || (_cache[1] = $event => ((dialog).value = $event)),
      header: 'Move ' + _ctx.$t('models.' + unref(store).model + '.title', 2),
      modal: true,
      class: "p-fluid"
    }, {
      default: withCtx(() => [
        _hoisted_1,
        createElementVNode("ul", null, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(repo).selected.value, (item) => {
            return (openBlock(), createElementBlock("li", null, toDisplayString(unref(getLabel)(unref(repo).store.route.schema, item)), 1 /* TEXT */))
          }), 256 /* UNKEYED_FRAGMENT */))
        ]),
        createVNode(script$4, {
          name: __props.name,
          onOnMove: _cache[0] || (_cache[0] = $event => (onMove()))
        }, null, 8 /* PROPS */, ["name"])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["visible", "header"])
  ], 64 /* STABLE_FRAGMENT */))
}
}

};

script$1.__file = "presstojam/src/components/actions/move-action.vue";

var script = {
  props: {
        store : Object,
        data : Object
    },
  emits: [
        'onSave'
    ],
  setup(__props, { emit: emits }) {

    

    

    const dialog = ref(false);

    function editRow() {
        dialog.value =true;
    }

    function onSave() {
        dialog.value = false;
        emits('onSave');
    }



return (_ctx, _cache) => {
  const _component_ptj_form = resolveComponent("ptj-form");

  return (openBlock(), createElementBlock(Fragment, null, [
    createVNode(unref(script$2), {
      icon: "pi pi-pencil",
      class: "p-button-rounded p-button-success mr-2",
      onClick: editRow
    }),
    createVNode(unref(script$3), {
      visible: dialog.value,
      "onUpdate:visible": _cache[0] || (_cache[0] = $event => ((dialog).value = $event)),
      header: 'Edit ' + _ctx.$t('models.' + __props.store.model + '.title', 1),
      modal: true,
      class: "p-fluid"
    }, {
      default: withCtx(() => [
        createVNode(_component_ptj_form, {
          schema: __props.store.route.schema,
          data: __props.data,
          model: __props.store.model,
          onSaved: onSave,
          method: "put"
        }, null, 8 /* PROPS */, ["schema", "data", "model"])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["visible", "header"])
  ], 64 /* STABLE_FRAGMENT */))
}
}

};

script.__file = "presstojam/src/components/actions/edit-action.vue";

export { script$1 as a, script as s };
