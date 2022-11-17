import { computed, onMounted, openBlock, createElementBlock, Fragment, createVNode, unref, normalizeClass, withCtx, createBlock } from 'vue';
import { s as script$2 } from './panel.esm-0904c2bd.mjs';
import { g as getStoreById } from './fieldset.esm-bceed8ae.mjs';
import { a as createRepoStore, r as regStore } from './reactivestores-e540cb98.mjs';
import { s as script$3 } from './tree-3766f819.mjs';
import { s as script$4 } from './table-195bb781.mjs';
import { s as script$1 } from './slug-trail-f5b35e84.mjs';
import { s as styleInject } from './style-inject.es-04d8aa40.mjs';

/*

*/

var script = {
  props: {
    model : String,
    base : String
},
  setup(__props) {

const props = __props;





const store = getStoreById(props.model);
const repo = createRepoStore(store);
regStore(props.model, repo);
repo.load();


const recursive = computed(() => {
    for(let i in store.route.schema) {
        if (store.route.schema[i].recursive) return true;
    }
    return false;
});

if (store.route && store.route.settings.repo && store.route.settings.repo.mounted) {
    onMounted(() => {
        store.route.settings.repo.mounted(store);
    });
}


return (_ctx, _cache) => {
  return (openBlock(), createElementBlock(Fragment, null, [
    createVNode(script$1, { name: __props.model }, null, 8 /* PROPS */, ["name"]),
    createVNode(unref(script$2), {
      header: unref(store).route.title,
      class: normalizeClass(["gc-repo", __props.model])
    }, {
      default: withCtx(() => [
        (unref(recursive))
          ? (openBlock(), createBlock(script$3, {
              key: 0,
              name: __props.model
            }, null, 8 /* PROPS */, ["name"]))
          : (openBlock(), createBlock(script$4, {
              key: 1,
              name: __props.model
            }, null, 8 /* PROPS */, ["name"]))
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["header", "class"])
  ], 64 /* STABLE_FRAGMENT */))
}
}

};

var css_248z = "\ntable[data-v-e5ad478c], thead[data-v-e5ad478c], tbody[data-v-e5ad478c], tr[data-v-e5ad478c] {\r\n    width : 100%;\n}\n.repo-vue-vue-type-style-index-0-id-e5ad478c-scoped-true-lang_ptj-table-wrapper__8hxfO[data-v-e5ad478c] {\r\n    position : relative;\n}\r\n\r\n";
styleInject(css_248z);

script.__scopeId = "data-v-e5ad478c";
script.__file = "presstojam/src/components/repo/repo.vue";

export { script as s };
