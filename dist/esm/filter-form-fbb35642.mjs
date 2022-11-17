import { computed, openBlock, createElementBlock, createVNode, unref, mergeProps, isRef, createElementVNode, createBlock, resolveComponent, resolveDirective, normalizeClass, renderSlot, Fragment, createTextVNode, toDisplayString, renderList, createCommentVNode, withCtx, Transition, withDirectives, normalizeStyle, createSlots, inject, ref, onMounted, reactive, provide } from 'vue';
import { s as script$b } from './inputtext.esm-98b20197.mjs';
import { s as script$g } from './overlaypanel.esm-03472203.mjs';
import { g as getStoreById, s as script$f, d as script$h } from './fieldset.esm-bceed8ae.mjs';
import { s as script$a, a as script$c, c as FilterService, d as script$d } from './dropdown.esm-42467633.mjs';
import { O as OverlayEventBus, s as script$e } from './portal.esm-7deedf95.mjs';
import { R as Ripple } from './ripple.esm-9120ee72.mjs';
import { Z as ZIndexUtils, O as ObjectUtils, D as DomHandler, C as ConnectedOverlayScrollHandler, U as UniqueComponentId } from './utils.esm-d009df4f.mjs';
import { i as getLabel } from './routes-c7b670d2.mjs';
import { s as styleInject$2 } from './style-inject.es-04d8aa40.mjs';

const _hoisted_1$4 = { class: "p-inputgroup" };
const _hoisted_2$3 = /*#__PURE__*/createElementVNode("span", { class: "p-inputgroup-addon" }, "min", -1 /* HOISTED */);
const _hoisted_3$3 = /*#__PURE__*/createElementVNode("span", { class: "p-inputgroup-addon" }, " - ", -1 /* HOISTED */);
const _hoisted_4$3 = /*#__PURE__*/createElementVNode("span", { class: "p-inputgroup-addon" }, "max", -1 /* HOISTED */);


var script$9 = {
  props: {
    modelValue : [Object],
    field : Object
},
  emits: [
    "update:modelValue"
],
  setup(__props, { emit: emits }) {

const props = __props;





const min = computed({
    get() {
        return (props.modelValue) ? props.modelValue.min : null;
    },
    set(val) {
        let max = null;
        if (props.modelValue) {
            max = (props.modelValue.max < val) ? val : props.modelValue.max;
        }
        emits('update:modelValue', { 'min' : val, 'max' : max });
    }
});

const max = computed({
    get() {
        return (props.modelValue) ? props.modelValue.max : null;
    },
    set(val) {
        let min = null;
        if (props.modelValue) {
            min = (props.modelValue.min > val) ? val : props.modelValue.min;
        }
        emits('update:modelValue', { 'min' : min, max : val});
    }
}); 

function clear() {
    emits('update:modelValue', null);
}



const atts = computed(() => {
    let atts = {};
    if (props.field.round) {
        let step = "0.";
        for(let i=0; i<props.field.round - 1; ++i) {
            step += "0";
        }
        step += "1";
        atts["step"]  = parseInt(step);
    }
    return atts;
});

return (_ctx, _cache) => {
  return (openBlock(), createElementBlock("div", _hoisted_1$4, [
    _hoisted_2$3,
    createVNode(unref(script$a), mergeProps({
      name: __props.field.name,
      modelValue: unref(min),
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(min) ? (min).value = $event : null))
    }, unref(atts), {
      onBlur: _cache[1] || (_cache[1] = $event => (__props.field.validateon = true))
    }), null, 16 /* FULL_PROPS */, ["name", "modelValue"]),
    _hoisted_3$3,
    createVNode(unref(script$a), mergeProps({
      name: __props.field.name,
      modelValue: unref(max),
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => (isRef(max) ? (max).value = $event : null))
    }, unref(atts), {
      onBlur: _cache[3] || (_cache[3] = $event => (__props.field.validateon = true))
    }), null, 16 /* FULL_PROPS */, ["name", "modelValue"]),
    _hoisted_4$3,
    createVNode(unref(script$b), {
      label: "clear",
      onClick: clear
    })
  ]))
}
}

};

script$9.__file = "presstojam/src/components/filter/number-filter.vue";

var script$8 = {
  props: {
    modelValue : [Number, Boolean],
    field : Object
},
  emits: [
    "update:modelValue"
],
  setup(__props, { emit: emits }) {

const props = __props;





const value = computed({
    get() {
        if (typeof props.modelValue === 'undefined' || props.modelValue === null) return 0;
        else if (props.modelValue === 0) return 2;
        else return props.modelValue;
    },
    set(val) {
        if (val == 0) val = null;
        else if (val == 2) val = 0;
        emits('update:modelValue', val);
    }
});



return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$c), {
    name: __props.field.name,
    modelValue: unref(value),
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(value) ? (value).value = $event : null)),
    optionLabel: "label",
    optionValue: "value",
    options: [
            {value : 0, label : 'All' }, 
            { value : 1, label : 'Checked' }, 
            { value : 2, label : 'Unchecked'}]
  }, null, 8 /* PROPS */, ["name", "modelValue"]))
}
}

};

script$8.__file = "presstojam/src/components/filter/flag-filter.vue";

var script$7 = {
  name: 'MultiSelect',
  emits: ['update:modelValue', 'change', 'focus', 'blur', 'before-show', 'before-hide', 'show', 'hide', 'filter', 'selectall-change'],
  props: {
    modelValue: null,
    options: Array,
    optionLabel: null,
    optionValue: null,
    optionDisabled: null,
    optionGroupLabel: null,
    optionGroupChildren: null,
    scrollHeight: {
      type: String,
      default: '200px'
    },
    placeholder: String,
    disabled: Boolean,
    inputId: {
      type: String,
      default: null
    },
    inputProps: {
      type: null,
      default: null
    },
    panelClass: {
      type: String,
      default: null
    },
    panelStyle: {
      type: null,
      default: null
    },
    panelProps: {
      type: null,
      default: null
    },
    filterInputProps: {
      type: null,
      default: null
    },
    closeButtonProps: {
      type: null,
      default: null
    },
    dataKey: null,
    filter: Boolean,
    filterPlaceholder: String,
    filterLocale: String,
    filterMatchMode: {
      type: String,
      default: 'contains'
    },
    filterFields: {
      type: Array,
      default: null
    },
    appendTo: {
      type: String,
      default: 'body'
    },
    display: {
      type: String,
      default: 'comma'
    },
    selectedItemsLabel: {
      type: String,
      default: '{0} items selected'
    },
    maxSelectedLabels: {
      type: Number,
      default: null
    },
    selectionLimit: {
      type: Number,
      default: null
    },
    showToggleAll: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    checkboxIcon: {
      type: String,
      default: 'pi pi-check'
    },
    closeIcon: {
      type: String,
      default: 'pi pi-times'
    },
    dropdownIcon: {
      type: String,
      default: 'pi pi-chevron-down'
    },
    filterIcon: {
      type: String,
      default: 'pi pi-search'
    },
    loadingIcon: {
      type: String,
      default: 'pi pi-spinner pi-spin'
    },
    removeTokenIcon: {
      type: String,
      default: 'pi pi-times-circle'
    },
    selectAll: {
      type: Boolean,
      default: null
    },
    resetFilterOnHide: {
      type: Boolean,
      default: false
    },
    virtualScrollerOptions: {
      type: Object,
      default: null
    },
    autoOptionFocus: {
      type: Boolean,
      default: true
    },
    autoFilterFocus: {
      type: Boolean,
      default: false
    },
    filterMessage: {
      type: String,
      default: null
    },
    selectionMessage: {
      type: String,
      default: null
    },
    emptySelectionMessage: {
      type: String,
      default: null
    },
    emptyFilterMessage: {
      type: String,
      default: null
    },
    emptyMessage: {
      type: String,
      default: null
    },
    tabindex: {
      type: Number,
      default: 0
    },
    'aria-label': {
      type: String,
      default: null
    },
    'aria-labelledby': {
      type: String,
      default: null
    }
  },
  outsideClickListener: null,
  scrollHandler: null,
  resizeListener: null,
  overlay: null,
  list: null,
  virtualScroller: null,
  startRangeIndex: -1,
  searchTimeout: null,
  searchValue: '',
  selectOnFocus: false,
  focusOnHover: false,

  data() {
    return {
      focused: false,
      focusedOptionIndex: -1,
      headerCheckboxFocused: false,
      filterValue: null,
      overlayVisible: false
    };
  },

  watch: {
    options() {
      this.autoUpdateModel();
    }

  },

  mounted() {
    this.autoUpdateModel();
  },

  beforeUnmount() {
    this.unbindOutsideClickListener();
    this.unbindResizeListener();

    if (this.scrollHandler) {
      this.scrollHandler.destroy();
      this.scrollHandler = null;
    }

    if (this.overlay) {
      ZIndexUtils.clear(this.overlay);
      this.overlay = null;
    }
  },

  methods: {
    getOptionIndex(index, fn) {
      return this.virtualScrollerDisabled ? index : fn && fn(index)['index'];
    },

    getOptionLabel(option) {
      return this.optionLabel ? ObjectUtils.resolveFieldData(option, this.optionLabel) : option;
    },

    getOptionValue(option) {
      return this.optionValue ? ObjectUtils.resolveFieldData(option, this.optionValue) : option;
    },

    getOptionRenderKey(option) {
      return this.dataKey ? ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option);
    },

    isOptionDisabled(option) {
      if (this.maxSelectionLimitReached && !this.isSelected(option)) {
        return true;
      }

      return this.optionDisabled ? ObjectUtils.resolveFieldData(option, this.optionDisabled) : false;
    },

    isOptionGroup(option) {
      return this.optionGroupLabel && option.optionGroup && option.group;
    },

    getOptionGroupLabel(optionGroup) {
      return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel);
    },

    getOptionGroupChildren(optionGroup) {
      return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren);
    },

    getAriaPosInset(index) {
      return (this.optionGroupLabel ? index - this.visibleOptions.slice(0, index).filter(option => this.isOptionGroup(option)).length : index) + 1;
    },

    show(isFocus) {
      this.$emit('before-show');
      this.overlayVisible = true;
      this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
      isFocus && DomHandler.focus(this.$refs.focusInput);
    },

    hide(isFocus) {
      this.$emit('before-hide');
      this.overlayVisible = false;
      this.focusedOptionIndex = -1;
      this.searchValue = '';
      this.resetFilterOnHide && (this.filterValue = null);
      isFocus && DomHandler.focus(this.$refs.focusInput);
    },

    onFocus(event) {
      this.focused = true;
      this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.overlayVisible && this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
      this.overlayVisible && this.scrollInView(this.focusedOptionIndex);
      this.$emit('focus', event);
    },

    onBlur(event) {
      this.focused = false;
      this.focusedOptionIndex = -1;
      this.searchValue = '';
      this.$emit('blur', event);
    },

    onKeyDown(event) {
      const metaKey = event.metaKey || event.ctrlKey;

      switch (event.code) {
        case 'ArrowDown':
          this.onArrowDownKey(event);
          break;

        case 'ArrowUp':
          this.onArrowUpKey(event);
          break;

        case 'Home':
          this.onHomeKey(event);
          break;

        case 'End':
          this.onEndKey(event);
          break;

        case 'PageDown':
          this.onPageDownKey(event);
          break;

        case 'PageUp':
          this.onPageUpKey(event);
          break;

        case 'Enter':
        case 'Space':
          this.onEnterKey(event);
          break;

        case 'Escape':
          this.onEscapeKey(event);
          break;

        case 'Tab':
          this.onTabKey(event);
          break;

        case 'ShiftLeft':
        case 'ShiftRight':
          this.onShiftKey(event);
          break;

        default:
          if (event.code === 'KeyA' && metaKey) {
            const value = this.visibleOptions.filter(option => this.isValidOption(option)).map(option => this.getOptionValue(option));
            this.updateModel(event, value);
            event.preventDefault();
            break;
          }

          if (!metaKey && ObjectUtils.isPrintableCharacter(event.key)) {
            !this.overlayVisible && this.show();
            this.searchOptions(event);
            event.preventDefault();
          }

          break;
      }
    },

    onContainerClick(event) {
      if (this.disabled || this.loading) {
        return;
      }

      if (!this.overlay || !this.overlay.contains(event.target)) {
        this.overlayVisible ? this.hide(true) : this.show(true);
      }
    },

    onFirstHiddenFocus(event) {
      const relatedTarget = event.relatedTarget;

      if (relatedTarget === this.$refs.focusInput) {
        const firstFocusableEl = DomHandler.getFirstFocusableElement(this.overlay, ':not(.p-hidden-focusable)');
        DomHandler.focus(firstFocusableEl);
      } else {
        DomHandler.focus(this.$refs.focusInput);
      }
    },

    onLastHiddenFocus() {
      DomHandler.focus(this.$refs.firstHiddenFocusableElementOnOverlay);
    },

    onCloseClick() {
      this.hide(true);
    },

    onHeaderCheckboxFocus() {
      this.headerCheckboxFocused = true;
    },

    onHeaderCheckboxBlur() {
      this.headerCheckboxFocused = false;
    },

    onOptionSelect(event, option, index = -1, isFocus = false) {
      if (this.disabled || this.isOptionDisabled(option)) {
        return;
      }

      let selected = this.isSelected(option);
      let value = null;
      if (selected) value = this.modelValue.filter(val => !ObjectUtils.equals(val, this.getOptionValue(option), this.equalityKey));else value = [...(this.modelValue || []), this.getOptionValue(option)];
      this.updateModel(event, value);
      index !== -1 && (this.focusedOptionIndex = index);
      isFocus && DomHandler.focus(this.$refs.focusInput);
    },

    onOptionMouseMove(event, index) {
      if (this.focusOnHover) {
        this.changeFocusedOptionIndex(event, index);
      }
    },

    onOptionSelectRange(event, start = -1, end = -1) {
      start === -1 && (start = this.findNearestSelectedOptionIndex(end, true));
      end === -1 && (end = this.findNearestSelectedOptionIndex(start));

      if (start !== -1 && end !== -1) {
        const rangeStart = Math.min(start, end);
        const rangeEnd = Math.max(start, end);
        const value = this.visibleOptions.slice(rangeStart, rangeEnd + 1).filter(option => this.isValidOption(option)).map(option => this.getOptionValue(option));
        this.updateModel(event, value);
      }
    },

    onFilterChange(event) {
      const value = event.target.value;
      this.filterValue = value;
      this.focusedOptionIndex = -1;
      this.$emit('filter', {
        originalEvent: event,
        value
      });
      !this.virtualScrollerDisabled && this.virtualScroller.scrollToIndex(0);
    },

    onFilterKeyDown(event) {
      switch (event.code) {
        case 'ArrowDown':
          this.onArrowDownKey(event);
          break;

        case 'ArrowUp':
          this.onArrowUpKey(event, true);
          break;

        case 'ArrowLeft':
        case 'ArrowRight':
          this.onArrowLeftKey(event, true);
          break;

        case 'Home':
          this.onHomeKey(event, true);
          break;

        case 'End':
          this.onEndKey(event, true);
          break;

        case 'Enter':
          this.onEnterKey(event);
          break;

        case 'Escape':
          this.onEscapeKey(event);
          break;

        case 'Tab':
          this.onTabKey(event, true);
          break;
      }
    },

    onFilterBlur() {
      this.focusedOptionIndex = -1;
    },

    onFilterUpdated() {
      if (this.overlayVisible) {
        this.alignOverlay();
      }
    },

    onOverlayClick(event) {
      OverlayEventBus.emit('overlay-click', {
        originalEvent: event,
        target: this.$el
      });
    },

    onOverlayKeyDown(event) {
      switch (event.code) {
        case 'Escape':
          this.onEscapeKey(event);
          break;
      }
    },

    onArrowDownKey(event) {
      const optionIndex = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.findFirstFocusedOptionIndex();

      if (event.shiftKey) {
        this.onOptionSelectRange(event, this.startRangeIndex, optionIndex);
      }

      this.changeFocusedOptionIndex(event, optionIndex);
      !this.overlayVisible && this.show();
      event.preventDefault();
    },

    onArrowUpKey(event, pressedInInputText = false) {
      if (event.altKey && !pressedInInputText) {
        if (this.focusedOptionIndex !== -1) {
          this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
        }

        this.overlayVisible && this.hide();
        event.preventDefault();
      } else {
        const optionIndex = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.findLastFocusedOptionIndex();

        if (event.shiftKey) {
          this.onOptionSelectRange(event, optionIndex, this.startRangeIndex);
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        !this.overlayVisible && this.show();
        event.preventDefault();
      }
    },

    onArrowLeftKey(event, pressedInInputText = false) {
      pressedInInputText && (this.focusedOptionIndex = -1);
    },

    onHomeKey(event, pressedInInputText = false) {
      if (pressedInInputText) {
        event.currentTarget.setSelectionRange(0, 0);
        this.focusedOptionIndex = -1;
      } else {
        let metaKey = event.metaKey || event.ctrlKey;
        let optionIndex = this.findFirstOptionIndex();

        if (event.shiftKey && metaKey) {
          this.onOptionSelectRange(event, optionIndex, this.startRangeIndex);
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        !this.overlayVisible && this.show();
      }

      event.preventDefault();
    },

    onEndKey(event, pressedInInputText = false) {
      if (pressedInInputText) {
        const target = event.currentTarget;
        const len = target.value.length;
        target.setSelectionRange(len, len);
        this.focusedOptionIndex = -1;
      } else {
        let metaKey = event.metaKey || event.ctrlKey;
        let optionIndex = this.findLastOptionIndex();

        if (event.shiftKey && metaKey) {
          this.onOptionSelectRange(event, this.startRangeIndex, optionIndex);
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        !this.overlayVisible && this.show();
      }

      event.preventDefault();
    },

    onPageUpKey(event) {
      this.scrollInView(0);
      event.preventDefault();
    },

    onPageDownKey(event) {
      this.scrollInView(this.visibleOptions.length - 1);
      event.preventDefault();
    },

    onEnterKey(event) {
      if (!this.overlayVisible) {
        this.onArrowDownKey(event);
      } else {
        if (this.focusedOptionIndex !== -1) {
          if (event.shiftKey) this.onOptionSelectRange(event, this.focusedOptionIndex);else this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
        }
      }

      event.preventDefault();
    },

    onEscapeKey(event) {
      this.overlayVisible && this.hide(true);
      event.preventDefault();
    },

    onTabKey(event, pressedInInputText = false) {
      if (!pressedInInputText) {
        if (this.overlayVisible && this.hasFocusableElements()) {
          DomHandler.focus(this.$refs.firstHiddenFocusableElementOnOverlay);
          event.preventDefault();
        } else {
          if (this.focusedOptionIndex !== -1) {
            this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
          }

          this.overlayVisible && this.hide(this.filter);
        }
      }
    },

    onShiftKey() {
      this.startRangeIndex = this.focusedOptionIndex;
    },

    onOverlayEnter(el) {
      ZIndexUtils.set('overlay', el, this.$primevue.config.zIndex.overlay);
      this.alignOverlay();
      this.scrollInView();
      this.autoFilterFocus && DomHandler.focus(this.$refs.filterInput);
    },

    onOverlayAfterEnter() {
      this.bindOutsideClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
      this.$emit('show');
    },

    onOverlayLeave() {
      this.unbindOutsideClickListener();
      this.unbindScrollListener();
      this.unbindResizeListener();
      this.$emit('hide');
      this.overlay = null;
    },

    onOverlayAfterLeave(el) {
      ZIndexUtils.clear(el);
    },

    alignOverlay() {
      if (this.appendTo === 'self') {
        DomHandler.relativePosition(this.overlay, this.$el);
      } else {
        this.overlay.style.minWidth = DomHandler.getOuterWidth(this.$el) + 'px';
        DomHandler.absolutePosition(this.overlay, this.$el);
      }
    },

    bindOutsideClickListener() {
      if (!this.outsideClickListener) {
        this.outsideClickListener = event => {
          if (this.overlayVisible && this.isOutsideClicked(event)) {
            this.hide();
          }
        };

        document.addEventListener('click', this.outsideClickListener);
      }
    },

    unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener('click', this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },

    bindScrollListener() {
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container, () => {
          if (this.overlayVisible) {
            this.hide();
          }
        });
      }

      this.scrollHandler.bindScrollListener();
    },

    unbindScrollListener() {
      if (this.scrollHandler) {
        this.scrollHandler.unbindScrollListener();
      }
    },

    bindResizeListener() {
      if (!this.resizeListener) {
        this.resizeListener = () => {
          if (this.overlayVisible && !DomHandler.isTouchDevice()) {
            this.hide();
          }
        };

        window.addEventListener('resize', this.resizeListener);
      }
    },

    unbindResizeListener() {
      if (this.resizeListener) {
        window.removeEventListener('resize', this.resizeListener);
        this.resizeListener = null;
      }
    },

    isOutsideClicked(event) {
      return !(this.$el.isSameNode(event.target) || this.$el.contains(event.target) || this.overlay && this.overlay.contains(event.target));
    },

    getLabelByValue(value) {
      const options = this.optionGroupLabel ? this.flatOptions(this.options) : this.options || [];
      const matchedOption = options.find(option => !this.isOptionGroup(option) && ObjectUtils.equals(this.getOptionValue(option), value, this.equalityKey));
      return matchedOption ? this.getOptionLabel(matchedOption) : null;
    },

    getSelectedItemsLabel() {
      let pattern = /{(.*?)}/;

      if (pattern.test(this.selectedItemsLabel)) {
        return this.selectedItemsLabel.replace(this.selectedItemsLabel.match(pattern)[0], this.modelValue.length + '');
      }

      return this.selectedItemsLabel;
    },

    onToggleAll(event) {
      if (this.selectAll !== null) {
        this.$emit('selectall-change', {
          originalEvent: event,
          checked: !this.allSelected
        });
      } else {
        const value = this.allSelected ? [] : this.visibleOptions.filter(option => !this.isOptionDisabled(option) && !this.isOptionGroup(option)).map(option => this.getOptionValue(option));
        this.updateModel(event, value);
      }

      this.headerCheckboxFocused = true;
    },

    removeOption(event, optionValue) {
      let value = this.modelValue.filter(val => !ObjectUtils.equals(val, optionValue, this.equalityKey));
      this.updateModel(event, value);
    },

    clearFilter() {
      this.filterValue = null;
    },

    hasFocusableElements() {
      return DomHandler.getFocusableElements(this.overlay, ':not(.p-hidden-focusable)').length > 0;
    },

    isOptionMatched(option) {
      return this.isValidOption(option) && this.getOptionLabel(option).toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale));
    },

    isValidOption(option) {
      return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    },

    isValidSelectedOption(option) {
      return this.isValidOption(option) && this.isSelected(option);
    },

    isSelected(option) {
      const optionValue = this.getOptionValue(option);
      return (this.modelValue || []).some(value => ObjectUtils.equals(value, optionValue, this.equalityKey));
    },

    findFirstOptionIndex() {
      return this.visibleOptions.findIndex(option => this.isValidOption(option));
    },

    findLastOptionIndex() {
      return ObjectUtils.findLastIndex(this.visibleOptions, option => this.isValidOption(option));
    },

    findNextOptionIndex(index) {
      const matchedOptionIndex = index < this.visibleOptions.length - 1 ? this.visibleOptions.slice(index + 1).findIndex(option => this.isValidOption(option)) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
    },

    findPrevOptionIndex(index) {
      const matchedOptionIndex = index > 0 ? ObjectUtils.findLastIndex(this.visibleOptions.slice(0, index), option => this.isValidOption(option)) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    },

    findFirstSelectedOptionIndex() {
      return this.hasSelectedOption ? this.visibleOptions.findIndex(option => this.isValidSelectedOption(option)) : -1;
    },

    findLastSelectedOptionIndex() {
      return this.hasSelectedOption ? ObjectUtils.findLastIndex(this.visibleOptions, option => this.isValidSelectedOption(option)) : -1;
    },

    findNextSelectedOptionIndex(index) {
      const matchedOptionIndex = this.hasSelectedOption && index < this.visibleOptions.length - 1 ? this.visibleOptions.slice(index + 1).findIndex(option => this.isValidSelectedOption(option)) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : -1;
    },

    findPrevSelectedOptionIndex(index) {
      const matchedOptionIndex = this.hasSelectedOption && index > 0 ? ObjectUtils.findLastIndex(this.visibleOptions.slice(0, index), option => this.isValidSelectedOption(option)) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex : -1;
    },

    findNearestSelectedOptionIndex(index, firstCheckUp = false) {
      let matchedOptionIndex = -1;

      if (this.hasSelectedOption) {
        if (firstCheckUp) {
          matchedOptionIndex = this.findPrevSelectedOptionIndex(index);
          matchedOptionIndex = matchedOptionIndex === -1 ? this.findNextSelectedOptionIndex(index) : matchedOptionIndex;
        } else {
          matchedOptionIndex = this.findNextSelectedOptionIndex(index);
          matchedOptionIndex = matchedOptionIndex === -1 ? this.findPrevSelectedOptionIndex(index) : matchedOptionIndex;
        }
      }

      return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    },

    findFirstFocusedOptionIndex() {
      const selectedIndex = this.findFirstSelectedOptionIndex();
      return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    },

    findLastFocusedOptionIndex() {
      const selectedIndex = this.findLastSelectedOptionIndex();
      return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    },

    searchOptions(event) {
      this.searchValue = (this.searchValue || '') + event.key;
      let optionIndex = -1;

      if (this.focusedOptionIndex !== -1) {
        optionIndex = this.visibleOptions.slice(this.focusedOptionIndex).findIndex(option => this.isOptionMatched(option));
        optionIndex = optionIndex === -1 ? this.visibleOptions.slice(0, this.focusedOptionIndex).findIndex(option => this.isOptionMatched(option)) : optionIndex + this.focusedOptionIndex;
      } else {
        optionIndex = this.visibleOptions.findIndex(option => this.isOptionMatched(option));
      }

      if (optionIndex === -1 && this.focusedOptionIndex === -1) {
        const selectedIndex = this.findSelectedOptionIndex();
        optionIndex = selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
      }

      if (optionIndex !== -1) {
        this.changeFocusedOptionIndex(event, optionIndex);
      }

      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        this.searchValue = '';
        this.searchTimeout = null;
      }, 500);
    },

    changeFocusedOptionIndex(event, index) {
      if (this.focusedOptionIndex !== index) {
        this.focusedOptionIndex = index;
        this.scrollInView();
      }
    },

    scrollInView(index = -1) {
      const id = index !== -1 ? `${this.id}_${index}` : this.focusedOptionId;
      const element = DomHandler.findSingle(this.list, `li[id="${id}"]`);

      if (element) {
        element.scrollIntoView && element.scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        });
      } else if (!this.virtualScrollerDisabled) {
        this.virtualScroller && this.virtualScroller.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex);
      }
    },

    autoUpdateModel() {
      if (this.selectOnFocus && this.autoOptionFocus && !this.hasSelectedOption) {
        this.focusedOptionIndex = this.findFirstFocusedOptionIndex();
        const value = this.getOptionValue(this.visibleOptions[this.focusedOptionIndex]);
        this.updateModel(null, [value]);
      }
    },

    updateModel(event, value) {
      this.$emit('update:modelValue', value);
      this.$emit('change', {
        originalEvent: event,
        value
      });
    },

    flatOptions(options) {
      return (options || []).reduce((result, option, index) => {
        result.push({
          optionGroup: option,
          group: true,
          index
        });
        const optionGroupChildren = this.getOptionGroupChildren(option);
        optionGroupChildren && optionGroupChildren.forEach(o => result.push(o));
        return result;
      }, []);
    },

    overlayRef(el) {
      this.overlay = el;
    },

    listRef(el, contentRef) {
      this.list = el;
      contentRef && contentRef(el); // For VirtualScroller
    },

    virtualScrollerRef(el) {
      this.virtualScroller = el;
    }

  },
  computed: {
    containerClass() {
      return ['p-multiselect p-component p-inputwrapper', {
        'p-multiselect-chip': this.display === 'chip',
        'p-disabled': this.disabled,
        'p-focus': this.focused,
        'p-inputwrapper-filled': this.modelValue && this.modelValue.length,
        'p-inputwrapper-focus': this.focused || this.overlayVisible,
        'p-overlay-open': this.overlayVisible
      }];
    },

    labelClass() {
      return ['p-multiselect-label', {
        'p-placeholder': this.label === this.placeholder,
        'p-multiselect-label-empty': !this.placeholder && (!this.modelValue || this.modelValue.length === 0)
      }];
    },

    dropdownIconClass() {
      return ['p-multiselect-trigger-icon', this.loading ? this.loadingIcon : this.dropdownIcon];
    },

    panelStyleClass() {
      return ['p-multiselect-panel p-component', this.panelClass, {
        'p-input-filled': this.$primevue.config.inputStyle === 'filled',
        'p-ripple-disabled': this.$primevue.config.ripple === false
      }];
    },

    headerCheckboxClass() {
      return ['p-checkbox p-component', {
        'p-checkbox-checked': this.allSelected,
        'p-checkbox-focused': this.headerCheckboxFocused
      }];
    },

    visibleOptions() {
      const options = this.optionGroupLabel ? this.flatOptions(this.options) : this.options || [];

      if (this.filterValue) {
        const filteredOptions = FilterService.filter(options, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);

        if (this.optionGroupLabel) {
          const optionGroups = this.options || [];
          const filtered = [];
          optionGroups.forEach(group => {
            const filteredItems = group.items.filter(item => filteredOptions.includes(item));
            if (filteredItems.length > 0) filtered.push({ ...group,
              items: [...filteredItems]
            });
          });
          return this.flatOptions(filtered);
        }

        return filteredOptions;
      }

      return options;
    },

    label() {
      // TODO: Refactor
      let label;

      if (this.modelValue && this.modelValue.length) {
        if (ObjectUtils.isNotEmpty(this.maxSelectedLabels) && this.modelValue.length > this.maxSelectedLabels) {
          return this.getSelectedItemsLabel();
        } else {
          label = '';

          for (let i = 0; i < this.modelValue.length; i++) {
            if (i !== 0) {
              label += ', ';
            }

            label += this.getLabelByValue(this.modelValue[i]);
          }
        }
      } else {
        label = this.placeholder;
      }

      return label;
    },

    allSelected() {
      return this.selectAll !== null ? this.selectAll : ObjectUtils.isNotEmpty(this.visibleOptions) && this.visibleOptions.filter(option => !this.isOptionDisabled(option)).every(option => this.isOptionGroup(option) || this.isValidSelectedOption(option));
    },

    hasSelectedOption() {
      return ObjectUtils.isNotEmpty(this.modelValue);
    },

    equalityKey() {
      return this.optionValue ? null : this.dataKey;
    },

    searchFields() {
      return this.filterFields || [this.optionLabel];
    },

    maxSelectionLimitReached() {
      return this.selectionLimit && this.modelValue && this.modelValue.length === this.selectionLimit;
    },

    filterResultMessageText() {
      return ObjectUtils.isNotEmpty(this.visibleOptions) ? this.filterMessageText.replaceAll('{0}', this.visibleOptions.length) : this.emptyFilterMessageText;
    },

    filterMessageText() {
      return this.filterMessage || this.$primevue.config.locale.searchMessage || '';
    },

    emptyFilterMessageText() {
      return this.emptyFilterMessage || this.$primevue.config.locale.emptySearchMessage || this.$primevue.config.locale.emptyFilterMessage || '';
    },

    emptyMessageText() {
      return this.emptyMessage || this.$primevue.config.locale.emptyMessage || '';
    },

    selectionMessageText() {
      return this.selectionMessage || this.$primevue.config.locale.selectionMessage || '';
    },

    emptySelectionMessageText() {
      return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || '';
    },

    selectedMessageText() {
      return this.hasSelectedOption ? this.selectionMessageText.replaceAll('{0}', this.modelValue.length) : this.emptySelectionMessageText;
    },

    id() {
      return this.$attrs.id || UniqueComponentId();
    },

    focusedOptionId() {
      return this.focusedOptionIndex !== -1 ? `${this.id}_${this.focusedOptionIndex}` : null;
    },

    ariaSetSize() {
      return this.visibleOptions.filter(option => !this.isOptionGroup(option)).length;
    },

    toggleAllAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria[this.allSelected ? 'selectAll' : 'unselectAll'] : undefined;
    },

    closeAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : undefined;
    },

    virtualScrollerDisabled() {
      return !this.virtualScrollerOptions;
    }

  },
  directives: {
    ripple: Ripple
  },
  components: {
    VirtualScroller: script$d,
    Portal: script$e
  }
};
const _hoisted_1$3 = {
  class: "p-hidden-accessible"
};
const _hoisted_2$2 = ["id", "disabled", "placeholder", "tabindex", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant"];
const _hoisted_3$2 = {
  class: "p-multiselect-label-container"
};
const _hoisted_4$2 = {
  class: "p-multiselect-token-label"
};
const _hoisted_5$1 = ["onClick"];
const _hoisted_6$1 = {
  class: "p-multiselect-trigger"
};
const _hoisted_7 = {
  key: 0,
  class: "p-multiselect-header"
};
const _hoisted_8 = {
  class: "p-hidden-accessible"
};
const _hoisted_9 = ["checked", "aria-label"];
const _hoisted_10 = {
  key: 1,
  class: "p-multiselect-filter-container"
};
const _hoisted_11 = ["value", "placeholder", "aria-owns", "aria-activedescendant"];
const _hoisted_12 = {
  key: 2,
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};
const _hoisted_13 = ["aria-label"];
const _hoisted_14 = ["id"];
const _hoisted_15 = ["id"];
const _hoisted_16 = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onClick", "onMousemove"];
const _hoisted_17 = {
  class: "p-checkbox p-component"
};
const _hoisted_18 = {
  key: 0,
  class: "p-multiselect-empty-message",
  role: "option"
};
const _hoisted_19 = {
  key: 1,
  class: "p-multiselect-empty-message",
  role: "option"
};
const _hoisted_20 = {
  key: 0,
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};
const _hoisted_21 = {
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VirtualScroller = resolveComponent("VirtualScroller");

  const _component_Portal = resolveComponent("Portal");

  const _directive_ripple = resolveDirective("ripple");

  return openBlock(), createElementBlock("div", {
    ref: "container",
    class: normalizeClass($options.containerClass),
    onClick: _cache[15] || (_cache[15] = (...args) => $options.onContainerClick && $options.onContainerClick(...args))
  }, [createElementVNode("div", _hoisted_1$3, [createElementVNode("input", mergeProps({
    ref: "focusInput",
    id: $props.inputId,
    type: "text",
    readonly: "",
    disabled: $props.disabled,
    placeholder: $props.placeholder,
    tabindex: !$props.disabled ? $props.tabindex : -1,
    role: "combobox",
    "aria-label": _ctx.ariaLabel,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": $data.overlayVisible,
    "aria-controls": $options.id + '_list',
    "aria-activedescendant": $data.focused ? $options.focusedOptionId : undefined,
    onFocus: _cache[0] || (_cache[0] = (...args) => $options.onFocus && $options.onFocus(...args)),
    onBlur: _cache[1] || (_cache[1] = (...args) => $options.onBlur && $options.onBlur(...args)),
    onKeydown: _cache[2] || (_cache[2] = (...args) => $options.onKeyDown && $options.onKeyDown(...args))
  }, $props.inputProps), null, 16, _hoisted_2$2)]), createElementVNode("div", _hoisted_3$2, [createElementVNode("div", {
    class: normalizeClass($options.labelClass)
  }, [renderSlot(_ctx.$slots, "value", {
    value: $props.modelValue,
    placeholder: $props.placeholder
  }, () => [$props.display === 'comma' ? (openBlock(), createElementBlock(Fragment, {
    key: 0
  }, [createTextVNode(toDisplayString($options.label || 'empty'), 1)], 64)) : $props.display === 'chip' ? (openBlock(), createElementBlock(Fragment, {
    key: 1
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($props.modelValue, item => {
    return openBlock(), createElementBlock("div", {
      key: $options.getLabelByValue(item),
      class: "p-multiselect-token"
    }, [renderSlot(_ctx.$slots, "chip", {
      value: item
    }, () => [createElementVNode("span", _hoisted_4$2, toDisplayString($options.getLabelByValue(item)), 1)]), !$props.disabled ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass(['p-multiselect-token-icon', $props.removeTokenIcon]),
      onClick: $event => $options.removeOption($event, item)
    }, null, 10, _hoisted_5$1)) : createCommentVNode("", true)]);
  }), 128)), !$props.modelValue || $props.modelValue.length === 0 ? (openBlock(), createElementBlock(Fragment, {
    key: 0
  }, [createTextVNode(toDisplayString($props.placeholder || 'empty'), 1)], 64)) : createCommentVNode("", true)], 64)) : createCommentVNode("", true)])], 2)]), createElementVNode("div", _hoisted_6$1, [renderSlot(_ctx.$slots, "indicator", {}, () => [createElementVNode("span", {
    class: normalizeClass($options.dropdownIconClass),
    "aria-hidden": "true"
  }, null, 2)])]), createVNode(_component_Portal, {
    appendTo: $props.appendTo
  }, {
    default: withCtx(() => [createVNode(Transition, {
      name: "p-connected-overlay",
      onEnter: $options.onOverlayEnter,
      onAfterEnter: $options.onOverlayAfterEnter,
      onLeave: $options.onOverlayLeave,
      onAfterLeave: $options.onOverlayAfterLeave
    }, {
      default: withCtx(() => [$data.overlayVisible ? (openBlock(), createElementBlock("div", mergeProps({
        key: 0,
        ref: $options.overlayRef,
        style: $props.panelStyle,
        class: $options.panelStyleClass,
        onClick: _cache[13] || (_cache[13] = (...args) => $options.onOverlayClick && $options.onOverlayClick(...args)),
        onKeydown: _cache[14] || (_cache[14] = (...args) => $options.onOverlayKeyDown && $options.onOverlayKeyDown(...args))
      }, $props.panelProps), [createElementVNode("span", {
        ref: "firstHiddenFocusableElementOnOverlay",
        role: "presentation",
        "aria-hidden": "true",
        class: "p-hidden-accessible p-hidden-focusable",
        tabindex: 0,
        onFocus: _cache[3] || (_cache[3] = (...args) => $options.onFirstHiddenFocus && $options.onFirstHiddenFocus(...args))
      }, null, 544), renderSlot(_ctx.$slots, "header", {
        value: $props.modelValue,
        options: $options.visibleOptions
      }), $props.showToggleAll && $props.selectionLimit == null || $props.filter ? (openBlock(), createElementBlock("div", _hoisted_7, [$props.showToggleAll && $props.selectionLimit == null ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass($options.headerCheckboxClass),
        onClick: _cache[6] || (_cache[6] = (...args) => $options.onToggleAll && $options.onToggleAll(...args))
      }, [createElementVNode("div", _hoisted_8, [createElementVNode("input", {
        type: "checkbox",
        readonly: "",
        checked: $options.allSelected,
        "aria-label": $options.toggleAllAriaLabel,
        onFocus: _cache[4] || (_cache[4] = (...args) => $options.onHeaderCheckboxFocus && $options.onHeaderCheckboxFocus(...args)),
        onBlur: _cache[5] || (_cache[5] = (...args) => $options.onHeaderCheckboxBlur && $options.onHeaderCheckboxBlur(...args))
      }, null, 40, _hoisted_9)]), createElementVNode("div", {
        class: normalizeClass(['p-checkbox-box', {
          'p-highlight': $options.allSelected,
          'p-focus': $data.headerCheckboxFocused
        }])
      }, [createElementVNode("span", {
        class: normalizeClass(['p-checkbox-icon', {
          [$props.checkboxIcon]: $options.allSelected
        }])
      }, null, 2)], 2)], 2)) : createCommentVNode("", true), $props.filter ? (openBlock(), createElementBlock("div", _hoisted_10, [createElementVNode("input", mergeProps({
        ref: "filterInput",
        type: "text",
        value: $data.filterValue,
        onVnodeUpdated: _cache[7] || (_cache[7] = (...args) => $options.onFilterUpdated && $options.onFilterUpdated(...args)),
        class: "p-multiselect-filter p-inputtext p-component",
        placeholder: $props.filterPlaceholder,
        role: "searchbox",
        autocomplete: "off",
        "aria-owns": $options.id + '_list',
        "aria-activedescendant": $options.focusedOptionId,
        onKeydown: _cache[8] || (_cache[8] = (...args) => $options.onFilterKeyDown && $options.onFilterKeyDown(...args)),
        onBlur: _cache[9] || (_cache[9] = (...args) => $options.onFilterBlur && $options.onFilterBlur(...args)),
        onInput: _cache[10] || (_cache[10] = (...args) => $options.onFilterChange && $options.onFilterChange(...args))
      }, $props.filterInputProps), null, 16, _hoisted_11), createElementVNode("span", {
        class: normalizeClass(['p-multiselect-filter-icon', $props.filterIcon])
      }, null, 2)])) : createCommentVNode("", true), $props.filter ? (openBlock(), createElementBlock("span", _hoisted_12, toDisplayString($options.filterResultMessageText), 1)) : createCommentVNode("", true), withDirectives((openBlock(), createElementBlock("button", mergeProps({
        class: "p-multiselect-close p-link",
        "aria-label": $options.closeAriaLabel,
        onClick: _cache[11] || (_cache[11] = (...args) => $options.onCloseClick && $options.onCloseClick(...args)),
        type: "button"
      }, $props.closeButtonProps), [createElementVNode("span", {
        class: normalizeClass(['p-multiselect-close-icon', $props.closeIcon])
      }, null, 2)], 16, _hoisted_13)), [[_directive_ripple]])])) : createCommentVNode("", true), createElementVNode("div", {
        class: "p-multiselect-items-wrapper",
        style: normalizeStyle({
          'max-height': $options.virtualScrollerDisabled ? $props.scrollHeight : ''
        })
      }, [createVNode(_component_VirtualScroller, mergeProps({
        ref: $options.virtualScrollerRef
      }, $props.virtualScrollerOptions, {
        items: $options.visibleOptions,
        style: {
          height: $props.scrollHeight
        },
        tabindex: -1,
        disabled: $options.virtualScrollerDisabled
      }), createSlots({
        content: withCtx(({
          styleClass,
          contentRef,
          items,
          getItemOptions,
          contentStyle,
          itemSize
        }) => [createElementVNode("ul", {
          ref: el => $options.listRef(el, contentRef),
          id: $options.id + '_list',
          class: normalizeClass(['p-multiselect-items p-component', styleClass]),
          style: normalizeStyle(contentStyle),
          role: "listbox",
          "aria-multiselectable": "true"
        }, [(openBlock(true), createElementBlock(Fragment, null, renderList(items, (option, i) => {
          return openBlock(), createElementBlock(Fragment, {
            key: $options.getOptionRenderKey(option, $options.getOptionIndex(i, getItemOptions))
          }, [$options.isOptionGroup(option) ? (openBlock(), createElementBlock("li", {
            key: 0,
            id: $options.id + '_' + $options.getOptionIndex(i, getItemOptions),
            style: normalizeStyle({
              height: itemSize ? itemSize + 'px' : undefined
            }),
            class: "p-multiselect-item-group",
            role: "option"
          }, [renderSlot(_ctx.$slots, "optiongroup", {
            option: option.optionGroup,
            index: $options.getOptionIndex(i, getItemOptions)
          }, () => [createTextVNode(toDisplayString($options.getOptionGroupLabel(option.optionGroup)), 1)])], 12, _hoisted_15)) : withDirectives((openBlock(), createElementBlock("li", {
            key: 1,
            id: $options.id + '_' + $options.getOptionIndex(i, getItemOptions),
            style: normalizeStyle({
              height: itemSize ? itemSize + 'px' : undefined
            }),
            class: normalizeClass(['p-multiselect-item', {
              'p-highlight': $options.isSelected(option),
              'p-focus': $data.focusedOptionIndex === $options.getOptionIndex(i, getItemOptions),
              'p-disabled': $options.isOptionDisabled(option)
            }]),
            role: "option",
            "aria-label": $options.getOptionLabel(option),
            "aria-selected": $options.isSelected(option),
            "aria-disabled": $options.isOptionDisabled(option),
            "aria-setsize": $options.ariaSetSize,
            "aria-posinset": $options.getAriaPosInset($options.getOptionIndex(i, getItemOptions)),
            onClick: $event => $options.onOptionSelect($event, option, $options.getOptionIndex(i, getItemOptions), true),
            onMousemove: $event => $options.onOptionMouseMove($event, $options.getOptionIndex(i, getItemOptions))
          }, [createElementVNode("div", _hoisted_17, [createElementVNode("div", {
            class: normalizeClass(['p-checkbox-box', {
              'p-highlight': $options.isSelected(option)
            }])
          }, [createElementVNode("span", {
            class: normalizeClass(['p-checkbox-icon', {
              [$props.checkboxIcon]: $options.isSelected(option)
            }])
          }, null, 2)], 2)]), renderSlot(_ctx.$slots, "option", {
            option: option,
            index: $options.getOptionIndex(i, getItemOptions)
          }, () => [createElementVNode("span", null, toDisplayString($options.getOptionLabel(option)), 1)])], 46, _hoisted_16)), [[_directive_ripple]])], 64);
        }), 128)), $data.filterValue && (!items || items && items.length === 0) ? (openBlock(), createElementBlock("li", _hoisted_18, [renderSlot(_ctx.$slots, "emptyfilter", {}, () => [createTextVNode(toDisplayString($options.emptyFilterMessageText), 1)])])) : !$props.options || $props.options && $props.options.length === 0 ? (openBlock(), createElementBlock("li", _hoisted_19, [renderSlot(_ctx.$slots, "empty", {}, () => [createTextVNode(toDisplayString($options.emptyMessageText), 1)])])) : createCommentVNode("", true)], 14, _hoisted_14), !$props.options || $props.options && $props.options.length === 0 ? (openBlock(), createElementBlock("span", _hoisted_20, toDisplayString($options.emptyMessageText), 1)) : createCommentVNode("", true), createElementVNode("span", _hoisted_21, toDisplayString($options.selectedMessageText), 1)]),
        _: 2
      }, [_ctx.$slots.loader ? {
        name: "loader",
        fn: withCtx(({
          options
        }) => [renderSlot(_ctx.$slots, "loader", {
          options: options
        })]),
        key: "0"
      } : undefined]), 1040, ["items", "style", "disabled"])], 4), renderSlot(_ctx.$slots, "footer", {
        value: $props.modelValue,
        options: $options.visibleOptions
      }), createElementVNode("span", {
        ref: "lastHiddenFocusableElementOnOverlay",
        role: "presentation",
        "aria-hidden": "true",
        class: "p-hidden-accessible p-hidden-focusable",
        tabindex: 0,
        onFocus: _cache[12] || (_cache[12] = (...args) => $options.onLastHiddenFocus && $options.onLastHiddenFocus(...args))
      }, null, 544)], 16)) : createCommentVNode("", true)]),
      _: 3
    }, 8, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])]),
    _: 3
  }, 8, ["appendTo"])], 2);
}

function styleInject$1(css, ref) {
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

var css_248z$2 = "\n.p-multiselect {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    cursor: pointer;\n    position: relative;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n}\n.p-multiselect-trigger {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n}\n.p-multiselect-label-container {\n    overflow: hidden;\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n    cursor: pointer;\n}\n.p-multiselect-label {\n    display: block;\n    white-space: nowrap;\n    cursor: pointer;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n.p-multiselect-label-empty {\n    overflow: hidden;\n    visibility: hidden;\n}\n.p-multiselect-token {\n    cursor: default;\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n}\n.p-multiselect-token-icon {\n    cursor: pointer;\n}\n.p-multiselect .p-multiselect-panel {\n    min-width: 100%;\n}\n.p-multiselect-panel {\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.p-multiselect-items-wrapper {\n    overflow: auto;\n}\n.p-multiselect-items {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n.p-multiselect-item {\n    cursor: pointer;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    font-weight: normal;\n    white-space: nowrap;\n    position: relative;\n    overflow: hidden;\n}\n.p-multiselect-item-group {\n    cursor: auto;\n}\n.p-multiselect-header {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n}\n.p-multiselect-filter-container {\n    position: relative;\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n}\n.p-multiselect-filter-icon {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5rem;\n}\n.p-multiselect-filter-container .p-inputtext {\n    width: 100%;\n}\n.p-multiselect-close {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n    overflow: hidden;\n    position: relative;\n    margin-left: auto;\n}\n.p-fluid .p-multiselect {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n";
styleInject$1(css_248z$2);
script$7.render = render$1;

var script$6 = {
  name: 'Chips',
  emits: ['update:modelValue', 'add', 'remove', 'focus', 'blur'],
  props: {
    modelValue: {
      type: Array,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    separator: {
      type: [String, Object],
      default: null
    },
    addOnBlur: {
      type: Boolean,
      default: null
    },
    allowDuplicate: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: String,
      default: null
    },
    inputStyle: {
      type: null,
      default: null
    },
    inputProps: {
      type: null,
      default: null
    },
    removeTokenIcon: {
      type: String,
      default: 'pi pi-times-circle'
    },
    'aria-labelledby': {
      type: String,
      default: null
    },
    'aria-label': {
      type: String,
      default: null
    }
  },

  data() {
    return {
      id: UniqueComponentId(),
      inputValue: null,
      focused: false,
      focusedIndex: null
    };
  },

  methods: {
    onWrapperClick() {
      this.$refs.input.focus();
    },

    onInput(event) {
      this.inputValue = event.target.value;
      this.focusedIndex = null;
    },

    onFocus(event) {
      this.focused = true;
      this.focusedIndex = null;
      this.$emit('focus', event);
    },

    onBlur(event) {
      this.focused = false;
      this.focusedIndex = null;

      if (this.addOnBlur) {
        this.addItem(event, event.target.value, false);
      }

      this.$emit('blur', event);
    },

    onKeyDown(event) {
      const inputValue = event.target.value;

      switch (event.code) {
        case 'Backspace':
          if (inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
            if (this.focusedIndex !== null) {
              this.removeItem(event, this.focusedIndex);
            } else this.removeItem(event, this.modelValue.length - 1);
          }

          break;

        case 'Enter':
          if (inputValue && inputValue.trim().length && !this.maxedOut) {
            this.addItem(event, inputValue, true);
          }

          break;

        case 'ArrowLeft':
          if (inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
            this.$refs.container.focus();
          }

          break;

        case 'ArrowRight':
          event.stopPropagation();
          break;

        default:
          if (this.separator) {
            if (this.separator === event.key || event.key.match(this.separator)) {
              this.addItem(event, inputValue, true);
            }
          }

          break;
      }
    },

    onPaste(event) {
      if (this.separator) {
        let pastedData = (event.clipboardData || window['clipboardData']).getData('Text');

        if (pastedData) {
          let value = this.modelValue || [];
          let pastedValues = pastedData.split(this.separator);
          pastedValues = pastedValues.filter(val => this.allowDuplicate || value.indexOf(val) === -1);
          value = [...value, ...pastedValues];
          this.updateModel(event, value, true);
        }
      }
    },

    onContainerFocus() {
      this.focused = true;
    },

    onContainerBlur() {
      this.focusedIndex = -1;
      this.focused = false;
    },

    onContainerKeyDown(event) {
      switch (event.code) {
        case 'ArrowLeft':
          this.onArrowLeftKeyOn(event);
          break;

        case 'ArrowRight':
          this.onArrowRightKeyOn(event);
          break;

        case 'Backspace':
          this.onBackspaceKeyOn(event);
          break;
      }
    },

    onArrowLeftKeyOn() {
      if (this.inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
        this.focusedIndex = this.focusedIndex === null ? this.modelValue.length - 1 : this.focusedIndex - 1;
        if (this.focusedIndex < 0) this.focusedIndex = 0;
      }
    },

    onArrowRightKeyOn() {
      if (this.inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
        if (this.focusedIndex === this.modelValue.length - 1) {
          this.focusedIndex = null;
          this.$refs.input.focus();
        } else {
          this.focusedIndex++;
        }
      }
    },

    onBackspaceKeyOn(event) {
      if (this.focusedIndex !== null) {
        this.removeItem(event, this.focusedIndex);
      }
    },

    updateModel(event, value, preventDefault) {
      this.$emit('update:modelValue', value);
      this.$emit('add', {
        originalEvent: event,
        value: value
      });
      this.$refs.input.value = '';
      this.inputValue = '';
      setTimeout(() => {
        this.maxedOut && (this.focused = false);
      }, 0);

      if (preventDefault) {
        event.preventDefault();
      }
    },

    addItem(event, item, preventDefault) {
      if (item && item.trim().length) {
        let value = this.modelValue ? [...this.modelValue] : [];

        if (this.allowDuplicate || value.indexOf(item) === -1) {
          value.push(item);
          this.updateModel(event, value, preventDefault);
        }
      }
    },

    removeItem(event, index) {
      if (this.disabled) {
        return;
      }

      let values = [...this.modelValue];
      const removedItem = values.splice(index, 1);
      this.focusedIndex = null;
      this.$refs.input.focus();
      this.$emit('update:modelValue', values);
      this.$emit('remove', {
        originalEvent: event,
        value: removedItem
      });
    }

  },
  computed: {
    maxedOut() {
      return this.max && this.modelValue && this.max === this.modelValue.length;
    },

    containerClass() {
      return ['p-chips p-component p-inputwrapper', {
        'p-disabled': this.disabled,
        'p-focus': this.focused,
        'p-inputwrapper-filled': this.modelValue && this.modelValue.length || this.inputValue && this.inputValue.length,
        'p-inputwrapper-focus': this.focused
      }];
    },

    focusedOptionId() {
      return this.focusedIndex !== null ? `${this.id}_chips_item_${this.focusedIndex}` : null;
    }

  }
};
const _hoisted_1$2 = ["aria-labelledby", "aria-label", "aria-activedescendant"];
const _hoisted_2$1 = ["id", "aria-label", "aria-setsize", "aria-posinset"];
const _hoisted_3$1 = {
  class: "p-chips-token-label"
};
const _hoisted_4$1 = ["onClick"];
const _hoisted_5 = {
  class: "p-chips-input-token",
  role: "option"
};
const _hoisted_6 = ["id", "disabled", "placeholder"];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.containerClass)
  }, [createElementVNode("ul", {
    ref: "container",
    class: "p-inputtext p-chips-multiple-container",
    tabindex: "-1",
    role: "listbox",
    "aria-orientation": "horizontal",
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-label": _ctx.ariaLabel,
    "aria-activedescendant": $data.focused ? $options.focusedOptionId : undefined,
    onClick: _cache[5] || (_cache[5] = $event => $options.onWrapperClick()),
    onFocus: _cache[6] || (_cache[6] = (...args) => $options.onContainerFocus && $options.onContainerFocus(...args)),
    onBlur: _cache[7] || (_cache[7] = (...args) => $options.onContainerBlur && $options.onContainerBlur(...args)),
    onKeydown: _cache[8] || (_cache[8] = (...args) => $options.onContainerKeyDown && $options.onContainerKeyDown(...args))
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($props.modelValue, (val, i) => {
    return openBlock(), createElementBlock("li", {
      key: `${i}_${val}`,
      id: $data.id + '_chips_item_' + i,
      role: "option",
      class: normalizeClass(['p-chips-token', {
        'p-focus': $data.focusedIndex === i
      }]),
      "aria-label": val,
      "aria-selected": true,
      "aria-setsize": $props.modelValue.length,
      "aria-posinset": i + 1
    }, [renderSlot(_ctx.$slots, "chip", {
      value: val
    }, () => [createElementVNode("span", _hoisted_3$1, toDisplayString(val), 1)]), createElementVNode("span", {
      class: normalizeClass(['p-chips-token-icon', $props.removeTokenIcon]),
      onClick: $event => $options.removeItem($event, i),
      "aria-hidden": "true"
    }, null, 10, _hoisted_4$1)], 10, _hoisted_2$1);
  }), 128)), createElementVNode("li", _hoisted_5, [createElementVNode("input", mergeProps({
    ref: "input",
    id: $props.inputId,
    type: "text",
    class: $props.inputClass,
    style: $props.inputStyle,
    disabled: $props.disabled || $options.maxedOut,
    placeholder: $props.placeholder,
    onFocus: _cache[0] || (_cache[0] = $event => $options.onFocus($event)),
    onBlur: _cache[1] || (_cache[1] = $event => $options.onBlur($event)),
    onInput: _cache[2] || (_cache[2] = (...args) => $options.onInput && $options.onInput(...args)),
    onKeydown: _cache[3] || (_cache[3] = $event => $options.onKeyDown($event)),
    onPaste: _cache[4] || (_cache[4] = $event => $options.onPaste($event))
  }, $props.inputProps), null, 16, _hoisted_6)])], 40, _hoisted_1$2)], 2);
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

var css_248z$1 = "\n.p-chips {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n}\n.p-chips-multiple-container {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n    cursor: text;\n    overflow: hidden;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n}\n.p-chips-token {\n    cursor: default;\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n}\n.p-chips-input-token {\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n}\n.p-chips-token-icon {\n    cursor: pointer;\n}\n.p-chips-input-token input {\n    border: 0 none;\n    outline: 0 none;\n    background-color: transparent;\n    margin: 0;\n    padding: 0;\n    -webkit-box-shadow: none;\n            box-shadow: none;\n    border-radius: 0;\n    width: 100%;\n}\n.p-fluid .p-chips {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n";
styleInject(css_248z$1);
script$6.render = render;

var script$5 = {
  props: {
    modelValue : [Array],
    field : Object
},
  emits: [
    "update:modelValue"
],
  setup(__props, { emit: emits }) {

const props = __props;






const value = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        if (val.length == 0) val =null;
        emits('update:modelValue', val);
    }
});

const model = inject("model");
const store = getStoreById(model);
const id = (store.active_id) ? store.active_id : store.parent_id;


const options = ref([]);

if (props.field.reference || props.field.recursive) {
    onMounted(() => {
        props.field.getOptions(model, id)
        .then(response => options.value =response);
    });
} else if (props.field.name == '--id') {
    let vals = [];
    for(let row of store.data) {
        vals.push({'key' : row['--id'], value : getLabel(active_store.store.route.schema, row) });
    }
    options.value = vals;
}



return (_ctx, _cache) => {
  return (__props.field.reference || __props.field.name =='--id')
    ? (openBlock(), createBlock(unref(script$7), {
        key: 0,
        placeholder: "Please Select",
        field: __props.field,
        options: options.value,
        optionLabel: "value",
        optionValue: "key",
        modelValue: unref(value),
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(value) ? (value).value = $event : null))
      }, null, 8 /* PROPS */, ["field", "options", "modelValue"]))
    : (openBlock(), createBlock(unref(script$6), {
        key: 1,
        modelValue: unref(value),
        "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (isRef(value) ? (value).value = $event : null))
      }, null, 8 /* PROPS */, ["modelValue"]))
}
}

};

script$5.__file = "presstojam/src/components/filter/id-filter.vue";

var script$4 = {
  props: {
    modelValue : [Object],
    field : Object
},
  emits: [
    "update:modelValue"
],
  setup(__props, { emit: emits }) {

const props = __props;





const value = computed({
    get() {
        if (props.modelValue) {
            const arr = [];
            if (props.modelValue.min) arr.push(props.field.buildDate(props.modelValue.min));
            if (props.modelValue.max) arr.push(props.field.buildDate(props.modelValue.max));
            return arr;
        } else {
            return props.modelValue;
        }
    },
    set(val) {
        let obj = null;
        if (val) {
            obj = {};
            if (val[0]) obj.min = props.field.buildString(val[0]);
            if (val[1]) obj.max = props.field.buildString(val[1]);
        }
        emits('update:modelValue', obj);
    }
});




return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$f), {
    id: "range",
    modelValue: unref(value),
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(value) ? (value).value = $event : null)),
    selectionMode: "range",
    showButtonBar: true,
    manualInput: false
  }, null, 8 /* PROPS */, ["modelValue"]))
}
}

};

script$4.__file = "presstojam/src/components/filter/time-filter.vue";

var script$3 = {
  props: {
    modelValue : [Array],
    field : Object
},
  emits: [
    "update:modelValue"
],
  setup(__props, { emit: emits }) {

const props = __props;




const options = ref([]);



const value = computed({
    get() {
        let arr = [];
        if (tag == 'select') {
            arr = props.modelValue;
        } else if (props.modelValue) {
            for(let val of props.modelValue) {
                arr.push(val.replace(/^%+/, '').replace(/%+$/, ''));
            }
        }
        return arr;
    },
    set(val) {
        let arr = [];
        for(let vl of val) {
            arr.push("%" + vl + "%");
        }
        if (arr.length == 0) arr = null;
        emits('update:modelValue', arr);
    }
});

const tag = computed(() => {
if (props.field.isEnum()) {
    options.value = props.field.setContainsAsOptions();
    return "select";
} else if (props.field.encrypted) {
    return "";
} else {
    return "input";
}
});



return (_ctx, _cache) => {
  return (unref(tag)=='select')
    ? (openBlock(), createBlock(unref(script$7), {
        key: 0,
        display: "chip",
        placeholder: "Please Select",
        modelValue: unref(value),
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(value) ? (value).value = $event : null)),
        options: options.value,
        optionLabel: "key",
        optionValue: "value"
      }, null, 8 /* PROPS */, ["modelValue", "options"]))
    : (unref(tag)=='input')
      ? (openBlock(), createBlock(unref(script$6), {
          key: 1,
          modelValue: unref(value),
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (isRef(value) ? (value).value = $event : null))
        }, null, 8 /* PROPS */, ["modelValue"]))
      : createCommentVNode("v-if", true)
}
}

};

script$3.__file = "presstojam/src/components/filter/string-filter.vue";

var script$2 = {
  props: {
    field : Object,
    modelValue : [String, Number, Boolean, null, Array, Object]
},
  emits: [
    "update:modelValue"
],
  setup(__props, { emit: emits }) {

const props = __props;

 



const value = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});

return (_ctx, _cache) => {
  return (__props.field.type=='number')
    ? (openBlock(), createBlock(script$9, {
        key: 0,
        modelValue: unref(value),
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(value) ? (value).value = $event : null)),
        field: __props.field
      }, null, 8 /* PROPS */, ["modelValue", "field"]))
    : (__props.field.type=='flag')
      ? (openBlock(), createBlock(script$8, {
          key: 1,
          modelValue: unref(value),
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (isRef(value) ? (value).value = $event : null)),
          field: __props.field
        }, null, 8 /* PROPS */, ["modelValue", "field"]))
      : (__props.field.type=='id')
        ? (openBlock(), createBlock(script$5, {
            key: 2,
            modelValue: unref(value),
            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => (isRef(value) ? (value).value = $event : null)),
            field: __props.field
          }, null, 8 /* PROPS */, ["modelValue", "field"]))
        : (__props.field.type=='time')
          ? (openBlock(), createBlock(script$4, {
              key: 3,
              modelValue: unref(value),
              "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => (isRef(value) ? (value).value = $event : null)),
              field: __props.field
            }, null, 8 /* PROPS */, ["modelValue", "field"]))
          : (__props.field.type=='string')
            ? (openBlock(), createBlock(script$3, {
                key: 4,
                modelValue: unref(value),
                "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => (isRef(value) ? (value).value = $event : null)),
                field: __props.field
              }, null, 8 /* PROPS */, ["modelValue", "field"]))
            : createCommentVNode("v-if", true)
}
}

};

script$2.__file = "presstojam/src/components/filter/filter-field.vue";

const _hoisted_1$1 = { class: "ptj-filter" };
   
   
var script$1 = {
  props: {
    field : {
        type : Object,
        required : true
    }
   },
  setup(__props) {

const props = __props;

   
   

   let overlay = new ref();

   const model = inject("model");
   const store = getStoreById(model);

   const errors = reactive({});

   const val = computed({
        get() {
            return store.filters[props.field.name];
        },
        set(val) {
            let result = 0;
            if(Array.isArray(val)) {
                for(let vl of val) {
                    const res = props.field.validate(vl);
                    if (res) {
                        result = res;
                        break;
                    }
                }
            } else {
                result = props.field.validate(val);
            }
        
            if (result) {
                errors[props.field.name] = result;
            }
            store.filters[props.field.name] = val;
        }
    });


   function toggle(e) {
        overlay.value.toggle(e);
   }

   const badge = computed(() => {
        if (store.filters[props.field.name]) {
            if (Array.isArray(store.filters[props.field.name])) return store.filters[props.field.name].length.toString();
            else return "1";
        } else {
            return "";
        }
   });

   

return (_ctx, _cache) => {
  return (openBlock(), createElementBlock("div", _hoisted_1$1, [
    createVNode(unref(script$b), {
      type: "button",
      label: _ctx.$t('models.' + __props.field.model + '.fields.' + __props.field.name + '.filterlabel'),
      onClick: toggle,
      "aria-haspopup": "true",
      "aria-controls": "overlay",
      badge: unref(badge),
      class: "p-button-secondary"
    }, null, 8 /* PROPS */, ["label", "badge"]),
    createVNode(unref(script$g), {
      ref_key: "overlay",
      ref: overlay,
      appendTo: "body",
      showCloseIcon: true,
      id: 'overlay_' + __props.field.name,
      style: {"width":"450px"},
      breakpoints: {'960px': '75vw'}
    }, {
      default: withCtx(() => [
        createElementVNode("div", null, [
          createVNode(script$2, {
            field: __props.field,
            modelValue: unref(val),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(val) ? (val).value = $event : null))
          }, null, 8 /* PROPS */, ["field", "modelValue"])
        ])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["id"])
  ]))
}
}

};

script$1.__file = "presstojam/src/components/filter/filter.vue";

const _hoisted_1 = /*#__PURE__*/createElementVNode("i", { class: "pi pi-filter" }, null, -1 /* HOISTED */);
const _hoisted_2 = /*#__PURE__*/createTextVNode(" Filters ");
const _hoisted_3 = { class: "p-buttonset" };
const _hoisted_4 = { style: {"text-align":"right"} };


var script = {
  props: {
    store : Object
},
  setup(__props) {

const props = __props;




provide("model", props.store.model);

const filtercells = computed(() => {
    let filter_cells = {};
    for(let i in props.store.route.schema) {
        if (props.store.route.schema[i].background) continue;
        if (props.store.route.schema[i].type == "asset" || props.store.route.schema[i].type == "json") continue;
        filter_cells[i] = props.store.route.schema[i];
    }
    return filter_cells;
});


function submit() {
    props.store.reload();
}

return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$h), {
    toggleable: true,
    collapsed: true
  }, {
    legend: withCtx(() => [
      _hoisted_1,
      _hoisted_2
    ]),
    default: withCtx(() => [
      createElementVNode("span", _hoisted_3, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(filtercells), (field) => {
          return (openBlock(), createBlock(script$1, {
            class: "ptj-filter",
            field: field,
            key: field.name
          }, null, 8 /* PROPS */, ["field"]))
        }), 128 /* KEYED_FRAGMENT */))
      ]),
      createElementVNode("p", _hoisted_4, [
        createVNode(unref(script$b), {
          label: _ctx.$t('btns.filter'),
          onClick: submit
        }, null, 8 /* PROPS */, ["label"])
      ])
    ]),
    _: 1 /* STABLE */
  }))
}
}

};

var css_248z = "\n.filter-form-vue-vue-type-style-index-0-id-46638ba7-lang_ptj-filter__24-2N { \r\n    display : inline-block;\n}\r\n";
styleInject$2(css_248z);

script.__file = "presstojam/src/components/filter/filter-form.vue";

export { script$7 as a, script$2 as b, script$1 as c, script as s };
