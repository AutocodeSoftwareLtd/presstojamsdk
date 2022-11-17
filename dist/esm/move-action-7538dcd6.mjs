import { inject, provide, openBlock, createElementBlock, Fragment, unref, createVNode, createCommentVNode } from 'vue';
import { s as script$2 } from './inputtext.esm-98b20197.mjs';
import { f as createBind, g as script$1 } from './form-1144cc11.mjs';
import { g as getStore } from './reactivestores-e540cb98.mjs';

const _hoisted_1 = { key: 0 };
    
    
var script = {
  props: {
        name : {
            type : String,
            required : true
        }
    },
  emits: ['onMove'],
  setup(__props, { emit: emits }) {

const props = __props;

    const client = inject("client");

    

    

    const repo = getStore(props.name);
    const store = repo.store;
    
    provide("model", store.model);

   
    const bind = createBind(store.route.schema['--recursive'], 0);


    function submit() {
        let promise = [];
        for(const row of repo.selected.value) {
            const obj = {"--id" : row['--id'], "--recursive" : bind.value.value };
            promise.push(client.put("/data/" + store.model, obj));
        }
        return Promise.all(promise)
        .then(() => {
            emits("onMove");
        })
        .catch(e => console.log(e));
    }



return (_ctx, _cache) => {
  return (openBlock(), createElementBlock(Fragment, null, [
    (unref(bind))
      ? (openBlock(), createElementBlock("div", _hoisted_1, [
          createVNode(script$1, { bind: unref(bind) }, null, 8 /* PROPS */, ["bind"])
        ]))
      : createCommentVNode("v-if", true),
    createVNode(unref(script$2), {
      label: _ctx.$t('btns.save'),
      onClick: submit
    }, null, 8 /* PROPS */, ["label"])
  ], 64 /* STABLE_FRAGMENT */))
}
}

};

script.__file = "presstojam/src/components/effects/move-action.vue";

export { script as s };
