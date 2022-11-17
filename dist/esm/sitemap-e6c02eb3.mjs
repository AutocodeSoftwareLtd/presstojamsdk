import { openBlock, createElementBlock, Fragment, renderList, normalizeClass, createElementVNode, mergeProps, toDisplayString, createCommentVNode, createBlock, resolveDynamicComponent, createVNode, Transition, withCtx, withDirectives, vShow, renderSlot, createTextVNode, pushScopeId, popScopeId, unref } from 'vue';
import { R as Ripple } from './ripple.esm-9120ee72.mjs';
import { D as DomHandler, U as UniqueComponentId } from './utils.esm-d009df4f.mjs';
import { s as script$4 } from './panel.esm-0904c2bd.mjs';
import { s as styleInject$1 } from './style-inject.es-04d8aa40.mjs';
import { f as getRoutes } from './routes-c7b670d2.mjs';

var script$3 = {
  name: 'Accordion',
  emits: ['update:activeIndex', 'tab-open', 'tab-close', 'tab-click'],
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    activeIndex: {
      type: [Number, Array],
      default: null
    },
    lazy: {
      type: Boolean,
      default: false
    },
    expandIcon: {
      type: String,
      default: 'pi pi-chevron-right'
    },
    collapseIcon: {
      type: String,
      default: 'pi pi-chevron-down'
    },
    tabindex: {
      type: Number,
      default: 0
    },
    selectOnFocus: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      d_activeIndex: this.activeIndex
    };
  },

  watch: {
    activeIndex(newValue) {
      this.d_activeIndex = newValue;
    }

  },
  methods: {
    isAccordionTab(child) {
      return child.type.name === 'AccordionTab';
    },

    isTabActive(index) {
      return this.multiple ? this.d_activeIndex && this.d_activeIndex.includes(index) : this.d_activeIndex === index;
    },

    getTabProp(tab, name) {
      return tab.props ? tab.props[name] : undefined;
    },

    getKey(tab, index) {
      return this.getTabProp(tab, 'header') || index;
    },

    getTabHeaderActionId(index) {
      return `${this.id}_${index}_header_action`;
    },

    getTabContentId(index) {
      return `${this.id}_${index}_content`;
    },

    onTabClick(event, tab, index) {
      this.changeActiveIndex(event, tab, index);
      this.$emit('tab-click', {
        originalEvent: event,
        index
      });
    },

    onTabKeyDown(event, tab, index) {
      switch (event.code) {
        case 'ArrowDown':
          this.onTabArrowDownKey(event);
          break;

        case 'ArrowUp':
          this.onTabArrowUpKey(event);
          break;

        case 'Home':
          this.onTabHomeKey(event);
          break;

        case 'End':
          this.onTabEndKey(event);
          break;

        case 'Enter':
        case 'Space':
          this.onTabEnterKey(event, tab, index);
          break;
      }
    },

    onTabArrowDownKey(event) {
      const nextHeaderAction = this.findNextHeaderAction(event.target.parentElement.parentElement);
      nextHeaderAction ? this.changeFocusedTab(event, nextHeaderAction) : this.onTabHomeKey(event);
      event.preventDefault();
    },

    onTabArrowUpKey(event) {
      const prevHeaderAction = this.findPrevHeaderAction(event.target.parentElement.parentElement);
      prevHeaderAction ? this.changeFocusedTab(event, prevHeaderAction) : this.onTabEndKey(event);
      event.preventDefault();
    },

    onTabHomeKey(event) {
      const firstHeaderAction = this.findFirstHeaderAction();
      this.changeFocusedTab(event, firstHeaderAction);
      event.preventDefault();
    },

    onTabEndKey(event) {
      const lastHeaderAction = this.findLastHeaderAction();
      this.changeFocusedTab(event, lastHeaderAction);
      event.preventDefault();
    },

    onTabEnterKey(event, tab, index) {
      this.changeActiveIndex(event, tab, index);
      event.preventDefault();
    },

    findNextHeaderAction(tabElement, selfCheck = false) {
      const nextTabElement = selfCheck ? tabElement : tabElement.nextElementSibling;
      const headerElement = DomHandler.findSingle(nextTabElement, '.p-accordion-header');
      return headerElement ? DomHandler.hasClass(headerElement, 'p-disabled') ? this.findNextHeaderAction(headerElement.parentElement) : DomHandler.findSingle(headerElement, '.p-accordion-header-action') : null;
    },

    findPrevHeaderAction(tabElement, selfCheck = false) {
      const prevTabElement = selfCheck ? tabElement : tabElement.previousElementSibling;
      const headerElement = DomHandler.findSingle(prevTabElement, '.p-accordion-header');
      return headerElement ? DomHandler.hasClass(headerElement, 'p-disabled') ? this.findPrevHeaderAction(headerElement.parentElement) : DomHandler.findSingle(headerElement, '.p-accordion-header-action') : null;
    },

    findFirstHeaderAction() {
      return this.findNextHeaderAction(this.$el.firstElementChild, true);
    },

    findLastHeaderAction() {
      return this.findPrevHeaderAction(this.$el.lastElementChild, true);
    },

    changeActiveIndex(event, tab, index) {
      if (!this.getTabProp(tab, 'disabled')) {
        const active = this.isTabActive(index);
        const eventName = active ? 'tab-close' : 'tab-open';

        if (this.multiple) {
          if (active) {
            this.d_activeIndex = this.d_activeIndex.filter(i => i !== index);
          } else {
            if (this.d_activeIndex) this.d_activeIndex.push(index);else this.d_activeIndex = [index];
          }
        } else {
          this.d_activeIndex = this.d_activeIndex === index ? null : index;
        }

        this.$emit('update:activeIndex', this.d_activeIndex);
        this.$emit(eventName, {
          originalEvent: event,
          index
        });
      }
    },

    changeFocusedTab(event, element) {
      if (element) {
        DomHandler.focus(element);

        if (this.selectOnFocus) {
          const index = parseInt(element.parentElement.parentElement.dataset.index, 10);
          const tab = this.tabs[index];
          this.changeActiveIndex(event, tab, index);
        }
      }
    },

    getTabClass(i) {
      return ['p-accordion-tab', {
        'p-accordion-tab-active': this.isTabActive(i)
      }];
    },

    getTabHeaderClass(tab, i) {
      return ['p-accordion-header', this.getTabProp(tab, 'headerClass'), {
        'p-highlight': this.isTabActive(i),
        'p-disabled': this.getTabProp(tab, 'disabled')
      }];
    },

    getTabHeaderIconClass(i) {
      return ['p-accordion-toggle-icon', this.isTabActive(i) ? this.collapseIcon : this.expandIcon];
    },

    getTabContentClass(tab) {
      return ['p-toggleable-content', this.getTabProp(tab, 'contentClass')];
    }

  },
  computed: {
    tabs() {
      return this.$slots.default().reduce((tabs, child) => {
        if (this.isAccordionTab(child)) {
          tabs.push(child);
        } else if (child.children && child.children instanceof Array) {
          child.children.forEach(nestedChild => {
            if (this.isAccordionTab(nestedChild)) {
              tabs.push(nestedChild);
            }
          });
        }

        return tabs;
      }, []);
    },

    id() {
      return this.$attrs.id || UniqueComponentId();
    }

  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$1 = {
  class: "p-accordion p-component"
};
const _hoisted_2$1 = ["data-index"];
const _hoisted_3$1 = ["id", "tabindex", "aria-disabled", "aria-expanded", "aria-controls", "onClick", "onKeydown"];
const _hoisted_4$1 = {
  key: 0,
  class: "p-accordion-header-text"
};
const _hoisted_5$1 = ["id", "aria-labelledby"];
const _hoisted_6$1 = {
  class: "p-accordion-content"
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [(openBlock(true), createElementBlock(Fragment, null, renderList($options.tabs, (tab, i) => {
    return openBlock(), createElementBlock("div", {
      key: $options.getKey(tab, i),
      class: normalizeClass($options.getTabClass(i)),
      "data-index": i
    }, [createElementVNode("div", mergeProps({
      style: $options.getTabProp(tab, 'headerStyle'),
      class: $options.getTabHeaderClass(tab, i)
    }, $options.getTabProp(tab, 'headerProps')), [createElementVNode("a", mergeProps({
      id: $options.getTabHeaderActionId(i),
      class: "p-accordion-header-link p-accordion-header-action",
      tabindex: $options.getTabProp(tab, 'disabled') ? -1 : $props.tabindex,
      role: "button",
      "aria-disabled": $options.getTabProp(tab, 'disabled'),
      "aria-expanded": $options.isTabActive(i),
      "aria-controls": $options.getTabContentId(i),
      onClick: $event => $options.onTabClick($event, tab, i),
      onKeydown: $event => $options.onTabKeyDown($event, tab, i)
    }, $options.getTabProp(tab, 'headerActionProps')), [createElementVNode("span", {
      class: normalizeClass($options.getTabHeaderIconClass(i)),
      "aria-hidden": "true"
    }, null, 2), tab.props && tab.props.header ? (openBlock(), createElementBlock("span", _hoisted_4$1, toDisplayString(tab.props.header), 1)) : createCommentVNode("", true), tab.children && tab.children.header ? (openBlock(), createBlock(resolveDynamicComponent(tab.children.header), {
      key: 1
    })) : createCommentVNode("", true)], 16, _hoisted_3$1)], 16), createVNode(Transition, {
      name: "p-toggleable-content"
    }, {
      default: withCtx(() => [($props.lazy ? $options.isTabActive(i) : true) ? withDirectives((openBlock(), createElementBlock("div", mergeProps({
        key: 0,
        id: $options.getTabContentId(i),
        style: $options.getTabProp(tab, 'contentStyle'),
        class: $options.getTabContentClass(tab),
        role: "region",
        "aria-labelledby": $options.getTabHeaderActionId(i)
      }, $options.getTabProp(tab, 'contentProps')), [createElementVNode("div", _hoisted_6$1, [(openBlock(), createBlock(resolveDynamicComponent(tab)))])], 16, _hoisted_5$1)), [[vShow, $props.lazy ? true : $options.isTabActive(i)]]) : createCommentVNode("", true)]),
      _: 2
    }, 1024)], 10, _hoisted_2$1);
  }), 128))]);
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

var css_248z$1 = "\n.p-accordion-header-action {\n    cursor: pointer;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    position: relative;\n    text-decoration: none;\n}\n.p-accordion-header-action:focus {\n    z-index: 1;\n}\n.p-accordion-header-text {\n    line-height: 1;\n}\n";
styleInject(css_248z$1);
script$3.render = render$1;

var script$2 = {
  name: 'AccordionTab',
  props: {
    header: null,
    headerStyle: null,
    headerClass: null,
    headerProps: null,
    headerActionProps: null,
    contentStyle: null,
    contentClass: null,
    contentProps: null,
    disabled: Boolean
  }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return renderSlot(_ctx.$slots, "default");
}

script$2.render = render;

const _withScopeId = n => (pushScopeId("data-v-70986bd9"),n=n(),popScopeId(),n);
const _hoisted_1 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/createElementVNode("p", null, "Schema:", -1 /* HOISTED */));
const _hoisted_2 = { style: {"position":"relative","margin-left":"20px","width":"70%"} };
const _hoisted_3 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/createElementVNode("tr", null, [
  /*#__PURE__*/createElementVNode("th", null, "Alias"),
  /*#__PURE__*/createElementVNode("th", null, "Type"),
  /*#__PURE__*/createElementVNode("th", null, "System"),
  /*#__PURE__*/createElementVNode("th", null, "Background Only"),
  /*#__PURE__*/createElementVNode("th", null, "Reference")
], -1 /* HOISTED */));
const _hoisted_4 = { key: 0 };
const _hoisted_5 = { key: 1 };
const _hoisted_6 = /*#__PURE__*/createTextVNode("Permissions: ");


var script$1 = {
  props: {
    route : Object
},
  setup(__props) {





return (_ctx, _cache) => {
  return (openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createElementVNode("table", _hoisted_2, [
      _hoisted_3,
      (openBlock(true), createElementBlock(Fragment, null, renderList(__props.route.schema, (field, alias) => {
        return (openBlock(), createElementBlock("tr", null, [
          createElementVNode("td", null, toDisplayString(alias), 1 /* TEXT */),
          createElementVNode("td", null, toDisplayString(field.type), 1 /* TEXT */),
          createElementVNode("td", null, toDisplayString((field.system) ? "yes" : "no"), 1 /* TEXT */),
          createElementVNode("td", null, toDisplayString((field.background) ? "yes" : "no"), 1 /* TEXT */),
          (field.reference && field.reference_type > 0)
            ? (openBlock(), createElementBlock("td", _hoisted_4, toDisplayString(field.reference), 1 /* TEXT */))
            : (openBlock(), createElementBlock("td", _hoisted_5, " "))
        ]))
      }), 256 /* UNKEYED_FRAGMENT */))
    ]),
    createElementVNode("p", null, [
      _hoisted_6,
      (openBlock(true), createElementBlock(Fragment, null, renderList(__props.route.perms, (perm) => {
        return (openBlock(), createElementBlock("span", null, toDisplayString(perm) + " ", 1 /* TEXT */))
      }), 256 /* UNKEYED_FRAGMENT */))
    ])
  ]))
}
}

};

var css_248z = "\nth[data-v-70986bd9] { text-align : left;}\r\n";
styleInject$1(css_248z);

script$1.__scopeId = "data-v-70986bd9";
script$1.__file = "presstojam/src/components/dev/sitemap-node.vue";

var script = {
  setup(__props) {

const routes = getRoutes();


return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$4), { header: "Routes" }, {
    default: withCtx(() => [
      createVNode(unref(script$3), null, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(routes), (route, uri) => {
            return (openBlock(), createBlock(unref(script$2), { header: uri }, {
              default: withCtx(() => [
                createVNode(script$1, { route: route }, null, 8 /* PROPS */, ["route"])
              ]),
              _: 2 /* DYNAMIC */
            }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["header"]))
          }), 256 /* UNKEYED_FRAGMENT */))
        ]),
        _: 1 /* STABLE */
      })
    ]),
    _: 1 /* STABLE */
  }))
}
}

};

script.__file = "presstojam/src/components/dev/sitemap.vue";

export { script as s };
