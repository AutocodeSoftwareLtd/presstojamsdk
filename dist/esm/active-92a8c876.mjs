import { openBlock, createBlock, unref, withCtx, createCommentVNode, createVNode, createElementBlock, Fragment, renderList, resolveDynamicComponent, computed, normalizeClass, resolveDirective, createElementVNode, withDirectives, mergeProps, toDisplayString, vShow, renderSlot, inject, onMounted } from 'vue';
import { g as getStoreById } from './fieldset.esm-bceed8ae.mjs';
import { g as getStore, a as createRepoStore, r as regStore, b as createActiveStore } from './reactivestores-e540cb98.mjs';
import { s as script$5 } from './panel.esm-0904c2bd.mjs';
import { a as script$8 } from './form-1144cc11.mjs';
import { a as script$7, s as script$a } from './table-195bb781.mjs';
import { s as script$6 } from './show-audit-23c30089.mjs';
import { s as script$9 } from './tree-3766f819.mjs';
import { s as script$b } from './slug-trail-f5b35e84.mjs';
import { R as Ripple } from './ripple.esm-9120ee72.mjs';
import { D as DomHandler, U as UniqueComponentId } from './utils.esm-d009df4f.mjs';

var script$4 = {
  props: {
    name : {
      type : String,
      required : true
    }
},
  setup(__props) {

const props = __props;



const repo = getStore(props.name);
const store = repo.store;
repo.selected.value = [{ key : repo.data.value['--id'], label : repo.label }];



return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$5), {
    header: _ctx.$t('models.' + unref(store).model + '.title')
  }, {
    icons: withCtx(() => [
      (unref(store).route.audit)
        ? (openBlock(), createBlock(script$6, {
            key: 0,
            repo: unref(repo)
          }, null, 8 /* PROPS */, ["repo"]))
        : createCommentVNode("v-if", true),
      createVNode(script$7, {
        name: __props.name,
        single: true
      }, null, 8 /* PROPS */, ["name"]),
      (openBlock(true), createElementBlock(Fragment, null, renderList(unref(store).route.settings.actions, (component) => {
        return (openBlock(), createBlock(resolveDynamicComponent(component), {
          data: unref(repo).data.value
        }, null, 8 /* PROPS */, ["data"]))
      }), 256 /* UNKEYED_FRAGMENT */))
    ]),
    default: withCtx(() => [
      (unref(repo).data.value['--id'])
        ? (openBlock(), createBlock(script$8, {
            key: 0,
            schema: unref(store).route.schema,
            model: unref(store).model,
            data: unref(repo).data.value,
            method: "put"
          }, null, 8 /* PROPS */, ["schema", "model", "data"]))
        : createCommentVNode("v-if", true)
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["header"]))
}
}

};

script$4.__file = "presstojam/src/components/display.vue";

var script$3 = {
  props: {
    model : String
},
  setup(__props) {

const props = __props;



const store = getStoreById(props.model);

const repo = createRepoStore(store);
regStore(props.model, repo);
repo.load();

const component = computed(() => {
    if (!store) return "";
    else if (!store.route) return "";
    else if (store.route.schema["--recursive"]) return "recursive";
    else if (store.route.singleton) return "form";
    else return "table";
});


function reload() {
    store.value.reload();
}

return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$5), {
    header: _ctx.$t('models.' + __props.model + '.title', 2),
    class: normalizeClass(["gc-child", __props.model])
  }, {
    default: withCtx(() => [
      (unref(component) == 'recursive')
        ? (openBlock(), createBlock(script$9, {
            key: 0,
            name: props.model,
            onOnMove: reload
          }, null, 8 /* PROPS */, ["name"]))
        : (unref(component) == 'table')
          ? (openBlock(), createBlock(script$a, {
              key: 1,
              name: props.model
            }, null, 8 /* PROPS */, ["name"]))
          : createCommentVNode("v-if", true)
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["header", "class"]))
}
}

};

script$3.__file = "presstojam/src/components/active/child-panel.vue";

var script$2 = {
  name: 'TabView',
  emits: ['update:activeIndex', 'tab-change', 'tab-click'],
  props: {
    activeIndex: {
      type: Number,
      default: 0
    },
    lazy: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: Number,
      default: 0
    },
    selectOnFocus: {
      type: Boolean,
      default: false
    },
    previousButtonProps: null,
    nextButtonProps: null
  },

  data() {
    return {
      d_activeIndex: this.activeIndex,
      isPrevButtonDisabled: true,
      isNextButtonDisabled: false
    };
  },

  watch: {
    activeIndex(newValue) {
      this.d_activeIndex = newValue;
      this.scrollInView({
        index: newValue
      });
    }

  },

  mounted() {
    this.updateInkBar();
    this.scrollable && this.updateButtonState();
  },

  updated() {
    this.updateInkBar();
  },

  methods: {
    isTabPanel(child) {
      return child.type.name === 'TabPanel';
    },

    isTabActive(index) {
      return this.d_activeIndex === index;
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

    onScroll(event) {
      this.scrollable && this.updateButtonState();
      event.preventDefault();
    },

    onPrevButtonClick() {
      const content = this.$refs.content;
      const width = DomHandler.getWidth(content) - this.getVisibleButtonWidths();
      const pos = content.scrollLeft - width;
      content.scrollLeft = pos <= 0 ? 0 : pos;
    },

    onNextButtonClick() {
      const content = this.$refs.content;
      const width = DomHandler.getWidth(content) - this.getVisibleButtonWidths();
      const pos = content.scrollLeft + width;
      const lastPos = content.scrollWidth - width;
      content.scrollLeft = pos >= lastPos ? lastPos : pos;
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
        case 'ArrowLeft':
          this.onTabArrowLeftKey(event);
          break;

        case 'ArrowRight':
          this.onTabArrowRightKey(event);
          break;

        case 'Home':
          this.onTabHomeKey(event);
          break;

        case 'End':
          this.onTabEndKey(event);
          break;

        case 'PageDown':
          this.onPageDownKey(event);
          break;

        case 'PageUp':
          this.onPageUpKey(event);
          break;

        case 'Enter':
        case 'Space':
          this.onTabEnterKey(event, tab, index);
          break;
      }
    },

    onTabArrowRightKey(event) {
      const nextHeaderAction = this.findNextHeaderAction(event.target.parentElement);
      nextHeaderAction ? this.changeFocusedTab(event, nextHeaderAction) : this.onTabHomeKey(event);
      event.preventDefault();
    },

    onTabArrowLeftKey(event) {
      const prevHeaderAction = this.findPrevHeaderAction(event.target.parentElement);
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

    onPageDownKey(event) {
      this.scrollInView({
        index: this.$refs.nav.children.length - 2
      });
      event.preventDefault();
    },

    onPageUpKey(event) {
      this.scrollInView({
        index: 0
      });
      event.preventDefault();
    },

    onTabEnterKey(event, tab, index) {
      this.changeActiveIndex(event, tab, index);
      event.preventDefault();
    },

    findNextHeaderAction(tabElement, selfCheck = false) {
      const headerElement = selfCheck ? tabElement : tabElement.nextElementSibling;
      return headerElement ? DomHandler.hasClass(headerElement, 'p-disabled') || DomHandler.hasClass(headerElement, 'p-tabview-ink-bar') ? this.findNextHeaderAction(headerElement) : DomHandler.findSingle(headerElement, '.p-tabview-header-action') : null;
    },

    findPrevHeaderAction(tabElement, selfCheck = false) {
      const headerElement = selfCheck ? tabElement : tabElement.previousElementSibling;
      return headerElement ? DomHandler.hasClass(headerElement, 'p-disabled') || DomHandler.hasClass(headerElement, 'p-tabview-ink-bar') ? this.findPrevHeaderAction(headerElement) : DomHandler.findSingle(headerElement, '.p-tabview-header-action') : null;
    },

    findFirstHeaderAction() {
      return this.findNextHeaderAction(this.$refs.nav.firstElementChild, true);
    },

    findLastHeaderAction() {
      return this.findPrevHeaderAction(this.$refs.nav.lastElementChild, true);
    },

    changeActiveIndex(event, tab, index) {
      if (!this.getTabProp(tab, 'disabled') && this.d_activeIndex !== index) {
        this.d_activeIndex = index;
        this.$emit('update:activeIndex', index);
        this.$emit('tab-change', {
          originalEvent: event,
          index
        });
        this.scrollInView({
          index
        });
      }
    },

    changeFocusedTab(event, element) {
      if (element) {
        DomHandler.focus(element);
        this.scrollInView({
          element
        });

        if (this.selectOnFocus) {
          const index = parseInt(element.parentElement.dataset.index, 10);
          const tab = this.tabs[index];
          this.changeActiveIndex(event, tab, index);
        }
      }
    },

    scrollInView({
      element,
      index = -1
    }) {
      const currentElement = element || this.$refs.nav.children[index];

      if (currentElement) {
        currentElement.scrollIntoView && currentElement.scrollIntoView({
          block: 'nearest'
        });
      }
    },

    updateInkBar() {
      let tabHeader = this.$refs.nav.children[this.d_activeIndex];
      this.$refs.inkbar.style.width = DomHandler.getWidth(tabHeader) + 'px';
      this.$refs.inkbar.style.left = DomHandler.getOffset(tabHeader).left - DomHandler.getOffset(this.$refs.nav).left + 'px';
    },

    updateButtonState() {
      const content = this.$refs.content;
      const {
        scrollLeft,
        scrollWidth
      } = content;
      const width = DomHandler.getWidth(content);
      this.isPrevButtonDisabled = scrollLeft === 0;
      this.isNextButtonDisabled = parseInt(scrollLeft) === scrollWidth - width;
    },

    getVisibleButtonWidths() {
      const {
        prevBtn,
        nextBtn
      } = this.$refs;
      return [prevBtn, nextBtn].reduce((acc, el) => el ? acc + DomHandler.getWidth(el) : acc, 0);
    },

    getTabHeaderClass(tab, i) {
      return ['p-tabview-header', this.getTabProp(tab, 'headerClass'), {
        'p-highlight': this.d_activeIndex === i,
        'p-disabled': this.getTabProp(tab, 'disabled')
      }];
    },

    getTabContentClass(tab) {
      return ['p-tabview-panel', this.getTabProp(tab, 'contentClass')];
    }

  },
  computed: {
    contentClasses() {
      return ['p-tabview p-component', {
        'p-tabview-scrollable': this.scrollable
      }];
    },

    tabs() {
      return this.$slots.default().reduce((tabs, child) => {
        if (this.isTabPanel(child)) {
          tabs.push(child);
        } else if (child.children && child.children instanceof Array) {
          child.children.forEach(nestedChild => {
            if (this.isTabPanel(nestedChild)) {
              tabs.push(nestedChild);
            }
          });
        }

        return tabs;
      }, []);
    },

    prevButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.previous : undefined;
    },

    nextButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.next : undefined;
    },

    id() {
      return this.$attrs.id || UniqueComponentId();
    }

  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1 = {
  class: "p-tabview-nav-container"
};
const _hoisted_2 = ["tabindex", "aria-label"];

const _hoisted_3 = /*#__PURE__*/createElementVNode("span", {
  class: "pi pi-chevron-left",
  "aria-hidden": "true"
}, null, -1);

const _hoisted_4 = [_hoisted_3];
const _hoisted_5 = {
  ref: "nav",
  class: "p-tabview-nav",
  role: "tablist"
};
const _hoisted_6 = ["data-index"];
const _hoisted_7 = ["id", "tabindex", "aria-disabled", "aria-selected", "aria-controls", "onClick", "onKeydown"];
const _hoisted_8 = {
  key: 0,
  class: "p-tabview-title"
};
const _hoisted_9 = {
  ref: "inkbar",
  class: "p-tabview-ink-bar",
  role: "presentation",
  "aria-hidden": "true"
};
const _hoisted_10 = ["tabindex", "aria-label"];

const _hoisted_11 = /*#__PURE__*/createElementVNode("span", {
  class: "pi pi-chevron-right",
  "aria-hidden": "true"
}, null, -1);

const _hoisted_12 = [_hoisted_11];
const _hoisted_13 = {
  class: "p-tabview-panels"
};
const _hoisted_14 = ["aria-labelledby"];

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");

  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.contentClasses)
  }, [createElementVNode("div", _hoisted_1, [$props.scrollable && !$data.isPrevButtonDisabled ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
    key: 0,
    ref: "prevBtn",
    type: "button",
    class: "p-tabview-nav-prev p-tabview-nav-btn p-link",
    tabindex: $props.tabindex,
    "aria-label": $options.prevButtonAriaLabel,
    onClick: _cache[0] || (_cache[0] = (...args) => $options.onPrevButtonClick && $options.onPrevButtonClick(...args))
  }, $props.previousButtonProps), _hoisted_4, 16, _hoisted_2)), [[_directive_ripple]]) : createCommentVNode("", true), createElementVNode("div", {
    ref: "content",
    class: "p-tabview-nav-content",
    onScroll: _cache[1] || (_cache[1] = (...args) => $options.onScroll && $options.onScroll(...args))
  }, [createElementVNode("ul", _hoisted_5, [(openBlock(true), createElementBlock(Fragment, null, renderList($options.tabs, (tab, i) => {
    return openBlock(), createElementBlock("li", mergeProps({
      key: $options.getKey(tab, i),
      style: $options.getTabProp(tab, 'headerStyle'),
      class: $options.getTabHeaderClass(tab, i),
      role: "presentation",
      "data-index": i
    }, $options.getTabProp(tab, 'headerProps')), [withDirectives((openBlock(), createElementBlock("a", mergeProps({
      id: $options.getTabHeaderActionId(i),
      class: "p-tabview-nav-link p-tabview-header-action",
      tabindex: $options.getTabProp(tab, 'disabled') || !$options.isTabActive(i) ? -1 : $props.tabindex,
      role: "tab",
      "aria-disabled": $options.getTabProp(tab, 'disabled'),
      "aria-selected": $options.isTabActive(i),
      "aria-controls": $options.getTabContentId(i),
      onClick: $event => $options.onTabClick($event, tab, i),
      onKeydown: $event => $options.onTabKeyDown($event, tab, i)
    }, $options.getTabProp(tab, 'headerActionProps')), [tab.props && tab.props.header ? (openBlock(), createElementBlock("span", _hoisted_8, toDisplayString(tab.props.header), 1)) : createCommentVNode("", true), tab.children && tab.children.header ? (openBlock(), createBlock(resolveDynamicComponent(tab.children.header), {
      key: 1
    })) : createCommentVNode("", true)], 16, _hoisted_7)), [[_directive_ripple]])], 16, _hoisted_6);
  }), 128)), createElementVNode("li", _hoisted_9, null, 512)], 512)], 544), $props.scrollable && !$data.isNextButtonDisabled ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
    key: 1,
    ref: "nextBtn",
    type: "button",
    class: "p-tabview-nav-next p-tabview-nav-btn p-link",
    tabindex: $props.tabindex,
    "aria-label": $options.nextButtonAriaLabel,
    onClick: _cache[2] || (_cache[2] = (...args) => $options.onNextButtonClick && $options.onNextButtonClick(...args))
  }, $props.nextButtonProps), _hoisted_12, 16, _hoisted_10)), [[_directive_ripple]]) : createCommentVNode("", true)]), createElementVNode("div", _hoisted_13, [(openBlock(true), createElementBlock(Fragment, null, renderList($options.tabs, (tab, i) => {
    return openBlock(), createElementBlock(Fragment, {
      key: $options.getKey(tab, i)
    }, [($props.lazy ? $options.isTabActive(i) : true) ? withDirectives((openBlock(), createElementBlock("div", mergeProps({
      key: 0,
      style: $options.getTabProp(tab, 'contentStyle'),
      class: $options.getTabContentClass(tab),
      role: "tabpanel",
      "aria-labelledby": $options.getTabHeaderActionId(i)
    }, $options.getTabProp(tab, 'contentProps')), [(openBlock(), createBlock(resolveDynamicComponent(tab)))], 16, _hoisted_14)), [[vShow, $props.lazy ? true : $options.isTabActive(i)]]) : createCommentVNode("", true)], 64);
  }), 128))])], 2);
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

var css_248z = "\n.p-tabview-nav-container {\n    position: relative;\n}\n.p-tabview-scrollable .p-tabview-nav-container {\n    overflow: hidden;\n}\n.p-tabview-nav-content {\n    overflow-x: auto;\n    overflow-y: hidden;\n    scroll-behavior: smooth;\n    scrollbar-width: none;\n    -ms-scroll-chaining: contain auto;\n        overscroll-behavior: contain auto;\n}\n.p-tabview-nav {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n}\n.p-tabview-header-action {\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    position: relative;\n    text-decoration: none;\n    overflow: hidden;\n}\n.p-tabview-ink-bar {\n    display: none;\n    z-index: 1;\n}\n.p-tabview-header-action:focus {\n    z-index: 1;\n}\n.p-tabview-title {\n    line-height: 1;\n    white-space: nowrap;\n}\n.p-tabview-nav-btn {\n    position: absolute;\n    top: 0;\n    z-index: 2;\n    height: 100%;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n}\n.p-tabview-nav-prev {\n    left: 0;\n}\n.p-tabview-nav-next {\n    right: 0;\n}\n.p-tabview-nav-content::-webkit-scrollbar {\n    display: none;\n}\n";
styleInject(css_248z);
script$2.render = render$1;

var script$1 = {
  name: 'TabPanel',
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

script$1.render = render;

var script = {
  props: {
    model : String,
    base : String
},
  setup(__props) {

const props = __props;

const i18n = inject("i18n");
const t = i18n.t;



/*
<TabPanel v-for="child in store.route.children" :header="child">
            <PtjChildPanel :parent="store.active['--id']" :model="child" />
        </TabPanel>
*/



const store = getStoreById(props.model);

const repo = createActiveStore(store);
regStore(props.model, repo);
repo.load()
.catch(e => console.log(e));


const label = computed(() => {
    return t('models.' + props.model + '.title') + ': ' + repo.label.value;
});

if (store.route && store.route.settings.active && store.route.settings.active.mounted) {
    onMounted(() => {
        store.route.settings.active.mounted(store);
    });
}


return (_ctx, _cache) => {
  return (openBlock(), createElementBlock(Fragment, null, [
    createVNode(script$b, { name: __props.model }, null, 8 /* PROPS */, ["name"]),
    createVNode(unref(script$5), { header: unref(label) }, {
      default: withCtx(() => [
        createVNode(unref(script$2), null, {
          default: withCtx(() => [
            createVNode(unref(script$1), {
              header: unref(repo).label.value
            }, {
              default: withCtx(() => [
                createVNode(script$4, {
                  name: props.model
                }, null, 8 /* PROPS */, ["name"])
              ]),
              _: 1 /* STABLE */
            }, 8 /* PROPS */, ["header"]),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(store).route.schema['--id'].reference, (child) => {
              return (openBlock(), createBlock(unref(script$1), {
                header: _ctx.$t('models.' + child + '.title', 2)
              }, {
                default: withCtx(() => [
                  createVNode(script$3, { model: child }, null, 8 /* PROPS */, ["model"])
                ]),
                _: 2 /* DYNAMIC */
              }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["header"]))
            }), 256 /* UNKEYED_FRAGMENT */))
          ]),
          _: 1 /* STABLE */
        })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["header"])
  ], 64 /* STABLE_FRAGMENT */))
}
}

};

script.__file = "presstojam/src/components/active/active.vue";

export { script$3 as a, script as s };
