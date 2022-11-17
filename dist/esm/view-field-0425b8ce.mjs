import { openBlock, createElementBlock, toDisplayString, inject, computed, resolveComponent, unref, createBlock, withCtx, createTextVNode, createElementVNode, Fragment, renderList, createVNode, createCommentVNode } from 'vue';
import { R as ReferenceTypes, k as hasRoute, m as getRoute } from './routes-c7b670d2.mjs';

var script$7 = {
  props: {
    value : [Number, String],
    field : Object
},
  setup(__props) {





return (_ctx, _cache) => {
  return (openBlock(), createElementBlock("span", null, toDisplayString(__props.value), 1 /* TEXT */))
}
}

};

script$7.__file = "presstojam/src/components/view/number.vue";

const _hoisted_1$4 = {
  key: 0,
  class: "pi pi-check"
};
const _hoisted_2$3 = { key: 1 };


var script$6 = {
  props: {
    value : [Number, Boolean],
    field : Object
},
  setup(__props) {

inject("client");



return (_ctx, _cache) => {
  return (__props.field.useIcons() && __props.value)
    ? (openBlock(), createElementBlock("i", _hoisted_1$4))
    : (openBlock(), createElementBlock("span", _hoisted_2$3, toDisplayString(__props.field.display(__props.value)), 1 /* TEXT */))
}
}

};

script$6.__file = "presstojam/src/components/view/flag.vue";

const _hoisted_1$3 = { key: 1 };


var script$5 = {
  props: {
    value : [Number, String ],
    field : Object,
    row : Object,
},
  setup(__props) {

const props = __props;




let show_route = false;
if (props.field.reference_type == ReferenceTypes.REFERENCE && hasRoute(props.field.reference) && props.value) {
    show_route = true;
}


let display = computed(() => {
    if (props.field.reference_type == ReferenceTypes.REFERENCE) {
        const data = [];
    

        if (props.field.custom_fields.length) {
            for(const field of props.field.custom_fields) {
                data.push(props.row[props.field.name + "/" + field]);
            }
        } else {
            
            const ref_route = getRoute(props.field.reference);
            
            for(const i in ref_route.schema) {
                if (ref_route.schema[i].summary) {
                    data.push(props.row[props.field.name + "/" + i]);
                }
            }
        }
        return data.join(" ");
    } else {
        return props.value; 
    }
});



return (_ctx, _cache) => {
  const _component_router_link = resolveComponent("router-link");

  return (unref(show_route))
    ? (openBlock(), createBlock(_component_router_link, {
        key: 0,
        to: { name : 'primary', params : {'model' : __props.field.reference, 'id' : __props.value }}
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(unref(display)), 1 /* TEXT */)
        ]),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["to"]))
    : (openBlock(), createElementBlock("span", _hoisted_1$3, toDisplayString(unref(display)), 1 /* TEXT */))
}
}

};

script$5.__file = "presstojam/src/components/view/id.vue";

var script$4 = {
  props: {
    value : [Number, String],
    field : Object
},
  setup(__props) {

const props = __props;




const val = computed(() => {
    var t = props.field.clean(props.value);
    return (!t) ? t : t.toLocaleDateString("en-UK");
});


return (_ctx, _cache) => {
  return (openBlock(), createElementBlock("span", null, toDisplayString(unref(val)), 1 /* TEXT */))
}
}

};

script$4.__file = "presstojam/src/components/view/time.vue";

const _hoisted_1$2 = { key: 0 };
const _hoisted_2$2 = { key: 1 };


var script$3 = {
  props: {
    value : [String],
    field : Object
},
  setup(__props) {

const props = __props;



const tag = computed(() => {
 if (props.field.html || props.field.max > 300) {
    return "textarea";
 } else {
    return "input";
 }
});




return (_ctx, _cache) => {
  return (unref(tag)=='textarea')
    ? (openBlock(), createElementBlock("div", _hoisted_1$2, toDisplayString(__props.value), 1 /* TEXT */))
    : (openBlock(), createElementBlock("span", _hoisted_2$2, toDisplayString(props.field.clean(__props.value)), 1 /* TEXT */))
}
}

};

script$3.__file = "presstojam/src/components/view/string.vue";

const _hoisted_1$1 = /*#__PURE__*/createElementVNode("i", { class: "pi pi-download" }, null, -1 /* HOISTED */);
const _hoisted_2$1 = [
  _hoisted_1$1
];


var script$2 = {
  props: {
    value : String,
    field : Object,
    id : Number
},
  setup(__props) {

const props = __props;

const client = inject("client");




function download() {
    client.getAsset("/asset/" + props.field.model + "/" + props.field.name + "/" + props.id)
    .then(blob => {

        const anchor = document.createElement("a");
        const url = URL.createObjectURL(blob);
        anchor.href = url;
        anchor.download = props.field.val;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    })
    .catch(e => {
        console.log(e);
    });
}

return (_ctx, _cache) => {
  return (openBlock(), createElementBlock("span", null, [
    createTextVNode(toDisplayString(__props.value) + " ", 1 /* TEXT */),
    createElementVNode("a", {
      onClick: _cache[0] || (_cache[0] = $event => (download()))
    }, _hoisted_2$1)
  ]))
}
}

};

script$2.__file = "presstojam/src/components/view/asset.vue";

const _hoisted_1 = { key: 0 };
const _hoisted_2 = { key: 1 };


var script$1 = {
  props: {
    value : [Object, String],
    field : Object
},
  setup(__props) {

const props = __props;




const jsonVal = props.field.clean(props.value);



return (_ctx, _cache) => {
  return (__props.field.fields.length > 0)
    ? (openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.field.fields, (field) => {
          return (openBlock(), createElementBlock("div", {
            key: field.name
          }, [
            createElementVNode("label", null, toDisplayString(_ctx.$t("models." + field.model + ".fields." + field.name + ".label")), 1 /* TEXT */),
            createVNode(script, {
              field: field,
              value: unref(jsonVal)[field.name]
            }, null, 8 /* PROPS */, ["field", "value"])
          ]))
        }), 128 /* KEYED_FRAGMENT */))
      ]))
    : (openBlock(), createElementBlock("div", _hoisted_2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(jsonVal), (value, field) => {
          return (openBlock(), createElementBlock("div", { key: field }, [
            createElementVNode("span", null, toDisplayString(field) + ": ", 1 /* TEXT */),
            createElementVNode("span", null, toDisplayString(value), 1 /* TEXT */)
          ]))
        }), 128 /* KEYED_FRAGMENT */))
      ]))
}
}

};

script$1.__file = "presstojam/src/components/view/json.vue";

var script = {
  props: {
    field : Object,
    row : [Array,Object],
},
  setup(__props) {

 

return (_ctx, _cache) => {
  return (__props.field.type=='number')
    ? (openBlock(), createBlock(script$7, {
        key: 0,
        value: __props.row[__props.field.name],
        field: __props.field
      }, null, 8 /* PROPS */, ["value", "field"]))
    : (__props.field.type=='flag')
      ? (openBlock(), createBlock(script$6, {
          key: 1,
          value: __props.row[__props.field.name],
          field: __props.field
        }, null, 8 /* PROPS */, ["value", "field"]))
      : (__props.field.type=='id')
        ? (openBlock(), createBlock(script$5, {
            key: 2,
            value: __props.row[__props.field.name],
            field: __props.field,
            row: __props.row
          }, null, 8 /* PROPS */, ["value", "field", "row"]))
        : (__props.field.type=='asset')
          ? (openBlock(), createBlock(script$2, {
              key: 3,
              value: __props.row[__props.field.name],
              field: __props.field,
              id: __props.row['--id']
            }, null, 8 /* PROPS */, ["value", "field", "id"]))
          : (__props.field.type=='time')
            ? (openBlock(), createBlock(script$4, {
                key: 4,
                value: __props.row[__props.field.name],
                field: __props.field
              }, null, 8 /* PROPS */, ["value", "field"]))
            : (__props.field.type=='json')
              ? (openBlock(), createBlock(script$1, {
                  key: 5,
                  value: __props.row[__props.field.name],
                  field: __props.field
                }, null, 8 /* PROPS */, ["value", "field"]))
              : (__props.field.type=='string')
                ? (openBlock(), createBlock(script$3, {
                    key: 6,
                    value: __props.row[__props.field.name],
                    field: __props.field
                  }, null, 8 /* PROPS */, ["value", "field"]))
                : createCommentVNode("v-if", true)
}
}

};

script.__file = "presstojam/src/components/view/view-field.vue";

export { script as s };
