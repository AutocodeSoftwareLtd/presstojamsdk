import { openBlock, createElementBlock, normalizeClass, Fragment, renderList, createBlock, resolveDynamicComponent, createElementVNode, normalizeStyle, createCommentVNode, renderSlot, ref, computed, unref, withCtx, createVNode, createTextVNode, toDisplayString } from 'vue';
import { s as script$4 } from './inputtext.esm-98b20197.mjs';
import { b as script$5, d as script$6 } from './form-1144cc11.mjs';
import { D as DomHandler, O as ObjectUtils } from './utils.esm-d009df4f.mjs';
import { b as script$3, c as script$7, d as script$a, a as script$b, e as script$c } from './table-195bb781.mjs';
import { t as toTree, j as getForegroundCells, i as getLabel, s as saveOrder } from './routes-c7b670d2.mjs';
import { g as getStore, a as createRepoStore, r as regStore } from './reactivestores-e540cb98.mjs';
import { s as script$8, a as script$9 } from './edit-action-61488f7b.mjs';
import { s as styleInject$1 } from './style-inject.es-04d8aa40.mjs';

var script$2 = {
  name: 'Splitter',
  emits: ['resizestart', 'resizeend'],
  props: {
    layout: {
      type: String,
      default: 'horizontal'
    },
    gutterSize: {
      type: Number,
      default: 4
    },
    stateKey: {
      type: String,
      default: null
    },
    stateStorage: {
      type: String,
      default: 'session'
    },
    step: {
      type: Number,
      default: 5
    }
  },
  dragging: false,
  mouseMoveListener: null,
  mouseUpListener: null,
  touchMoveListener: null,
  touchEndListener: null,
  size: null,
  gutterElement: null,
  startPos: null,
  prevPanelElement: null,
  nextPanelElement: null,
  nextPanelSize: null,
  prevPanelSize: null,
  panelSizes: null,
  prevPanelIndex: null,
  timer: null,

  data() {
    return {
      prevSize: null
    };
  },

  mounted() {
    if (this.panels && this.panels.length) {
      let initialized = false;

      if (this.isStateful()) {
        initialized = this.restoreState();
      }

      if (!initialized) {
        let children = [...this.$el.children].filter(child => DomHandler.hasClass(child, 'p-splitter-panel'));
        let _panelSizes = [];
        this.panels.map((panel, i) => {
          let panelInitialSize = panel.props && panel.props.size ? panel.props.size : null;
          let panelSize = panelInitialSize || 100 / this.panels.length;
          _panelSizes[i] = panelSize;
          children[i].style.flexBasis = 'calc(' + panelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
        });
        this.panelSizes = _panelSizes;
        this.prevSize = parseFloat(_panelSizes[0]).toFixed(4);
      }
    }
  },

  beforeUnmount() {
    this.clear();
    this.unbindMouseListeners();
  },

  methods: {
    isSplitterPanel(child) {
      return child.type.name === 'SplitterPanel';
    },

    onResizeStart(event, index, isKeyDown) {
      this.gutterElement = event.currentTarget || event.target.parentElement;
      this.size = this.horizontal ? DomHandler.getWidth(this.$el) : DomHandler.getHeight(this.$el);

      if (!isKeyDown) {
        this.dragging = true;
        this.startPos = this.layout === 'horizontal' ? event.pageX || event.changedTouches[0].pageX : event.pageY || event.changedTouches[0].pageY;
      }

      this.prevPanelElement = this.gutterElement.previousElementSibling;
      this.nextPanelElement = this.gutterElement.nextElementSibling;

      if (isKeyDown) {
        this.prevPanelSize = this.horizontal ? DomHandler.getOuterWidth(this.prevPanelElement, true) : DomHandler.getOuterHeight(this.prevPanelElement, true);
        this.nextPanelSize = this.horizontal ? DomHandler.getOuterWidth(this.nextPanelElement, true) : DomHandler.getOuterHeight(this.nextPanelElement, true);
      } else {
        this.prevPanelSize = 100 * (this.horizontal ? DomHandler.getOuterWidth(this.prevPanelElement, true) : DomHandler.getOuterHeight(this.prevPanelElement, true)) / this.size;
        this.nextPanelSize = 100 * (this.horizontal ? DomHandler.getOuterWidth(this.nextPanelElement, true) : DomHandler.getOuterHeight(this.nextPanelElement, true)) / this.size;
      }

      this.prevPanelIndex = index;
      this.$emit('resizestart', {
        originalEvent: event,
        sizes: this.panelSizes
      });
      DomHandler.addClass(this.gutterElement, 'p-splitter-gutter-resizing');
      DomHandler.addClass(this.$el, 'p-splitter-resizing');
    },

    onResize(event, step, isKeyDown) {
      let newPos, newPrevPanelSize, newNextPanelSize;

      if (isKeyDown) {
        if (this.horizontal) {
          newPrevPanelSize = 100 * (this.prevPanelSize + step) / this.size;
          newNextPanelSize = 100 * (this.nextPanelSize - step) / this.size;
        } else {
          newPrevPanelSize = 100 * (this.prevPanelSize - step) / this.size;
          newNextPanelSize = 100 * (this.nextPanelSize + step) / this.size;
        }
      } else {
        if (this.horizontal) newPos = event.pageX * 100 / this.size - this.startPos * 100 / this.size;else newPos = event.pageY * 100 / this.size - this.startPos * 100 / this.size;
        newPrevPanelSize = this.prevPanelSize + newPos;
        newNextPanelSize = this.nextPanelSize - newPos;
      }

      this.prevSize = parseFloat(newPrevPanelSize).toFixed(4);

      if (this.validateResize(newPrevPanelSize, newNextPanelSize)) {
        this.prevPanelElement.style.flexBasis = 'calc(' + newPrevPanelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
        this.nextPanelElement.style.flexBasis = 'calc(' + newNextPanelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
        this.panelSizes[this.prevPanelIndex] = newPrevPanelSize;
        this.panelSizes[this.prevPanelIndex + 1] = newNextPanelSize;
      }
    },

    onResizeEnd(event) {
      if (this.isStateful()) {
        this.saveState();
      }

      this.$emit('resizeend', {
        originalEvent: event,
        sizes: this.panelSizes
      });
      DomHandler.removeClass(this.gutterElement, 'p-splitter-gutter-resizing');
      DomHandler.removeClass(this.$el, 'p-splitter-resizing');
      this.clear();
    },

    repeat(event, index, step) {
      this.onResizeStart(event, index, true);
      this.onResize(event, step, true);
    },

    setTimer(event, index, step) {
      this.clearTimer();
      this.timer = setTimeout(() => {
        this.repeat(event, index, step);
      }, 40);
    },

    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },

    onGutterKeyUp() {
      this.clearTimer();
      this.onResizeEnd();
    },

    onGutterKeyDown(event, index) {
      switch (event.code) {
        case 'ArrowLeft':
          {
            if (this.layout === 'horizontal') {
              this.setTimer(event, index, this.step * -1);
            }

            event.preventDefault();
            break;
          }

        case 'ArrowRight':
          {
            if (this.layout === 'horizontal') {
              this.setTimer(event, index, this.step);
            }

            event.preventDefault();
            break;
          }

        case 'ArrowDown':
          {
            if (this.layout === 'vertical') {
              this.setTimer(event, index, this.step * -1);
            }

            event.preventDefault();
            break;
          }

        case 'ArrowUp':
          {
            if (this.layout === 'vertical') {
              this.setTimer(event, index, this.step);
            }

            event.preventDefault();
            break;
          }
      }
    },

    onGutterMouseDown(event, index) {
      this.onResizeStart(event, index);
      this.bindMouseListeners();
    },

    onGutterTouchStart(event, index) {
      this.onResizeStart(event, index);
      this.bindTouchListeners();
      event.preventDefault();
    },

    onGutterTouchMove(event) {
      this.onResize(event);
      event.preventDefault();
    },

    onGutterTouchEnd(event) {
      this.onResizeEnd(event);
      this.unbindTouchListeners();
      event.preventDefault();
    },

    bindMouseListeners() {
      if (!this.mouseMoveListener) {
        this.mouseMoveListener = event => this.onResize(event);

        document.addEventListener('mousemove', this.mouseMoveListener);
      }

      if (!this.mouseUpListener) {
        this.mouseUpListener = event => {
          this.onResizeEnd(event);
          this.unbindMouseListeners();
        };

        document.addEventListener('mouseup', this.mouseUpListener);
      }
    },

    bindTouchListeners() {
      if (!this.touchMoveListener) {
        this.touchMoveListener = event => this.onResize(event.changedTouches[0]);

        document.addEventListener('touchmove', this.touchMoveListener);
      }

      if (!this.touchEndListener) {
        this.touchEndListener = event => {
          this.resizeEnd(event);
          this.unbindTouchListeners();
        };

        document.addEventListener('touchend', this.touchEndListener);
      }
    },

    validateResize(newPrevPanelSize, newNextPanelSize) {
      let prevPanelMinSize = ObjectUtils.getVNodeProp(this.panels[0], 'minSize');

      if (this.panels[0].props && prevPanelMinSize && prevPanelMinSize > newPrevPanelSize) {
        return false;
      }

      let newPanelMinSize = ObjectUtils.getVNodeProp(this.panels[1], 'minSize');

      if (this.panels[1].props && newPanelMinSize && newPanelMinSize > newNextPanelSize) {
        return false;
      }

      return true;
    },

    unbindMouseListeners() {
      if (this.mouseMoveListener) {
        document.removeEventListener('mousemove', this.mouseMoveListener);
        this.mouseMoveListener = null;
      }

      if (this.mouseUpListener) {
        document.removeEventListener('mouseup', this.mouseUpListener);
        this.mouseUpListener = null;
      }
    },

    unbindTouchListeners() {
      if (this.touchMoveListener) {
        document.removeEventListener('touchmove', this.touchMoveListener);
        this.touchMoveListener = null;
      }

      if (this.touchEndListener) {
        document.removeEventListener('touchend', this.touchEndListener);
        this.touchEndListener = null;
      }
    },

    clear() {
      this.dragging = false;
      this.size = null;
      this.startPos = null;
      this.prevPanelElement = null;
      this.nextPanelElement = null;
      this.prevPanelSize = null;
      this.nextPanelSize = null;
      this.gutterElement = null;
      this.prevPanelIndex = null;
    },

    isStateful() {
      return this.stateKey != null;
    },

    getStorage() {
      switch (this.stateStorage) {
        case 'local':
          return window.localStorage;

        case 'session':
          return window.sessionStorage;

        default:
          throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
      }
    },

    saveState() {
      this.getStorage().setItem(this.stateKey, JSON.stringify(this.panelSizes));
    },

    restoreState() {
      const storage = this.getStorage();
      const stateString = storage.getItem(this.stateKey);

      if (stateString) {
        this.panelSizes = JSON.parse(stateString);
        let children = [...this.$el.children].filter(child => DomHandler.hasClass(child, 'p-splitter-panel'));
        children.forEach((child, i) => {
          child.style.flexBasis = 'calc(' + this.panelSizes[i] + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
        });
        return true;
      }

      return false;
    }

  },
  computed: {
    containerClass() {
      return ['p-splitter p-component', 'p-splitter-' + this.layout];
    },

    panels() {
      const panels = [];
      this.$slots.default().forEach(child => {
        if (this.isSplitterPanel(child)) {
          panels.push(child);
        } else if (child.children instanceof Array) {
          child.children.forEach(nestedChild => {
            if (this.isSplitterPanel(nestedChild)) {
              panels.push(nestedChild);
            }
          });
        }
      });
      return panels;
    },

    gutterStyle() {
      if (this.horizontal) return {
        width: this.gutterSize + 'px'
      };else return {
        height: this.gutterSize + 'px'
      };
    },

    horizontal() {
      return this.layout === 'horizontal';
    }

  }
};
const _hoisted_1$1 = ["onMousedown", "onTouchstart", "onTouchmove", "onTouchend"];
const _hoisted_2$1 = ["aria-orientation", "aria-valuenow", "onKeydown"];

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.containerClass)
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($options.panels, (panel, i) => {
    return openBlock(), createElementBlock(Fragment, {
      key: i
    }, [(openBlock(), createBlock(resolveDynamicComponent(panel), {
      tabindex: "-1"
    })), i !== $options.panels.length - 1 ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: "p-splitter-gutter",
      role: "separator",
      tabindex: "-1",
      onMousedown: $event => $options.onGutterMouseDown($event, i),
      onTouchstart: $event => $options.onGutterTouchStart($event, i),
      onTouchmove: $event => $options.onGutterTouchMove($event, i),
      onTouchend: $event => $options.onGutterTouchEnd($event, i)
    }, [createElementVNode("div", {
      class: "p-splitter-gutter-handle",
      tabindex: "0",
      style: normalizeStyle($options.gutterStyle),
      "aria-orientation": $props.layout,
      "aria-valuenow": $data.prevSize,
      onKeyup: _cache[0] || (_cache[0] = (...args) => $options.onGutterKeyUp && $options.onGutterKeyUp(...args)),
      onKeydown: $event => $options.onGutterKeyDown($event, i)
    }, null, 44, _hoisted_2$1)], 40, _hoisted_1$1)) : createCommentVNode("", true)], 64);
  }), 128))], 2);
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

var css_248z$1 = "\n.p-splitter {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-wrap: nowrap;\n        flex-wrap: nowrap;\n}\n.p-splitter-vertical {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n}\n.p-splitter-panel {\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n}\n.p-splitter-panel-nested {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n.p-splitter-panel .p-splitter {\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n    border: 0 none;\n}\n.p-splitter-gutter {\n    -webkit-box-flex: 0;\n        -ms-flex-positive: 0;\n            flex-grow: 0;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    cursor: col-resize;\n}\n.p-splitter-horizontal.p-splitter-resizing {\n    cursor: col-resize;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n}\n.p-splitter-horizontal > .p-splitter-gutter > .p-splitter-gutter-handle {\n    height: 24px;\n    width: 100%;\n}\n.p-splitter-horizontal > .p-splitter-gutter {\n    cursor: col-resize;\n}\n.p-splitter-vertical.p-splitter-resizing {\n    cursor: row-resize;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n}\n.p-splitter-vertical > .p-splitter-gutter {\n    cursor: row-resize;\n}\n.p-splitter-vertical > .p-splitter-gutter > .p-splitter-gutter-handle {\n    width: 24px;\n    height: 100%;\n}\n";
styleInject(css_248z$1);
script$2.render = render$1;

var script$1 = {
  name: 'SplitterPanel',
  props: {
    size: {
      type: Number,
      default: null
    },
    minSize: {
      type: Number,
      default: null
    }
  },
  computed: {
    containerClass() {
      return ['p-splitter-panel', {
        'p-splitter-panel-nested': this.isNested
      }];
    },

    isNested() {
      return this.$slots.default().some(child => {
        return child.type.name === 'Splitter';
      });
    }

  }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "container",
    class: normalizeClass($options.containerClass)
  }, [renderSlot(_ctx.$slots, "default")], 2);
}

script$1.render = render;

const _hoisted_1 = {
  class: "wrapper",
  style: {"display":"grid"}
};
const _hoisted_2 = /*#__PURE__*/createTextVNode("New row created");
const _hoisted_3 = /*#__PURE__*/createTextVNode("Rows removed");
const _hoisted_4 = { style: {"overflow-x":"scroll"} };





var script = {
  props: {
    name : {
      type : String,
      required : true
    }
},
  emits: ["onMove"],
  setup(__props, { emit: emits }) {

const props = __props;





const repo = getStore(props.name);
const store = repo.store;


const has_primary = (store.route.children.length > 1) ? true : false;
const expanded = ref(false);
//const col_expandable = (Object.keys(store.route.schema).length > max_cols) ? true : false;
const delrow = ref(false);
const newrow = ref(false);
const childRepo = createRepoStore(store);
regStore(props.name + "_selected", childRepo);
childRepo.parent_id = repo.parent_id;
ref([]);


const nodes = computed(() => {
  const data= toTree(repo.data.value, store.route.schema);
  return data;
});


let fields = computed(() => {
    return getForegroundCells(store.route.schema);
});


function reorderRows(rows) {
  childRepo.data.value = rows;
  saveOrder(store.model, rows);
}

repo.load()
.then(response => {
  childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == 0);
});


repo.active.value['--recursive'] = 0;

const expandedKeys = ref({});
const selectedKey = ref();

const collapseAll = () => {
    expandedKeys.value = {};
    expanded.value = false;
};

const expandAll = () => {
    for (let node of nodes.value) {
        expandNode(node);
    }
    expandedKeys.value = {...expandedKeys.value};
    expanded.value = true;
};

const expandNode = (node) => {
    if (node.children && node.children.length) {
      expandedKeys.value[node.key] = true;
      for (let child of node.children) {
          expandNode(child);
      }
    }
};

function onDel() {
    repo.reload()
    .then(() => {
      childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == 0);
    });
    delrow.value = true;
}

const label = computed(() => {
  return getLabel(store.route.schema, repo.active.value);
});

const onNodeSelect = (node) => {
   repo.active.value = node.data;
   childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == node.key);
};

const onNodeClear = (node) => {
  repo.active.value = {};
  childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == 0);
};



function reload() {
  repo.reload()
  .then(() => {
    childRepo.data.value = repo.data.value.filter(obj => obj['--recursive'] == 0);
  });
  newrow.value = true;
}


return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$2), null, {
    default: withCtx(() => [
      createVNode(unref(script$1), {
        size: 20,
        style: {"padding":"10px"}
      }, {
        default: withCtx(() => [
          createVNode(unref(script$3), { class: "mb-4" }, {
            start: withCtx(() => [
              (expanded.value)
                ? (openBlock(), createBlock(unref(script$4), {
                    key: 0,
                    type: "button",
                    icon: "pi pi-minus",
                    label: "Collapse All",
                    onClick: collapseAll
                  }))
                : (openBlock(), createBlock(unref(script$4), {
                    key: 1,
                    type: "button",
                    icon: "pi pi-plus",
                    label: "Expand All",
                    onClick: expandAll
                  }))
            ]),
            _: 1 /* STABLE */
          }),
          createVNode(unref(script$5), {
            value: unref(nodes),
            filter: true,
            filterMode: "lenient",
            selectionMode: "single",
            expandedKeys: expandedKeys.value,
            onNodeSelect: onNodeSelect,
            selectionKeys: selectedKey.value,
            "onUpdate:selectionKeys": _cache[0] || (_cache[0] = $event => ((selectedKey).value = $event))
          }, null, 8 /* PROPS */, ["value", "expandedKeys", "selectionKeys"])
        ]),
        _: 1 /* STABLE */
      }),
      createVNode(unref(script$1), {
        size: 80,
        style: {"padding":"10px"}
      }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            (newrow.value)
              ? (openBlock(), createBlock(unref(script$6), {
                  key: 0,
                  severity: "success"
                }, {
                  default: withCtx(() => [
                    _hoisted_2
                  ]),
                  _: 1 /* STABLE */
                }))
              : createCommentVNode("v-if", true),
            (delrow.value)
              ? (openBlock(), createBlock(unref(script$6), {
                  key: 1,
                  severity: "success"
                }, {
                  default: withCtx(() => [
                    _hoisted_3
                  ]),
                  _: 1 /* STABLE */
                }))
              : createCommentVNode("v-if", true),
            createVNode(unref(script$3), null, {
              start: withCtx(() => [
                (unref(repo).active.value['--id'])
                  ? (openBlock(), createBlock(unref(script$4), {
                      key: 0,
                      icon: "pi pi-times",
                      class: "p-button-rounded p-button-success",
                      onClick: onNodeClear
                    }))
                  : createCommentVNode("v-if", true),
                (unref(has_primary) && unref(repo).active.value['--id'])
                  ? (openBlock(), createBlock(script$7, {
                      key: 1,
                      model: unref(store).model,
                      id: unref(repo).active.value['--id']
                    }, null, 8 /* PROPS */, ["model", "id"]))
                  : createCommentVNode("v-if", true),
                (unref(repo).active.value['--id'])
                  ? (openBlock(), createBlock(script$8, {
                      key: 2,
                      store: unref(store),
                      data: unref(repo).active.value
                    }, null, 8 /* PROPS */, ["store", "data"]))
                  : createCommentVNode("v-if", true),
                createTextVNode(" " + toDisplayString(unref(label)), 1 /* TEXT */)
              ]),
              end: withCtx(() => [
                (unref(store).route.perms.includes('put'))
                  ? (openBlock(), createBlock(script$9, {
                      key: 0,
                      name: __props.name + '_selected',
                      onOnMove: reload
                    }, null, 8 /* PROPS */, ["name"]))
                  : createCommentVNode("v-if", true),
                (unref(store).route.perms.includes('post'))
                  ? (openBlock(), createBlock(script$a, {
                      key: 1,
                      name: __props.name,
                      onOnSave: reload
                    }, null, 8 /* PROPS */, ["name"]))
                  : createCommentVNode("v-if", true),
                (unref(store).route.perms.includes('delete'))
                  ? (openBlock(), createBlock(script$b, {
                      key: 2,
                      name: __props.name + '_selected',
                      onOnDel: onDel
                    }, null, 8 /* PROPS */, ["name"]))
                  : createCommentVNode("v-if", true)
              ]),
              _: 1 /* STABLE */
            }),
            createElementVNode("div", _hoisted_4, [
              createVNode(script$c, {
                name: __props.name + '_selected',
                fields: unref(fields),
                onReorder: reorderRows
              }, null, 8 /* PROPS */, ["name", "fields"])
            ])
          ])
        ]),
        _: 1 /* STABLE */
      })
    ]),
    _: 1 /* STABLE */
  }))
}
}

};

var css_248z = "\n.tree-vue-vue-type-style-index-0-id-49a3d7ba-scoped-true-lang_wrapper__KEFQt[data-v-49a3d7ba] {\r\n  display : grid;\r\n  margin-left : 0;\r\n  margin-right : 0;\r\n  box-sizing : content-box;\n}\r\n\r\n";
styleInject$1(css_248z);

script.__scopeId = "data-v-49a3d7ba";
script.__file = "presstojam/src/components/tree/tree.vue";

export { script as s };
