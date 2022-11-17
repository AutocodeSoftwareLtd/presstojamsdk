import { resolveComponent, openBlock, createElementBlock, normalizeClass, Fragment, createBlock, withCtx, createElementVNode, createCommentVNode, toDisplayString, resolveDynamicComponent, renderList, createVNode, ref, unref, createTextVNode, inject, computed } from 'vue';
import { b as getRouteStructure, r as rowToTree } from './routes-c7b670d2.mjs';
import { g as getStore } from './reactivestores-e540cb98.mjs';
import { c as configs } from './configs-be955862.mjs';
import { s as script$3 } from './overlaypanel.esm-03472203.mjs';
import { s as styleInject$1 } from './style-inject.es-04d8aa40.mjs';

var script$1$1 = {
  name: 'BreadcrumbItem',
  props: {
    item: null,
    template: null,
    exact: null
  },
  methods: {
    onClick(event, navigate) {
      if (this.item.command) {
        this.item.command({
          originalEvent: event,
          item: this.item
        });
      }

      if (this.item.to && navigate) {
        navigate(event);
      }
    },

    containerClass() {
      return ['p-menuitem', {
        'p-disabled': this.disabled()
      }, this.item.class];
    },

    linkClass(routerProps) {
      return ['p-menuitem-link', {
        'router-link-active': routerProps && routerProps.isActive,
        'router-link-active-exact': this.exact && routerProps && routerProps.isExactActive
      }];
    },

    visible() {
      return typeof this.item.visible === 'function' ? this.item.visible() : this.item.visible !== false;
    },

    disabled() {
      return typeof this.item.disabled === 'function' ? this.item.disabled() : this.item.disabled;
    },

    label() {
      return typeof this.item.label === 'function' ? this.item.label() : this.item.label;
    },

    isCurrentUrl() {
      const {
        to,
        url
      } = this.item;
      let lastPath = this.$router ? this.$router.currentRoute.path : '';
      return to === lastPath || url === lastPath ? 'page' : undefined;
    }

  },
  computed: {
    iconClass() {
      return ['p-menuitem-icon', this.item.icon];
    }

  }
};
const _hoisted_1$1 = ["href", "aria-current", "onClick"];
const _hoisted_2$1 = {
  key: 1,
  class: "p-menuitem-text"
};
const _hoisted_3$1 = ["href", "target", "aria-current"];
const _hoisted_4$1 = {
  key: 1,
  class: "p-menuitem-text"
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");

  return $options.visible() ? (openBlock(), createElementBlock("li", {
    key: 0,
    class: normalizeClass($options.containerClass())
  }, [!$props.template ? (openBlock(), createElementBlock(Fragment, {
    key: 0
  }, [$props.item.to ? (openBlock(), createBlock(_component_router_link, {
    key: 0,
    to: $props.item.to,
    custom: ""
  }, {
    default: withCtx(({
      navigate,
      href,
      isActive,
      isExactActive
    }) => [createElementVNode("a", {
      href: href,
      class: normalizeClass($options.linkClass({
        isActive,
        isExactActive
      })),
      "aria-current": $options.isCurrentUrl(),
      onClick: $event => $options.onClick($event, navigate)
    }, [$props.item.icon ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass($options.iconClass)
    }, null, 2)) : createCommentVNode("", true), $props.item.label ? (openBlock(), createElementBlock("span", _hoisted_2$1, toDisplayString($options.label()), 1)) : createCommentVNode("", true)], 10, _hoisted_1$1)]),
    _: 1
  }, 8, ["to"])) : (openBlock(), createElementBlock("a", {
    key: 1,
    href: $props.item.url || '#',
    class: normalizeClass($options.linkClass()),
    target: $props.item.target,
    "aria-current": $options.isCurrentUrl(),
    onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
  }, [$props.item.icon ? (openBlock(), createElementBlock("span", {
    key: 0,
    class: normalizeClass($options.iconClass)
  }, null, 2)) : createCommentVNode("", true), $props.item.label ? (openBlock(), createElementBlock("span", _hoisted_4$1, toDisplayString($options.label()), 1)) : createCommentVNode("", true)], 10, _hoisted_3$1))], 64)) : (openBlock(), createBlock(resolveDynamicComponent($props.template), {
    key: 1,
    item: $props.item
  }, null, 8, ["item"]))], 2)) : createCommentVNode("", true);
}

script$1$1.render = render$1;
var script$2 = {
  name: 'Breadcrumb',
  props: {
    model: {
      type: Array,
      default: null
    },
    home: {
      type: null,
      default: null
    },
    exact: {
      type: Boolean,
      default: true
    }
  },
  components: {
    BreadcrumbItem: script$1$1
  }
};
const _hoisted_1$2 = {
  class: "p-breadcrumb p-component"
};
const _hoisted_2$2 = {
  class: "p-breadcrumb-list"
};

const _hoisted_3$2 = /*#__PURE__*/createElementVNode("li", {
  class: "p-menuitem-separator"
}, [/*#__PURE__*/createElementVNode("span", {
  class: "pi pi-chevron-right",
  "aria-hidden": "true"
})], -1);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BreadcrumbItem = resolveComponent("BreadcrumbItem");

  return openBlock(), createElementBlock("nav", _hoisted_1$2, [createElementVNode("ol", _hoisted_2$2, [$props.home ? (openBlock(), createBlock(_component_BreadcrumbItem, {
    key: 0,
    item: $props.home,
    class: "p-breadcrumb-home",
    template: _ctx.$slots.item,
    exact: $props.exact
  }, null, 8, ["item", "template", "exact"])) : createCommentVNode("", true), (openBlock(true), createElementBlock(Fragment, null, renderList($props.model, item => {
    return openBlock(), createElementBlock(Fragment, {
      key: item.label
    }, [_hoisted_3$2, createVNode(_component_BreadcrumbItem, {
      item: item,
      template: _ctx.$slots.item,
      exact: $props.exact
    }, null, 8, ["item", "template", "exact"])], 64);
  }), 128))])]);
}

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$2 = "\n.p-breadcrumb {\n    overflow-x: auto;\n}\n.p-breadcrumb .p-breadcrumb-list {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -ms-flex-wrap: nowrap;\n        flex-wrap: nowrap;\n}\n.p-breadcrumb .p-menuitem-text {\n    line-height: 1;\n}\n.p-breadcrumb .p-menuitem-link {\n    text-decoration: none;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n.p-breadcrumb .p-menuitem-separator {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n.p-breadcrumb::-webkit-scrollbar {\n    display: none;\n}\n";
styleInject(css_248z$2);
script$2.render = render;

const _hoisted_1 = ["href", "onClick"];
const _hoisted_2 = { class: "p-menuitem-text" };
const _hoisted_3 = { class: "row" };
const _hoisted_4 = /*#__PURE__*/createTextVNode();


var script$1 = {
  props: {
    item : Object
},
  setup(__props) {

const props = __props;




const info = ref();

function toggleInfo(e) {
    if (props.item && props.item.info) info.value.toggle(e);
}


return (_ctx, _cache) => {
  const _component_router_link = resolveComponent("router-link");

  return (openBlock(), createElementBlock(Fragment, null, [
    createVNode(_component_router_link, {
      to: __props.item.to,
      custom: ""
    }, {
      default: withCtx(({isActive, href, navigate, isExactActive}) => [
        createElementVNode("a", {
          class: normalizeClass([{'active-link': isActive}, "p-menuitem-link"]),
          href: href,
          onClick: navigate,
          onMouseover: toggleInfo,
          onMouseout: toggleInfo
        }, [
          (__props.item.icon)
            ? (openBlock(), createElementBlock("i", {
                key: 0,
                class: normalizeClass(["pi", __props.item.icon])
              }, null, 2 /* CLASS */))
            : createCommentVNode("v-if", true),
          createElementVNode("span", _hoisted_2, toDisplayString(__props.item.label), 1 /* TEXT */)
        ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, _hoisted_1)
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["to"]),
    (__props.item.info)
      ? (openBlock(), createBlock(unref(script$3), {
          key: 0,
          ref_key: "info",
          ref: info,
          appendTo: "body"
        }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.item.info, (row) => {
              return (openBlock(), createElementBlock("dl", null, [
                createElementVNode("div", _hoisted_3, [
                  createElementVNode("dt", null, toDisplayString(row.label), 1 /* TEXT */),
                  _hoisted_4,
                  createElementVNode("dd", null, toDisplayString(row.value), 1 /* TEXT */)
                ])
              ]))
            }), 256 /* UNKEYED_FRAGMENT */))
          ]),
          _: 1 /* STABLE */
        }, 512 /* NEED_PATCH */))
      : createCommentVNode("v-if", true)
  ], 64 /* STABLE_FRAGMENT */))
}
}

};

var css_248z$1 = "\ndl[data-v-0b46fb32] {\r\n        position : relative;\r\n        display: flex;\r\n        flex-direction: column;\n}\ndt[data-v-0b46fb32] {\r\n        float : left;\r\n        font-weight : 700;\r\n        width : 50%\n}\ndd[data-v-0b46fb32] {\r\n        position : relative;\r\n        margin-left : 50%;\r\n        padding : 2px;\n}\ndl > div[data-v-0b46fb32] {\r\n        position : relative;\r\n        clear : both;\r\n        display : block;\n}\r\n";
styleInject$1(css_248z$1);

script$1.__scopeId = "data-v-0b46fb32";
script$1.__file = "presstojam/src/components/slugtrail/crumb.vue";

var script = {
  props: {
    name : String
},
  setup(__props) {

const props = __props;

const Client = inject("client");
const i18n = inject("i18n");

const t = i18n.t;




const repo = getStore(props.name);
const store = repo.store;
const home = {icon: 'pi pi-home', to: configs.get("base")};

const routes = ref(getRouteStructure(store.model));

const slug_trail = ref(null);


if (store.route.parent) { 
    if (repo.active_id) {
        repo.load()
        .then(() => {
            const id = repo.data.value['--parent'];
            return Client.get("/data/" + store.route.parent + "/active?__to=*&--id=" + id)
        }).then(response => {
            slug_trail.value = rowToTree(response, store.route.parent);
        }).catch(e => console.log(e));
    } else {
        const id = repo.parent_id;
        Client.get("/data/" + store.route.parent + "/active?__to=*&--id=" + id)
        .then(response => {
            slug_trail.value = rowToTree(response, store.route.parent);
        }).catch(e => console.log(e));
    }
} 
 

function trailRouteInfo(trail, route) {
    let info = [];
    let summary = [];
    for(let i in trail[route.name]) {
        if (route.schema[i].background) continue;
        if (route.schema[i].summary) summary.push(trail[route.name][i]);
        info.push({label : t("models." + route.name + ".fields." + i + ".label"), value : trail[route.name][i]});
    }
    
    const label = (summary.length > 0) ? summary.join(" ") : route.name + " - " + trail[route.name]["--id"];
    return {
        label,
        info
    }
}

let crumbs = computed(() => {
    let arr = [];
    if (!slug_trail.value) return arr;

    let trail = slug_trail.value;

    for(let route of routes.value) {
        if (!trail[route.name]) continue;
        //set multiple route
        const obj = { label : route.name, to : { name : "repo", params : { model : route.name } } };
        
        if (trail[route.name] && trail[route.name]["--parent"]) obj.to.params.id = trail[route.name]["--parent"];
        arr.push(obj);
        
        //set child route
        if (trail[route.name]) {
            const { label, info } = trailRouteInfo(trail, route);
            const obj = {
                label : label,
                to : { name : "primary", params : { model : route.name, id : trail[route.name]["--id"]} }
            };
            if (info.length > 0) obj.info = info;
            
            arr.push(obj);
        }
    }
    return arr;
});




return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$2), {
    home: home,
    model: unref(crumbs)
  }, {
    item: withCtx(({item}) => [
      createVNode(script$1, { item: item }, null, 8 /* PROPS */, ["item"])
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["model"]))
}
}

};

var css_248z = "\n.slug-trail-vue-vue-type-style-index-0-id-027b103d-scoped-true-lang_p-breadcrumb__D8PaD[data-v-027b103d] {\r\n    background: #ffffff;\r\n    border: 1px solid #dee2e6;\r\n    border-radius: 6px;\r\n    padding: 1rem;\n}\r\n";
styleInject$1(css_248z);

script.__scopeId = "data-v-027b103d";
script.__file = "presstojam/src/components/slugtrail/slug-trail.vue";

export { script as s };
