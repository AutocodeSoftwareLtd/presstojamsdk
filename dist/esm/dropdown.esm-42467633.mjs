import { a as script$3, s as script$4 } from './inputtext.esm-98b20197.mjs';
import { O as ObjectUtils, D as DomHandler, Z as ZIndexUtils, C as ConnectedOverlayScrollHandler, U as UniqueComponentId } from './utils.esm-d009df4f.mjs';
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createVNode, mergeProps, toHandlers, createCommentVNode, createBlock, normalizeStyle, renderSlot, createElementVNode, Fragment, renderList, resolveDirective, createTextVNode, toDisplayString, withCtx, Transition, createSlots, withDirectives } from 'vue';
import { O as OverlayEventBus, s as script$5 } from './portal.esm-7deedf95.mjs';
import { R as Ripple } from './ripple.esm-9120ee72.mjs';

const FilterMatchMode = {
  STARTS_WITH: 'startsWith',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'notContains',
  ENDS_WITH: 'endsWith',
  EQUALS: 'equals',
  NOT_EQUALS: 'notEquals',
  IN: 'in',
  LESS_THAN: 'lt',
  LESS_THAN_OR_EQUAL_TO: 'lte',
  GREATER_THAN: 'gt',
  GREATER_THAN_OR_EQUAL_TO: 'gte',
  BETWEEN: 'between',
  DATE_IS: 'dateIs',
  DATE_IS_NOT: 'dateIsNot',
  DATE_BEFORE: 'dateBefore',
  DATE_AFTER: 'dateAfter'
};
const FilterOperator = {
  AND: 'and',
  OR: 'or'
};
const FilterService = {
  filter(value, fields, filterValue, filterMatchMode, filterLocale) {
    let filteredItems = [];

    if (value) {
      for (let item of value) {
        for (let field of fields) {
          let fieldValue = ObjectUtils.resolveFieldData(item, field);

          if (this.filters[filterMatchMode](fieldValue, filterValue, filterLocale)) {
            filteredItems.push(item);
            break;
          }
        }
      }
    }

    return filteredItems;
  },

  filters: {
    startsWith(value, filter, filterLocale) {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.slice(0, filterValue.length) === filterValue;
    },

    contains(value, filter, filterLocale) {
      if (filter === undefined || filter === null || typeof filter === 'string' && filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) !== -1;
    },

    notContains(value, filter, filterLocale) {
      if (filter === undefined || filter === null || typeof filter === 'string' && filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) === -1;
    },

    endsWith(value, filter, filterLocale) {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      let filterValue = ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue, stringValue.length - filterValue.length) !== -1;
    },

    equals(value, filter, filterLocale) {
      if (filter === undefined || filter === null || typeof filter === 'string' && filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime && filter.getTime) return value.getTime() === filter.getTime();else return ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale) == ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
    },

    notEquals(value, filter, filterLocale) {
      if (filter === undefined || filter === null || typeof filter === 'string' && filter.trim() === '') {
        return false;
      }

      if (value === undefined || value === null) {
        return true;
      }

      if (value.getTime && filter.getTime) return value.getTime() !== filter.getTime();else return ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale) != ObjectUtils.removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
    },

    in(value, filter) {
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }

      for (let i = 0; i < filter.length; i++) {
        if (ObjectUtils.equals(value, filter[i])) {
          return true;
        }
      }

      return false;
    },

    between(value, filter) {
      if (filter == null || filter[0] == null || filter[1] == null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime) return filter[0].getTime() <= value.getTime() && value.getTime() <= filter[1].getTime();else return filter[0] <= value && value <= filter[1];
    },

    lt(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime && filter.getTime) return value.getTime() < filter.getTime();else return value < filter;
    },

    lte(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime && filter.getTime) return value.getTime() <= filter.getTime();else return value <= filter;
    },

    gt(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime && filter.getTime) return value.getTime() > filter.getTime();else return value > filter;
    },

    gte(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime && filter.getTime) return value.getTime() >= filter.getTime();else return value >= filter;
    },

    dateIs(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return value.toDateString() === filter.toDateString();
    },

    dateIsNot(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return value.toDateString() !== filter.toDateString();
    },

    dateBefore(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return value.getTime() < filter.getTime();
    },

    dateAfter(value, filter) {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return value.getTime() > filter.getTime();
    }

  },

  register(rule, fn) {
    this.filters[rule] = fn;
  }

};

var script$2 = {
  name: 'InputNumber',
  emits: ['update:modelValue', 'input', 'focus', 'blur'],
  props: {
    modelValue: {
      type: Number,
      default: null
    },
    format: {
      type: Boolean,
      default: true
    },
    showButtons: {
      type: Boolean,
      default: false
    },
    buttonLayout: {
      type: String,
      default: 'stacked'
    },
    incrementButtonClass: {
      type: String,
      default: null
    },
    decrementButtonClass: {
      type: String,
      default: null
    },
    incrementButtonIcon: {
      type: String,
      default: 'pi pi-angle-up'
    },
    decrementButtonIcon: {
      type: String,
      default: 'pi pi-angle-down'
    },
    locale: {
      type: String,
      default: undefined
    },
    localeMatcher: {
      type: String,
      default: undefined
    },
    mode: {
      type: String,
      default: 'decimal'
    },
    prefix: {
      type: String,
      default: null
    },
    suffix: {
      type: String,
      default: null
    },
    currency: {
      type: String,
      default: undefined
    },
    currencyDisplay: {
      type: String,
      default: undefined
    },
    useGrouping: {
      type: Boolean,
      default: true
    },
    minFractionDigits: {
      type: Number,
      default: undefined
    },
    maxFractionDigits: {
      type: Number,
      default: undefined
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    step: {
      type: Number,
      default: 1
    },
    allowEmpty: {
      type: Boolean,
      default: true
    },
    highlightOnFocus: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
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
    incrementButtonProps: {
      type: null,
      default: null
    },
    decrementButtonProps: {
      type: null,
      default: null
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
  numberFormat: null,
  _numeral: null,
  _decimal: null,
  _group: null,
  _minusSign: null,
  _currency: null,
  _suffix: null,
  _prefix: null,
  _index: null,
  groupChar: '',
  isSpecialChar: null,
  prefixChar: null,
  suffixChar: null,
  timer: null,

  data() {
    return {
      d_modelValue: this.modelValue,
      focused: false
    };
  },

  watch: {
    modelValue(newValue) {
      this.d_modelValue = newValue;
    },

    locale(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },

    localeMatcher(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },

    mode(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },

    currency(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },

    currencyDisplay(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },

    useGrouping(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },

    minFractionDigits(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },

    maxFractionDigits(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },

    suffix(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },

    prefix(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    }

  },

  created() {
    this.constructParser();
  },

  methods: {
    getOptions() {
      return {
        localeMatcher: this.localeMatcher,
        style: this.mode,
        currency: this.currency,
        currencyDisplay: this.currencyDisplay,
        useGrouping: this.useGrouping,
        minimumFractionDigits: this.minFractionDigits,
        maximumFractionDigits: this.maxFractionDigits
      };
    },

    constructParser() {
      this.numberFormat = new Intl.NumberFormat(this.locale, this.getOptions());
      const numerals = [...new Intl.NumberFormat(this.locale, {
        useGrouping: false
      }).format(9876543210)].reverse();
      const index = new Map(numerals.map((d, i) => [d, i]));
      this._numeral = new RegExp(`[${numerals.join('')}]`, 'g');
      this._group = this.getGroupingExpression();
      this._minusSign = this.getMinusSignExpression();
      this._currency = this.getCurrencyExpression();
      this._decimal = this.getDecimalExpression();
      this._suffix = this.getSuffixExpression();
      this._prefix = this.getPrefixExpression();

      this._index = d => index.get(d);
    },

    updateConstructParser(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.constructParser();
      }
    },

    escapeRegExp(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    },

    getDecimalExpression() {
      const formatter = new Intl.NumberFormat(this.locale, { ...this.getOptions(),
        useGrouping: false
      });
      return new RegExp(`[${formatter.format(1.1).replace(this._currency, '').trim().replace(this._numeral, '')}]`, 'g');
    },

    getGroupingExpression() {
      const formatter = new Intl.NumberFormat(this.locale, {
        useGrouping: true
      });
      this.groupChar = formatter.format(1000000).trim().replace(this._numeral, '').charAt(0);
      return new RegExp(`[${this.groupChar}]`, 'g');
    },

    getMinusSignExpression() {
      const formatter = new Intl.NumberFormat(this.locale, {
        useGrouping: false
      });
      return new RegExp(`[${formatter.format(-1).trim().replace(this._numeral, '')}]`, 'g');
    },

    getCurrencyExpression() {
      if (this.currency) {
        const formatter = new Intl.NumberFormat(this.locale, {
          style: 'currency',
          currency: this.currency,
          currencyDisplay: this.currencyDisplay,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
        return new RegExp(`[${formatter.format(1).replace(/\s/g, '').replace(this._numeral, '').replace(this._group, '')}]`, 'g');
      }

      return new RegExp(`[]`, 'g');
    },

    getPrefixExpression() {
      if (this.prefix) {
        this.prefixChar = this.prefix;
      } else {
        const formatter = new Intl.NumberFormat(this.locale, {
          style: this.mode,
          currency: this.currency,
          currencyDisplay: this.currencyDisplay
        });
        this.prefixChar = formatter.format(1).split('1')[0];
      }

      return new RegExp(`${this.escapeRegExp(this.prefixChar || '')}`, 'g');
    },

    getSuffixExpression() {
      if (this.suffix) {
        this.suffixChar = this.suffix;
      } else {
        const formatter = new Intl.NumberFormat(this.locale, {
          style: this.mode,
          currency: this.currency,
          currencyDisplay: this.currencyDisplay,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
        this.suffixChar = formatter.format(1).split('1')[1];
      }

      return new RegExp(`${this.escapeRegExp(this.suffixChar || '')}`, 'g');
    },

    formatValue(value) {
      if (value != null) {
        if (value === '-') {
          // Minus sign
          return value;
        }

        if (this.format) {
          let formatter = new Intl.NumberFormat(this.locale, this.getOptions());
          let formattedValue = formatter.format(value);

          if (this.prefix) {
            formattedValue = this.prefix + formattedValue;
          }

          if (this.suffix) {
            formattedValue = formattedValue + this.suffix;
          }

          return formattedValue;
        }

        return value.toString();
      }

      return '';
    },

    parseValue(text) {
      let filteredText = text.replace(this._suffix, '').replace(this._prefix, '').trim().replace(/\s/g, '').replace(this._currency, '').replace(this._group, '').replace(this._minusSign, '-').replace(this._decimal, '.').replace(this._numeral, this._index);

      if (filteredText) {
        if (filteredText === '-') // Minus sign
          return filteredText;
        let parsedValue = +filteredText;
        return isNaN(parsedValue) ? null : parsedValue;
      }

      return null;
    },

    repeat(event, interval, dir) {
      if (this.readonly) {
        return;
      }

      let i = interval || 500;
      this.clearTimer();
      this.timer = setTimeout(() => {
        this.repeat(event, 40, dir);
      }, i);
      this.spin(event, dir);
    },

    spin(event, dir) {
      if (this.$refs.input) {
        let step = this.step * dir;
        let currentValue = this.parseValue(this.$refs.input.$el.value) || 0;
        let newValue = this.validateValue(currentValue + step);
        this.updateInput(newValue, null, 'spin');
        this.updateModel(event, newValue);
        this.handleOnInput(event, currentValue, newValue);
      }
    },

    onUpButtonMouseDown(event) {
      if (!this.disabled) {
        this.$refs.input.$el.focus();
        this.repeat(event, null, 1);
        event.preventDefault();
      }
    },

    onUpButtonMouseUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },

    onUpButtonMouseLeave() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },

    onUpButtonKeyUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },

    onUpButtonKeyDown(event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        this.repeat(event, null, 1);
      }
    },

    onDownButtonMouseDown(event) {
      if (!this.disabled) {
        this.$refs.input.$el.focus();
        this.repeat(event, null, -1);
        event.preventDefault();
      }
    },

    onDownButtonMouseUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },

    onDownButtonMouseLeave() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },

    onDownButtonKeyUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },

    onDownButtonKeyDown(event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        this.repeat(event, null, -1);
      }
    },

    onUserInput() {
      if (this.isSpecialChar) {
        this.$refs.input.$el.value = this.lastValue;
      }

      this.isSpecialChar = false;
    },

    onInputKeyDown(event) {
      if (this.readonly) {
        return;
      }

      this.lastValue = event.target.value;

      if (event.shiftKey || event.altKey) {
        this.isSpecialChar = true;
        return;
      }

      let selectionStart = event.target.selectionStart;
      let selectionEnd = event.target.selectionEnd;
      let inputValue = event.target.value;
      let newValueStr = null;

      if (event.altKey) {
        event.preventDefault();
      }

      switch (event.which) {
        //up
        case 38:
          this.spin(event, 1);
          event.preventDefault();
          break;
        //down

        case 40:
          this.spin(event, -1);
          event.preventDefault();
          break;
        //left

        case 37:
          if (!this.isNumeralChar(inputValue.charAt(selectionStart - 1))) {
            event.preventDefault();
          }

          break;
        //right

        case 39:
          if (!this.isNumeralChar(inputValue.charAt(selectionStart))) {
            event.preventDefault();
          }

          break;
        //tab and enter

        case 9:
        case 13:
          newValueStr = this.validateValue(this.parseValue(inputValue));
          this.$refs.input.$el.value = this.formatValue(newValueStr);
          this.$refs.input.$el.setAttribute('aria-valuenow', newValueStr);
          this.updateModel(event, newValueStr);
          break;
        //backspace

        case 8:
          {
            event.preventDefault();

            if (selectionStart === selectionEnd) {
              const deleteChar = inputValue.charAt(selectionStart - 1);
              const {
                decimalCharIndex,
                decimalCharIndexWithoutPrefix
              } = this.getDecimalCharIndexes(inputValue);

              if (this.isNumeralChar(deleteChar)) {
                const decimalLength = this.getDecimalLength(inputValue);

                if (this._group.test(deleteChar)) {
                  this._group.lastIndex = 0;
                  newValueStr = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart - 1);
                } else if (this._decimal.test(deleteChar)) {
                  this._decimal.lastIndex = 0;

                  if (decimalLength) {
                    this.$refs.input.$el.setSelectionRange(selectionStart - 1, selectionStart - 1);
                  } else {
                    newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                  }
                } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                  const insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < decimalLength ? '' : '0';
                  newValueStr = inputValue.slice(0, selectionStart - 1) + insertedText + inputValue.slice(selectionStart);
                } else if (decimalCharIndexWithoutPrefix === 1) {
                  newValueStr = inputValue.slice(0, selectionStart - 1) + '0' + inputValue.slice(selectionStart);
                  newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : '';
                } else {
                  newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                }
              }

              this.updateValue(event, newValueStr, null, 'delete-single');
            } else {
              newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
              this.updateValue(event, newValueStr, null, 'delete-range');
            }

            break;
          }
        // del

        case 46:
          event.preventDefault();

          if (selectionStart === selectionEnd) {
            const deleteChar = inputValue.charAt(selectionStart);
            const {
              decimalCharIndex,
              decimalCharIndexWithoutPrefix
            } = this.getDecimalCharIndexes(inputValue);

            if (this.isNumeralChar(deleteChar)) {
              const decimalLength = this.getDecimalLength(inputValue);

              if (this._group.test(deleteChar)) {
                this._group.lastIndex = 0;
                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 2);
              } else if (this._decimal.test(deleteChar)) {
                this._decimal.lastIndex = 0;

                if (decimalLength) {
                  this.$refs.input.$el.setSelectionRange(selectionStart + 1, selectionStart + 1);
                } else {
                  newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                }
              } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                const insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < decimalLength ? '' : '0';
                newValueStr = inputValue.slice(0, selectionStart) + insertedText + inputValue.slice(selectionStart + 1);
              } else if (decimalCharIndexWithoutPrefix === 1) {
                newValueStr = inputValue.slice(0, selectionStart) + '0' + inputValue.slice(selectionStart + 1);
                newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : '';
              } else {
                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
              }
            }

            this.updateValue(event, newValueStr, null, 'delete-back-single');
          } else {
            newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
            this.updateValue(event, newValueStr, null, 'delete-range');
          }

          break;
        //home

        case 36:
          if (this.min) {
            this.updateModel(event, this.min);
            event.preventDefault();
          }

          break;
        //end

        case 35:
          if (this.max) {
            this.updateModel(event, this.max);
            event.preventDefault();
          }

          break;
      }
    },

    onInputKeyPress(event) {
      if (this.readonly) {
        return;
      }

      event.preventDefault();
      let code = event.which || event.keyCode;
      let char = String.fromCharCode(code);
      const isDecimalSign = this.isDecimalSign(char);
      const isMinusSign = this.isMinusSign(char);

      if (48 <= code && code <= 57 || isMinusSign || isDecimalSign) {
        this.insert(event, char, {
          isDecimalSign,
          isMinusSign
        });
      }
    },

    onPaste(event) {
      event.preventDefault();
      let data = (event.clipboardData || window['clipboardData']).getData('Text');

      if (data) {
        let filteredData = this.parseValue(data);

        if (filteredData != null) {
          this.insert(event, filteredData.toString());
        }
      }
    },

    allowMinusSign() {
      return this.min === null || this.min < 0;
    },

    isMinusSign(char) {
      if (this._minusSign.test(char) || char === '-') {
        this._minusSign.lastIndex = 0;
        return true;
      }

      return false;
    },

    isDecimalSign(char) {
      if (this._decimal.test(char)) {
        this._decimal.lastIndex = 0;
        return true;
      }

      return false;
    },

    isDecimalMode() {
      return this.mode === 'decimal';
    },

    getDecimalCharIndexes(val) {
      let decimalCharIndex = val.search(this._decimal);
      this._decimal.lastIndex = 0;
      const filteredVal = val.replace(this._prefix, '').trim().replace(/\s/g, '').replace(this._currency, '');
      const decimalCharIndexWithoutPrefix = filteredVal.search(this._decimal);
      this._decimal.lastIndex = 0;
      return {
        decimalCharIndex,
        decimalCharIndexWithoutPrefix
      };
    },

    getCharIndexes(val) {
      const decimalCharIndex = val.search(this._decimal);
      this._decimal.lastIndex = 0;
      const minusCharIndex = val.search(this._minusSign);
      this._minusSign.lastIndex = 0;
      const suffixCharIndex = val.search(this._suffix);
      this._suffix.lastIndex = 0;
      const currencyCharIndex = val.search(this._currency);
      this._currency.lastIndex = 0;
      return {
        decimalCharIndex,
        minusCharIndex,
        suffixCharIndex,
        currencyCharIndex
      };
    },

    insert(event, text, sign = {
      isDecimalSign: false,
      isMinusSign: false
    }) {
      const minusCharIndexOnText = text.search(this._minusSign);
      this._minusSign.lastIndex = 0;

      if (!this.allowMinusSign() && minusCharIndexOnText !== -1) {
        return;
      }

      const selectionStart = this.$refs.input.$el.selectionStart;
      const selectionEnd = this.$refs.input.$el.selectionEnd;
      let inputValue = this.$refs.input.$el.value.trim();
      const {
        decimalCharIndex,
        minusCharIndex,
        suffixCharIndex,
        currencyCharIndex
      } = this.getCharIndexes(inputValue);
      let newValueStr;

      if (sign.isMinusSign) {
        if (selectionStart === 0) {
          newValueStr = inputValue;

          if (minusCharIndex === -1 || selectionEnd !== 0) {
            newValueStr = this.insertText(inputValue, text, 0, selectionEnd);
          }

          this.updateValue(event, newValueStr, text, 'insert');
        }
      } else if (sign.isDecimalSign) {
        if (decimalCharIndex > 0 && selectionStart === decimalCharIndex) {
          this.updateValue(event, inputValue, text, 'insert');
        } else if (decimalCharIndex > selectionStart && decimalCharIndex < selectionEnd) {
          newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
          this.updateValue(event, newValueStr, text, 'insert');
        } else if (decimalCharIndex === -1 && this.maxFractionDigits) {
          newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
          this.updateValue(event, newValueStr, text, 'insert');
        }
      } else {
        const maxFractionDigits = this.numberFormat.resolvedOptions().maximumFractionDigits;
        const operation = selectionStart !== selectionEnd ? 'range-insert' : 'insert';

        if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
          if (selectionStart + text.length - (decimalCharIndex + 1) <= maxFractionDigits) {
            const charIndex = currencyCharIndex >= selectionStart ? currencyCharIndex - 1 : suffixCharIndex >= selectionStart ? suffixCharIndex : inputValue.length;
            newValueStr = inputValue.slice(0, selectionStart) + text + inputValue.slice(selectionStart + text.length, charIndex) + inputValue.slice(charIndex);
            this.updateValue(event, newValueStr, text, operation);
          }
        } else {
          newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
          this.updateValue(event, newValueStr, text, operation);
        }
      }
    },

    insertText(value, text, start, end) {
      let textSplit = text === '.' ? text : text.split('.');

      if (textSplit.length === 2) {
        const decimalCharIndex = value.slice(start, end).search(this._decimal);
        this._decimal.lastIndex = 0;
        return decimalCharIndex > 0 ? value.slice(0, start) + this.formatValue(text) + value.slice(end) : value || this.formatValue(text);
      } else if (end - start === value.length) {
        return this.formatValue(text);
      } else if (start === 0) {
        return text + value.slice(end);
      } else if (end === value.length) {
        return value.slice(0, start) + text;
      } else {
        return value.slice(0, start) + text + value.slice(end);
      }
    },

    deleteRange(value, start, end) {
      let newValueStr;
      if (end - start === value.length) newValueStr = '';else if (start === 0) newValueStr = value.slice(end);else if (end === value.length) newValueStr = value.slice(0, start);else newValueStr = value.slice(0, start) + value.slice(end);
      return newValueStr;
    },

    initCursor() {
      let selectionStart = this.$refs.input.$el.selectionStart;
      let inputValue = this.$refs.input.$el.value;
      let valueLength = inputValue.length;
      let index = null; // remove prefix

      let prefixLength = (this.prefixChar || '').length;
      inputValue = inputValue.replace(this._prefix, '');
      selectionStart = selectionStart - prefixLength;
      let char = inputValue.charAt(selectionStart);

      if (this.isNumeralChar(char)) {
        return selectionStart + prefixLength;
      } //left


      let i = selectionStart - 1;

      while (i >= 0) {
        char = inputValue.charAt(i);

        if (this.isNumeralChar(char)) {
          index = i + prefixLength;
          break;
        } else {
          i--;
        }
      }

      if (index !== null) {
        this.$refs.input.$el.setSelectionRange(index + 1, index + 1);
      } else {
        i = selectionStart;

        while (i < valueLength) {
          char = inputValue.charAt(i);

          if (this.isNumeralChar(char)) {
            index = i + prefixLength;
            break;
          } else {
            i++;
          }
        }

        if (index !== null) {
          this.$refs.input.$el.setSelectionRange(index, index);
        }
      }

      return index || 0;
    },

    onInputClick() {
      const currentValue = this.$refs.input.$el.value;

      if (!this.readonly && currentValue !== DomHandler.getSelection()) {
        this.initCursor();
      }
    },

    isNumeralChar(char) {
      if (char.length === 1 && (this._numeral.test(char) || this._decimal.test(char) || this._group.test(char) || this._minusSign.test(char))) {
        this.resetRegex();
        return true;
      }

      return false;
    },

    resetRegex() {
      this._numeral.lastIndex = 0;
      this._decimal.lastIndex = 0;
      this._group.lastIndex = 0;
      this._minusSign.lastIndex = 0;
    },

    updateValue(event, valueStr, insertedValueStr, operation) {
      let currentValue = this.$refs.input.$el.value;
      let newValue = null;

      if (valueStr != null) {
        newValue = this.parseValue(valueStr);
        newValue = !newValue && !this.allowEmpty ? 0 : newValue;
        this.updateInput(newValue, insertedValueStr, operation, valueStr);
        this.handleOnInput(event, currentValue, newValue);
      }
    },

    handleOnInput(event, currentValue, newValue) {
      if (this.isValueChanged(currentValue, newValue)) {
        this.$emit('input', {
          originalEvent: event,
          value: newValue,
          formattedValue: currentValue
        });
      }
    },

    isValueChanged(currentValue, newValue) {
      if (newValue === null && currentValue !== null) {
        return true;
      }

      if (newValue != null) {
        let parsedCurrentValue = typeof currentValue === 'string' ? this.parseValue(currentValue) : currentValue;
        return newValue !== parsedCurrentValue;
      }

      return false;
    },

    validateValue(value) {
      if (value === '-' || value == null) {
        return null;
      }

      if (this.min != null && value < this.min) {
        return this.min;
      }

      if (this.max != null && value > this.max) {
        return this.max;
      }

      return value;
    },

    updateInput(value, insertedValueStr, operation, valueStr) {
      insertedValueStr = insertedValueStr || '';
      let inputValue = this.$refs.input.$el.value;
      let newValue = this.formatValue(value);
      let currentLength = inputValue.length;

      if (newValue !== valueStr) {
        newValue = this.concatValues(newValue, valueStr);
      }

      if (currentLength === 0) {
        this.$refs.input.$el.value = newValue;
        this.$refs.input.$el.setSelectionRange(0, 0);
        const index = this.initCursor();
        const selectionEnd = index + insertedValueStr.length;
        this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
      } else {
        let selectionStart = this.$refs.input.$el.selectionStart;
        let selectionEnd = this.$refs.input.$el.selectionEnd;
        this.$refs.input.$el.value = newValue;
        let newLength = newValue.length;

        if (operation === 'range-insert') {
          const startValue = this.parseValue((inputValue || '').slice(0, selectionStart));
          const startValueStr = startValue !== null ? startValue.toString() : '';
          const startExpr = startValueStr.split('').join(`(${this.groupChar})?`);
          const sRegex = new RegExp(startExpr, 'g');
          sRegex.test(newValue);
          const tExpr = insertedValueStr.split('').join(`(${this.groupChar})?`);
          const tRegex = new RegExp(tExpr, 'g');
          tRegex.test(newValue.slice(sRegex.lastIndex));
          selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
          this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        } else if (newLength === currentLength) {
          if (operation === 'insert' || operation === 'delete-back-single') this.$refs.input.$el.setSelectionRange(selectionEnd + 1, selectionEnd + 1);else if (operation === 'delete-single') this.$refs.input.$el.setSelectionRange(selectionEnd - 1, selectionEnd - 1);else if (operation === 'delete-range' || operation === 'spin') this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        } else if (operation === 'delete-back-single') {
          let prevChar = inputValue.charAt(selectionEnd - 1);
          let nextChar = inputValue.charAt(selectionEnd);
          let diff = currentLength - newLength;

          let isGroupChar = this._group.test(nextChar);

          if (isGroupChar && diff === 1) {
            selectionEnd += 1;
          } else if (!isGroupChar && this.isNumeralChar(prevChar)) {
            selectionEnd += -1 * diff + 1;
          }

          this._group.lastIndex = 0;
          this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        } else if (inputValue === '-' && operation === 'insert') {
          this.$refs.input.$el.setSelectionRange(0, 0);
          const index = this.initCursor();
          const selectionEnd = index + insertedValueStr.length + 1;
          this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        } else {
          selectionEnd = selectionEnd + (newLength - currentLength);
          this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        }
      }

      this.$refs.input.$el.setAttribute('aria-valuenow', value);
    },

    concatValues(val1, val2) {
      if (val1 && val2) {
        let decimalCharIndex = val2.search(this._decimal);
        this._decimal.lastIndex = 0;

        if (this.suffixChar) {
          return val1.replace(this.suffixChar, '').split(this._decimal)[0] + val2.replace(this.suffixChar, '').slice(decimalCharIndex) + this.suffixChar;
        } else {
          return decimalCharIndex !== -1 ? val1.split(this._decimal)[0] + val2.slice(decimalCharIndex) : val1;
        }
      }

      return val1;
    },

    getDecimalLength(value) {
      if (value) {
        const valueSplit = value.split(this._decimal);

        if (valueSplit.length === 2) {
          return valueSplit[1].replace(this._suffix, '').trim().replace(/\s/g, '').replace(this._currency, '').length;
        }
      }

      return 0;
    },

    updateModel(event, value) {
      this.d_modelValue = value;
      this.$emit('update:modelValue', value);
    },

    onInputFocus(event) {
      this.focused = true;

      if (!this.disabled && !this.readonly && this.$refs.input.$el.value !== DomHandler.getSelection() && this.highlightOnFocus) {
        event.target.select();
      }

      this.$emit('focus', event);
    },

    onInputBlur(event) {
      this.focused = false;
      let input = event.target;
      let newValue = this.validateValue(this.parseValue(input.value));
      this.$emit('blur', {
        originalEvent: event,
        value: input.value
      });
      input.value = this.formatValue(newValue);
      input.setAttribute('aria-valuenow', newValue);
      this.updateModel(event, newValue);
    },

    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },

    maxBoundry() {
      return this.d_modelValue >= this.max;
    },

    minBoundry() {
      return this.d_modelValue <= this.min;
    }

  },
  computed: {
    containerClass() {
      return ['p-inputnumber p-component p-inputwrapper', {
        'p-inputwrapper-filled': this.filled,
        'p-inputwrapper-focus': this.focused,
        'p-inputnumber-buttons-stacked': this.showButtons && this.buttonLayout === 'stacked',
        'p-inputnumber-buttons-horizontal': this.showButtons && this.buttonLayout === 'horizontal',
        'p-inputnumber-buttons-vertical': this.showButtons && this.buttonLayout === 'vertical'
      }];
    },

    upButtonClass() {
      return ['p-inputnumber-button p-inputnumber-button-up', this.incrementButtonClass, {
        'p-disabled': this.showButtons && this.max !== null && this.maxBoundry()
      }];
    },

    downButtonClass() {
      return ['p-inputnumber-button p-inputnumber-button-down', this.decrementButtonClass, {
        'p-disabled': this.showButtons && this.min !== null && this.minBoundry()
      }];
    },

    filled() {
      return this.modelValue != null && this.modelValue.toString().length > 0;
    },

    upButtonListeners() {
      return {
        mousedown: event => this.onUpButtonMouseDown(event),
        mouseup: event => this.onUpButtonMouseUp(event),
        mouseleave: event => this.onUpButtonMouseLeave(event),
        keydown: event => this.onUpButtonKeyDown(event),
        keyup: event => this.onUpButtonKeyUp(event)
      };
    },

    downButtonListeners() {
      return {
        mousedown: event => this.onDownButtonMouseDown(event),
        mouseup: event => this.onDownButtonMouseUp(event),
        mouseleave: event => this.onDownButtonMouseLeave(event),
        keydown: event => this.onDownButtonKeyDown(event),
        keyup: event => this.onDownButtonKeyUp(event)
      };
    },

    formattedValue() {
      const val = !this.modelValue && !this.allowEmpty ? 0 : this.modelValue;
      return this.formatValue(val);
    },

    getFormatter() {
      return this.numberFormat;
    }

  },
  components: {
    INInputText: script$3,
    INButton: script$4
  }
};
const _hoisted_1$2 = {
  key: 0,
  class: "p-inputnumber-button-group"
};

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_INInputText = resolveComponent("INInputText");

  const _component_INButton = resolveComponent("INButton");

  return openBlock(), createElementBlock("span", {
    class: normalizeClass($options.containerClass)
  }, [createVNode(_component_INInputText, mergeProps({
    ref: "input",
    id: $props.inputId,
    class: ["p-inputnumber-input", $props.inputClass],
    role: "spinbutton",
    style: $props.inputStyle,
    value: $options.formattedValue,
    "aria-valuemin": $props.min,
    "aria-valuemax": $props.max,
    "aria-valuenow": $props.modelValue,
    disabled: $props.disabled,
    readonly: $props.readonly,
    placeholder: $props.placeholder,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-label": _ctx.ariaLabel,
    onInput: $options.onUserInput,
    onKeydown: $options.onInputKeyDown,
    onKeypress: $options.onInputKeyPress,
    onPaste: $options.onPaste,
    onClick: $options.onInputClick,
    onFocus: $options.onInputFocus,
    onBlur: $options.onInputBlur
  }, $props.inputProps), null, 16, ["id", "class", "style", "value", "aria-valuemin", "aria-valuemax", "aria-valuenow", "disabled", "readonly", "placeholder", "aria-labelledby", "aria-label", "onInput", "onKeydown", "onKeypress", "onPaste", "onClick", "onFocus", "onBlur"]), $props.showButtons && $props.buttonLayout === 'stacked' ? (openBlock(), createElementBlock("span", _hoisted_1$2, [createVNode(_component_INButton, mergeProps({
    class: $options.upButtonClass,
    icon: $props.incrementButtonIcon
  }, toHandlers($options.upButtonListeners), {
    disabled: $props.disabled,
    tabindex: -1,
    "aria-hidden": "true"
  }, $props.incrementButtonProps), null, 16, ["class", "icon", "disabled"]), createVNode(_component_INButton, mergeProps({
    class: $options.downButtonClass,
    icon: $props.decrementButtonIcon
  }, toHandlers($options.downButtonListeners), {
    disabled: $props.disabled,
    tabindex: -1,
    "aria-hidden": "true"
  }, $props.decrementButtonProps), null, 16, ["class", "icon", "disabled"])])) : createCommentVNode("", true), $props.showButtons && $props.buttonLayout !== 'stacked' ? (openBlock(), createBlock(_component_INButton, mergeProps({
    key: 1,
    class: $options.upButtonClass,
    icon: $props.incrementButtonIcon
  }, toHandlers($options.upButtonListeners), {
    disabled: $props.disabled,
    tabindex: -1,
    "aria-hidden": "true"
  }, $props.incrementButtonProps), null, 16, ["class", "icon", "disabled"])) : createCommentVNode("", true), $props.showButtons && $props.buttonLayout !== 'stacked' ? (openBlock(), createBlock(_component_INButton, mergeProps({
    key: 2,
    class: $options.downButtonClass,
    icon: $props.decrementButtonIcon
  }, toHandlers($options.downButtonListeners), {
    disabled: $props.disabled,
    tabindex: -1,
    "aria-hidden": "true"
  }, $props.decrementButtonProps), null, 16, ["class", "icon", "disabled"])) : createCommentVNode("", true)], 2);
}

function styleInject$2(css, ref) {
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

var css_248z$2 = "\n.p-inputnumber {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n}\n.p-inputnumber-button {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n}\n.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button .p-button-label,\n.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button .p-button-label {\n    display: none;\n}\n.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-up {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n    padding: 0;\n}\n.p-inputnumber-buttons-stacked .p-inputnumber-input {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-down {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n    border-bottom-left-radius: 0;\n    padding: 0;\n}\n.p-inputnumber-buttons-stacked .p-inputnumber-button-group {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n}\n.p-inputnumber-buttons-stacked .p-inputnumber-button-group .p-button.p-inputnumber-button {\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n}\n.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-up {\n    -webkit-box-ordinal-group: 4;\n        -ms-flex-order: 3;\n            order: 3;\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n.p-inputnumber-buttons-horizontal .p-inputnumber-input {\n    -webkit-box-ordinal-group: 3;\n        -ms-flex-order: 2;\n            order: 2;\n    border-radius: 0;\n}\n.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-down {\n    -webkit-box-ordinal-group: 2;\n        -ms-flex-order: 1;\n            order: 1;\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.p-inputnumber-buttons-vertical {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n}\n.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-up {\n    -webkit-box-ordinal-group: 2;\n        -ms-flex-order: 1;\n            order: 1;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n    width: 100%;\n}\n.p-inputnumber-buttons-vertical .p-inputnumber-input {\n    -webkit-box-ordinal-group: 3;\n        -ms-flex-order: 2;\n            order: 2;\n    border-radius: 0;\n    text-align: center;\n}\n.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-down {\n    -webkit-box-ordinal-group: 4;\n        -ms-flex-order: 3;\n            order: 3;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n    width: 100%;\n}\n.p-inputnumber-input {\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n}\n.p-fluid .p-inputnumber {\n    width: 100%;\n}\n.p-fluid .p-inputnumber .p-inputnumber-input {\n    width: 1%;\n}\n.p-fluid .p-inputnumber-buttons-vertical .p-inputnumber-input {\n    width: 100%;\n}\n";
styleInject$2(css_248z$2);
script$2.render = render$2;

var script$1 = {
  name: 'VirtualScroller',
  emits: ['update:numToleratedItems', 'scroll', 'scroll-index-change', 'lazy-load'],
  props: {
    id: {
      type: String,
      default: null
    },
    style: null,
    class: null,
    items: {
      type: Array,
      default: null
    },
    itemSize: {
      type: [Number, Array],
      default: 0
    },
    scrollHeight: null,
    scrollWidth: null,
    orientation: {
      type: String,
      default: 'vertical'
    },
    numToleratedItems: {
      type: Number,
      default: null
    },
    delay: {
      type: Number,
      default: 0
    },
    lazy: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loaderDisabled: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    showSpacer: {
      type: Boolean,
      default: true
    },
    showLoader: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      first: this.isBoth() ? {
        rows: 0,
        cols: 0
      } : 0,
      last: this.isBoth() ? {
        rows: 0,
        cols: 0
      } : 0,
      numItemsInViewport: this.isBoth() ? {
        rows: 0,
        cols: 0
      } : 0,
      lastScrollPos: this.isBoth() ? {
        top: 0,
        left: 0
      } : 0,
      d_numToleratedItems: this.numToleratedItems,
      d_loading: this.loading,
      loaderArr: [],
      spacerStyle: {},
      contentStyle: {}
    };
  },

  element: null,
  content: null,
  lastScrollPos: null,
  scrollTimeout: null,
  watch: {
    numToleratedItems(newValue) {
      this.d_numToleratedItems = newValue;
    },

    loading(newValue) {
      this.d_loading = newValue;
    },

    items(newValue, oldValue) {
      if (!oldValue || oldValue.length !== (newValue || []).length) {
        this.init();
      }
    },

    orientation() {
      this.lastScrollPos = this.isBoth() ? {
        top: 0,
        left: 0
      } : 0;
    }

  },

  mounted() {
    this.init();
    this.lastScrollPos = this.isBoth() ? {
      top: 0,
      left: 0
    } : 0;
  },

  methods: {
    init() {
      this.setSize();
      this.calculateOptions();
      this.setSpacerSize();
    },

    isVertical() {
      return this.orientation === 'vertical';
    },

    isHorizontal() {
      return this.orientation === 'horizontal';
    },

    isBoth() {
      return this.orientation === 'both';
    },

    scrollTo(options) {
      this.element && this.element.scrollTo(options);
    },

    scrollToIndex(index, behavior = 'auto') {
      const both = this.isBoth();
      const horizontal = this.isHorizontal();
      const first = this.first;
      const {
        numToleratedItems
      } = this.calculateNumItems();
      const itemSize = this.itemSize;

      const calculateFirst = (_index = 0, _numT) => _index <= _numT ? 0 : _index;

      const calculateCoord = (_first, _size) => _first * _size;

      const scrollTo = (left = 0, top = 0) => this.scrollTo({
        left,
        top,
        behavior
      });

      if (both) {
        const newFirst = {
          rows: calculateFirst(index[0], numToleratedItems[0]),
          cols: calculateFirst(index[1], numToleratedItems[1])
        };

        if (newFirst.rows !== first.rows || newFirst.cols !== first.cols) {
          scrollTo(calculateCoord(newFirst.cols, itemSize[1]), calculateCoord(newFirst.rows, itemSize[0]));
        }
      } else {
        const newFirst = calculateFirst(index, numToleratedItems);

        if (newFirst !== first) {
          horizontal ? scrollTo(calculateCoord(newFirst, itemSize), 0) : scrollTo(0, calculateCoord(newFirst, itemSize));
        }
      }
    },

    scrollInView(index, to, behavior = 'auto') {
      if (to) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const {
          first,
          viewport
        } = this.getRenderedRange();

        const scrollTo = (left = 0, top = 0) => this.scrollTo({
          left,
          top,
          behavior
        });

        const isToStart = to === 'to-start';
        const isToEnd = to === 'to-end';

        if (isToStart) {
          if (both) {
            if (viewport.first.rows - first.rows > index[0]) {
              scrollTo(viewport.first.cols * this.itemSize[1], (viewport.first.rows - 1) * this.itemSize[0]);
            } else if (viewport.first.cols - first.cols > index[1]) {
              scrollTo((viewport.first.cols - 1) * this.itemSize[1], viewport.first.rows * this.itemSize[0]);
            }
          } else {
            if (viewport.first - first > index) {
              const pos = (viewport.first - 1) * this.itemSize;
              horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
            }
          }
        } else if (isToEnd) {
          if (both) {
            if (viewport.last.rows - first.rows <= index[0] + 1) {
              scrollTo(viewport.first.cols * this.itemSize[1], (viewport.first.rows + 1) * this.itemSize[0]);
            } else if (viewport.last.cols - first.cols <= index[1] + 1) {
              scrollTo((viewport.first.cols + 1) * this.itemSize[1], viewport.first.rows * this.itemSize[0]);
            }
          } else {
            if (viewport.last - first <= index + 1) {
              const pos = (viewport.first + 1) * this.itemSize;
              horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
            }
          }
        }
      } else {
        this.scrollToIndex(index, behavior);
      }
    },

    getRenderedRange() {
      const calculateFirstInViewport = (_pos, _size) => Math.floor(_pos / (_size || _pos));

      let firstInViewport = this.first;
      let lastInViewport = 0;

      if (this.element) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const scrollTop = this.element.scrollTop;
        const scrollLeft = this.element.scrollLeft;

        if (both) {
          firstInViewport = {
            rows: calculateFirstInViewport(scrollTop, this.itemSize[0]),
            cols: calculateFirstInViewport(scrollLeft, this.itemSize[1])
          };
          lastInViewport = {
            rows: firstInViewport.rows + this.numItemsInViewport.rows,
            cols: firstInViewport.cols + this.numItemsInViewport.cols
          };
        } else {
          const scrollPos = horizontal ? scrollLeft : scrollTop;
          firstInViewport = calculateFirstInViewport(scrollPos, this.itemSize);
          lastInViewport = firstInViewport + this.numItemsInViewport;
        }
      }

      return {
        first: this.first,
        last: this.last,
        viewport: {
          first: firstInViewport,
          last: lastInViewport
        }
      };
    },

    calculateNumItems() {
      const both = this.isBoth();
      const horizontal = this.isHorizontal();
      const itemSize = this.itemSize;
      const contentPos = this.getContentPosition();
      const contentWidth = this.element ? this.element.offsetWidth - contentPos.left : 0;
      const contentHeight = this.element ? this.element.offsetHeight - contentPos.top : 0;

      const calculateNumItemsInViewport = (_contentSize, _itemSize) => Math.ceil(_contentSize / (_itemSize || _contentSize));

      const calculateNumToleratedItems = _numItems => Math.ceil(_numItems / 2);

      const numItemsInViewport = both ? {
        rows: calculateNumItemsInViewport(contentHeight, itemSize[0]),
        cols: calculateNumItemsInViewport(contentWidth, itemSize[1])
      } : calculateNumItemsInViewport(horizontal ? contentWidth : contentHeight, itemSize);
      const numToleratedItems = this.d_numToleratedItems || (both ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));
      return {
        numItemsInViewport,
        numToleratedItems
      };
    },

    calculateOptions() {
      const both = this.isBoth();
      const first = this.first;
      const {
        numItemsInViewport,
        numToleratedItems
      } = this.calculateNumItems();

      const calculateLast = (_first, _num, _numT, _isCols) => this.getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);

      const last = both ? {
        rows: calculateLast(first.rows, numItemsInViewport.rows, numToleratedItems[0]),
        cols: calculateLast(first.cols, numItemsInViewport.cols, numToleratedItems[1], true)
      } : calculateLast(first, numItemsInViewport, numToleratedItems);
      this.last = last;
      this.numItemsInViewport = numItemsInViewport;
      this.d_numToleratedItems = numToleratedItems;
      this.$emit('update:numToleratedItems', this.d_numToleratedItems);

      if (this.showLoader) {
        this.loaderArr = both ? Array.from({
          length: numItemsInViewport.rows
        }).map(() => Array.from({
          length: numItemsInViewport.cols
        })) : Array.from({
          length: numItemsInViewport
        });
      }

      if (this.lazy) {
        this.$emit('lazy-load', {
          first,
          last
        });
      }
    },

    getLast(last = 0, isCols) {
      if (this.items) {
        return Math.min(isCols ? (this.columns || this.items[0]).length : this.items.length, last);
      }

      return 0;
    },

    getContentPosition() {
      if (this.content) {
        const style = getComputedStyle(this.content);
        const left = parseInt(style.paddingLeft, 10) + Math.max(parseInt(style.left, 10), 0);
        const right = parseInt(style.paddingRight, 10) + Math.max(parseInt(style.right, 10), 0);
        const top = parseInt(style.paddingTop, 10) + Math.max(parseInt(style.top, 10), 0);
        const bottom = parseInt(style.paddingBottom, 10) + Math.max(parseInt(style.bottom, 10), 0);
        return {
          left,
          right,
          top,
          bottom,
          x: left + right,
          y: top + bottom
        };
      }

      return {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        x: 0,
        y: 0
      };
    },

    setSize() {
      if (this.element) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const parentElement = this.element.parentElement;
        const width = this.scrollWidth || `${this.element.offsetWidth || parentElement.offsetWidth}px`;
        const height = this.scrollHeight || `${this.element.offsetHeight || parentElement.offsetHeight}px`;

        const setProp = (_name, _value) => this.element.style[_name] = _value;

        if (both || horizontal) {
          setProp('height', height);
          setProp('width', width);
        } else {
          setProp('height', height);
        }
      }
    },

    setSpacerSize() {
      const items = this.items;

      if (items) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const contentPos = this.getContentPosition();

        const setProp = (_name, _value, _size, _cpos = 0) => this.spacerStyle = { ...this.spacerStyle,
          ...{
            [`${_name}`]: (_value || []).length * _size + _cpos + 'px'
          }
        };

        if (both) {
          setProp('height', items, this.itemSize[0], contentPos.y);
          setProp('width', this.columns || items[1], this.itemSize[1], contentPos.x);
        } else {
          horizontal ? setProp('width', this.columns || items, this.itemSize, contentPos.x) : setProp('height', items, this.itemSize, contentPos.y);
        }
      }
    },

    setContentPosition(pos) {
      if (this.content) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const first = pos ? pos.first : this.first;

        const calculateTranslateVal = (_first, _size) => _first * _size;

        const setTransform = (_x = 0, _y = 0) => {
          this.contentStyle = { ...this.contentStyle,
            ...{
              transform: `translate3d(${_x}px, ${_y}px, 0)`
            }
          };
        };

        if (both) {
          setTransform(calculateTranslateVal(first.cols, this.itemSize[1]), calculateTranslateVal(first.rows, this.itemSize[0]));
        } else {
          const translateVal = calculateTranslateVal(first, this.itemSize);
          horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
        }
      }
    },

    onScrollPositionChange(event) {
      const target = event.target;
      const both = this.isBoth();
      const horizontal = this.isHorizontal();
      const contentPos = this.getContentPosition();

      const calculateScrollPos = (_pos, _cpos) => _pos ? _pos > _cpos ? _pos - _cpos : _pos : 0;

      const calculateCurrentIndex = (_pos, _size) => Math.floor(_pos / (_size || _pos));

      const calculateTriggerIndex = (_currentIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
        return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
      };

      const calculateFirst = (_currentIndex, _triggerIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
        if (_currentIndex <= _numT) return 0;else return Math.max(0, _isScrollDownOrRight ? _currentIndex < _triggerIndex ? _first : _currentIndex - _numT : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
      };

      const calculateLast = (_currentIndex, _first, _last, _num, _numT, _isCols) => {
        let lastValue = _first + _num + 2 * _numT;

        if (_currentIndex >= _numT) {
          lastValue += _numT + 1;
        }

        return this.getLast(lastValue, _isCols);
      };

      const scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
      const scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);
      let newFirst = both ? {
        rows: 0,
        cols: 0
      } : 0;
      let newLast = this.last;
      let isRangeChanged = false;
      let newScrollPos = this.lastScrollPos;

      if (both) {
        const isScrollDown = this.lastScrollPos.top <= scrollTop;
        const isScrollRight = this.lastScrollPos.left <= scrollLeft;
        const currentIndex = {
          rows: calculateCurrentIndex(scrollTop, this.itemSize[0]),
          cols: calculateCurrentIndex(scrollLeft, this.itemSize[1])
        };
        const triggerIndex = {
          rows: calculateTriggerIndex(currentIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
          cols: calculateTriggerIndex(currentIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
        };
        newFirst = {
          rows: calculateFirst(currentIndex.rows, triggerIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
          cols: calculateFirst(currentIndex.cols, triggerIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
        };
        newLast = {
          rows: calculateLast(currentIndex.rows, newFirst.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
          cols: calculateLast(currentIndex.cols, newFirst.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], true)
        };
        isRangeChanged = newFirst.rows !== this.first.rows || newLast.rows !== this.last.rows || newFirst.cols !== this.first.cols || newLast.cols !== this.last.cols;
        newScrollPos = {
          top: scrollTop,
          left: scrollLeft
        };
      } else {
        const scrollPos = horizontal ? scrollLeft : scrollTop;
        const isScrollDownOrRight = this.lastScrollPos <= scrollPos;
        const currentIndex = calculateCurrentIndex(scrollPos, this.itemSize);
        const triggerIndex = calculateTriggerIndex(currentIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
        newFirst = calculateFirst(currentIndex, triggerIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
        newLast = calculateLast(currentIndex, newFirst, this.last, this.numItemsInViewport, this.d_numToleratedItems);
        isRangeChanged = newFirst !== this.first || newLast !== this.last;
        newScrollPos = scrollPos;
      }

      return {
        first: newFirst,
        last: newLast,
        isRangeChanged,
        scrollPos: newScrollPos
      };
    },

    onScrollChange(event) {
      const {
        first,
        last,
        isRangeChanged,
        scrollPos
      } = this.onScrollPositionChange(event);

      if (isRangeChanged) {
        const newState = {
          first,
          last
        };
        this.setContentPosition(newState);
        this.first = first;
        this.last = last;
        this.lastScrollPos = scrollPos;
        this.$emit('scroll-index-change', newState);

        if (this.lazy) {
          this.$emit('lazy-load', newState);
        }
      }
    },

    onScroll(event) {
      this.$emit('scroll', event);

      if (this.delay) {
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }

        if (!this.d_loading && this.showLoader) {
          const {
            isRangeChanged: changed
          } = this.onScrollPositionChange(event);
          changed && (this.d_loading = true);
        }

        this.scrollTimeout = setTimeout(() => {
          this.onScrollChange(event);

          if (this.d_loading && this.showLoader && !this.lazy) {
            this.d_loading = false;
          }
        }, this.delay);
      } else {
        this.onScrollChange(event);
      }
    },

    getOptions(renderedIndex) {
      const count = (this.items || []).length;
      const index = this.isBoth() ? this.first.rows + renderedIndex : this.first + renderedIndex;
      return {
        index,
        count,
        first: index === 0,
        last: index === count - 1,
        even: index % 2 === 0,
        odd: index % 2 !== 0
      };
    },

    getLoaderOptions(index, extOptions) {
      let count = this.loaderArr.length;
      return {
        index,
        count,
        first: index === 0,
        last: index === count - 1,
        even: index % 2 === 0,
        odd: index % 2 !== 0,
        ...extOptions
      };
    },

    elementRef(el) {
      this.element = el;
    },

    contentRef(el) {
      this.content = el;
    }

  },
  computed: {
    containerClass() {
      return ['p-virtualscroller', {
        'p-both-scroll': this.isBoth(),
        'p-horizontal-scroll': this.isHorizontal()
      }, this.class];
    },

    contentClass() {
      return ['p-virtualscroller-content', {
        'p-virtualscroller-loading': this.d_loading
      }];
    },

    loaderClass() {
      return ['p-virtualscroller-loader', {
        'p-component-overlay': !this.$slots.loader
      }];
    },

    loadedItems() {
      const items = this.items;

      if (items && !this.d_loading) {
        if (this.isBoth()) {
          return items.slice(this.first.rows, this.last.rows).map(item => this.columns ? item : item.slice(this.first.cols, this.last.cols));
        } else if (this.isHorizontal() && this.columns) return items;else return items.slice(this.first, this.last);
      }

      return [];
    },

    loadedRows() {
      return this.d_loading ? this.loaderDisabled ? this.loaderArr : [] : this.loadedItems;
    },

    loadedColumns() {
      if (this.columns) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();

        if (both || horizontal) {
          return this.d_loading && this.loaderDisabled ? both ? this.loaderArr[0] : this.loaderArr : this.columns.slice(both ? this.first.cols : this.first, both ? this.last.cols : this.last);
        }
      }

      return this.columns;
    }

  }
};
const _hoisted_1$1 = ["tabindex"];
const _hoisted_2$1 = {
  key: 1,
  class: "p-virtualscroller-loading-icon pi pi-spinner pi-spin"
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return !$props.disabled ? (openBlock(), createElementBlock("div", {
    key: 0,
    ref: $options.elementRef,
    class: normalizeClass($options.containerClass),
    tabindex: $props.tabindex,
    style: normalizeStyle($props.style),
    onScroll: _cache[0] || (_cache[0] = (...args) => $options.onScroll && $options.onScroll(...args))
  }, [renderSlot(_ctx.$slots, "content", {
    styleClass: $options.contentClass,
    items: $options.loadedItems,
    getItemOptions: $options.getOptions,
    loading: $data.d_loading,
    getLoaderOptions: $options.getLoaderOptions,
    itemSize: $props.itemSize,
    rows: $options.loadedRows,
    columns: $options.loadedColumns,
    contentRef: $options.contentRef,
    spacerStyle: $data.spacerStyle,
    contentStyle: $data.contentStyle,
    vertical: $options.isVertical(),
    horizontal: $options.isHorizontal(),
    both: $options.isBoth()
  }, () => [createElementVNode("div", {
    ref: $options.contentRef,
    class: normalizeClass($options.contentClass),
    style: normalizeStyle($data.contentStyle)
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($options.loadedItems, (item, index) => {
    return renderSlot(_ctx.$slots, "item", {
      key: index,
      item: item,
      options: $options.getOptions(index)
    });
  }), 128))], 6)]), $props.showSpacer ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: "p-virtualscroller-spacer",
    style: normalizeStyle($data.spacerStyle)
  }, null, 4)) : createCommentVNode("", true), !$props.loaderDisabled && $props.showLoader && $data.d_loading ? (openBlock(), createElementBlock("div", {
    key: 1,
    class: normalizeClass($options.loaderClass)
  }, [_ctx.$slots && _ctx.$slots.loader ? (openBlock(true), createElementBlock(Fragment, {
    key: 0
  }, renderList($data.loaderArr, (_, index) => {
    return renderSlot(_ctx.$slots, "loader", {
      key: index,
      options: $options.getLoaderOptions(index, $options.isBoth() && {
        numCols: _ctx.d_numItemsInViewport.cols
      })
    });
  }), 128)) : (openBlock(), createElementBlock("i", _hoisted_2$1))], 2)) : createCommentVNode("", true)], 46, _hoisted_1$1)) : (openBlock(), createElementBlock(Fragment, {
    key: 1
  }, [renderSlot(_ctx.$slots, "default"), renderSlot(_ctx.$slots, "content", {
    items: $props.items,
    rows: $props.items,
    columns: $options.loadedColumns
  })], 64));
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

var css_248z$1 = "\n.p-virtualscroller {\n    position: relative;\n    overflow: auto;\n    contain: strict;\n    -webkit-transform: translateZ(0);\n            transform: translateZ(0);\n    will-change: scroll-position;\n    outline: 0 none;\n}\n.p-virtualscroller-content {\n    position: absolute;\n    top: 0;\n    left: 0;\n    contain: content;\n    min-height: 100%;\n    min-width: 100%;\n    will-change: transform;\n}\n.p-virtualscroller-spacer {\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 1px;\n    width: 1px;\n    -webkit-transform-origin: 0 0;\n            transform-origin: 0 0;\n    pointer-events: none;\n}\n.p-virtualscroller .p-virtualscroller-loader {\n    position: sticky;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n}\n.p-virtualscroller-loader.p-component-overlay {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n}\n";
styleInject$1(css_248z$1);
script$1.render = render$1;

var script = {
  name: 'Dropdown',
  emits: ['update:modelValue', 'change', 'focus', 'blur', 'before-show', 'before-hide', 'show', 'hide', 'filter'],
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
    editable: Boolean,
    placeholder: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dataKey: null,
    showClear: {
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
    clearIconProps: {
      type: null,
      default: null
    },
    appendTo: {
      type: String,
      default: 'body'
    },
    loading: {
      type: Boolean,
      default: false
    },
    clearIcon: {
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
    selectOnFocus: {
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
  searchTimeout: null,
  searchValue: null,
  isModelValueChanged: false,
  focusOnHover: false,

  data() {
    return {
      focused: false,
      focusedOptionIndex: -1,
      filterValue: null,
      overlayVisible: false
    };
  },

  watch: {
    modelValue() {
      this.isModelValueChanged = true;
    },

    options() {
      this.autoUpdateModel();
    }

  },

  mounted() {
    this.autoUpdateModel();
  },

  updated() {
    if (this.overlayVisible && this.isModelValueChanged) {
      this.scrollInView(this.findSelectedOptionIndex());
    }

    this.isModelValueChanged = false;
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

    getOptionRenderKey(option, index) {
      return (this.dataKey ? ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option)) + '_' + index;
    },

    isOptionDisabled(option) {
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
      const _hide = () => {
        this.$emit('before-hide');
        this.overlayVisible = false;
        this.focusedOptionIndex = -1;
        this.searchValue = '';
        this.resetFilterOnHide && (this.filterValue = null);
        isFocus && DomHandler.focus(this.$refs.focusInput);
      };

      setTimeout(() => {
        _hide();
      }, 0); // For ScreenReaders
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
          this.onArrowUpKey(event, this.editable);
          break;

        case 'ArrowLeft':
        case 'ArrowRight':
          this.onArrowLeftKey(event, this.editable);
          break;

        case 'Home':
          this.onHomeKey(event, this.editable);
          break;

        case 'End':
          this.onEndKey(event, this.editable);
          break;

        case 'PageDown':
          this.onPageDownKey(event);
          break;

        case 'PageUp':
          this.onPageUpKey(event);
          break;

        case 'Space':
          this.onSpaceKey(event, this.editable);
          break;

        case 'Enter':
          this.onEnterKey(event);
          break;

        case 'Escape':
          this.onEscapeKey(event);
          break;

        case 'Tab':
          this.onTabKey(event);
          break;

        case 'Backspace':
          this.onBackspaceKey(event, this.editable);
          break;

        case 'ShiftLeft':
        case 'ShiftRight':
          //NOOP
          break;

        default:
          if (!metaKey && ObjectUtils.isPrintableCharacter(event.key)) {
            !this.overlayVisible && this.show();
            !this.editable && this.searchOptions(event, event.key);
          }

          break;
      }
    },

    onEditableInput(event) {
      const value = event.target.value;
      this.searchValue = '';
      const matched = this.searchOptions(event, value);
      !matched && (this.focusedOptionIndex = -1);
      this.$emit('update:modelValue', value);
    },

    onContainerClick(event) {
      if (this.disabled || this.loading) {
        return;
      }

      if (DomHandler.hasClass(event.target, 'p-dropdown-clear-icon') || event.target.tagName === 'INPUT') {
        return;
      } else if (!this.overlay || !this.overlay.contains(event.target)) {
        this.overlayVisible ? this.hide(true) : this.show(true);
      }
    },

    onClearClick(event) {
      this.updateModel(event, null);
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

    onOptionSelect(event, option, isHide = true) {
      const value = this.getOptionValue(option);
      this.updateModel(event, value);
      isHide && this.hide(true);
    },

    onOptionMouseMove(event, index) {
      if (this.focusOnHover) {
        this.changeFocusedOptionIndex(event, index);
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
        this.changeFocusedOptionIndex(event, this.findFirstOptionIndex());
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
        this.changeFocusedOptionIndex(event, this.findLastOptionIndex());
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
          this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
        }

        this.hide();
      }

      event.preventDefault();
    },

    onSpaceKey(event, pressedInInputText = false) {
      !pressedInInputText && this.onEnterKey(event);
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

    onBackspaceKey(event, pressedInInputText = false) {
      if (pressedInInputText) {
        !this.overlayVisible && this.show();
      }
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
          if (this.overlayVisible && this.overlay && !this.$el.contains(event.target) && !this.overlay.contains(event.target)) {
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
      return ObjectUtils.equals(this.modelValue, this.getOptionValue(option), this.equalityKey);
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

    findSelectedOptionIndex() {
      return this.hasSelectedOption ? this.visibleOptions.findIndex(option => this.isValidSelectedOption(option)) : -1;
    },

    findFirstFocusedOptionIndex() {
      const selectedIndex = this.findSelectedOptionIndex();
      return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    },

    findLastFocusedOptionIndex() {
      const selectedIndex = this.findSelectedOptionIndex();
      return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    },

    searchOptions(event, char) {
      this.searchValue = (this.searchValue || '') + char;
      let optionIndex = -1;
      let matched = false;

      if (this.focusedOptionIndex !== -1) {
        optionIndex = this.visibleOptions.slice(this.focusedOptionIndex).findIndex(option => this.isOptionMatched(option));
        optionIndex = optionIndex === -1 ? this.visibleOptions.slice(0, this.focusedOptionIndex).findIndex(option => this.isOptionMatched(option)) : optionIndex + this.focusedOptionIndex;
      } else {
        optionIndex = this.visibleOptions.findIndex(option => this.isOptionMatched(option));
      }

      if (optionIndex !== -1) {
        matched = true;
      }

      if (optionIndex === -1 && this.focusedOptionIndex === -1) {
        optionIndex = this.findFirstFocusedOptionIndex();
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
      return matched;
    },

    changeFocusedOptionIndex(event, index) {
      if (this.focusedOptionIndex !== index) {
        this.focusedOptionIndex = index;
        this.scrollInView();

        if (this.selectOnFocus) {
          this.onOptionSelect(event, this.visibleOptions[index], false);
        }
      }
    },

    scrollInView(index = -1) {
      const id = index !== -1 ? `${this.id}_${index}` : this.focusedOptionId;
      const element = DomHandler.findSingle(this.list, `li[id="${id}"]`);

      if (element) {
        element.scrollIntoView && element.scrollIntoView({
          block: 'nearest',
          inline: 'start'
        });
      } else if (!this.virtualScrollerDisabled) {
        setTimeout(() => {
          this.virtualScroller && this.virtualScroller.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex);
        }, 0);
      }
    },

    autoUpdateModel() {
      if (this.selectOnFocus && this.autoOptionFocus && !this.hasSelectedOption) {
        this.focusedOptionIndex = this.findFirstFocusedOptionIndex();
        this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex], false);
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
      return ['p-dropdown p-component p-inputwrapper', {
        'p-disabled': this.disabled,
        'p-dropdown-clearable': this.showClear && !this.disabled,
        'p-focus': this.focused,
        'p-inputwrapper-filled': this.modelValue,
        'p-inputwrapper-focus': this.focused || this.overlayVisible,
        'p-overlay-open': this.overlayVisible
      }];
    },

    inputStyleClass() {
      return ['p-dropdown-label p-inputtext', this.inputClass, {
        'p-placeholder': !this.editable && this.label === this.placeholder,
        'p-dropdown-label-empty': !this.editable && !this.$slots['value'] && (this.label === 'p-emptylabel' || this.label.length === 0)
      }];
    },

    panelStyleClass() {
      return ['p-dropdown-panel p-component', this.panelClass, {
        'p-input-filled': this.$primevue.config.inputStyle === 'filled',
        'p-ripple-disabled': this.$primevue.config.ripple === false
      }];
    },

    dropdownIconClass() {
      return ['p-dropdown-trigger-icon', this.loading ? this.loadingIcon : this.dropdownIcon];
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

    hasSelectedOption() {
      return ObjectUtils.isNotEmpty(this.modelValue);
    },

    label() {
      const selectedOptionIndex = this.findSelectedOptionIndex();
      return selectedOptionIndex !== -1 ? this.getOptionLabel(this.visibleOptions[selectedOptionIndex]) : this.placeholder || 'p-emptylabel';
    },

    editableInputValue() {
      const selectedOptionIndex = this.findSelectedOptionIndex();
      return selectedOptionIndex !== -1 ? this.getOptionLabel(this.visibleOptions[selectedOptionIndex]) : this.modelValue || '';
    },

    equalityKey() {
      return this.optionValue ? null : this.dataKey;
    },

    searchFields() {
      return this.filterFields || [this.optionLabel];
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
      return this.hasSelectedOption ? this.selectionMessageText.replaceAll('{0}', '1') : this.emptySelectionMessageText;
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

    virtualScrollerDisabled() {
      return !this.virtualScrollerOptions;
    }

  },
  directives: {
    ripple: Ripple
  },
  components: {
    VirtualScroller: script$1,
    Portal: script$5
  }
};
const _hoisted_1 = ["id"];
const _hoisted_2 = ["id", "value", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant"];
const _hoisted_3 = ["id", "tabindex", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-disabled"];
const _hoisted_4 = {
  class: "p-dropdown-trigger"
};
const _hoisted_5 = {
  key: 0,
  class: "p-dropdown-header"
};
const _hoisted_6 = {
  class: "p-dropdown-filter-container"
};
const _hoisted_7 = ["value", "placeholder", "aria-owns", "aria-activedescendant"];
const _hoisted_8 = {
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};
const _hoisted_9 = ["id"];
const _hoisted_10 = ["id"];
const _hoisted_11 = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onClick", "onMousemove"];
const _hoisted_12 = {
  key: 0,
  class: "p-dropdown-empty-message",
  role: "option"
};
const _hoisted_13 = {
  key: 1,
  class: "p-dropdown-empty-message",
  role: "option"
};
const _hoisted_14 = {
  key: 0,
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};
const _hoisted_15 = {
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VirtualScroller = resolveComponent("VirtualScroller");

  const _component_Portal = resolveComponent("Portal");

  const _directive_ripple = resolveDirective("ripple");

  return openBlock(), createElementBlock("div", {
    ref: "container",
    id: $options.id,
    class: normalizeClass($options.containerClass),
    onClick: _cache[16] || (_cache[16] = (...args) => $options.onContainerClick && $options.onContainerClick(...args))
  }, [$props.editable ? (openBlock(), createElementBlock("input", mergeProps({
    key: 0,
    ref: "focusInput",
    id: $props.inputId,
    type: "text",
    style: $props.inputStyle,
    class: $options.inputStyleClass,
    value: $options.editableInputValue,
    placeholder: $props.placeholder,
    tabindex: !$props.disabled ? $props.tabindex : -1,
    disabled: $props.disabled,
    autocomplete: "off",
    role: "combobox",
    "aria-label": _ctx.ariaLabel,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": $data.overlayVisible,
    "aria-controls": $options.id + '_list',
    "aria-activedescendant": $data.focused ? $options.focusedOptionId : undefined,
    onFocus: _cache[0] || (_cache[0] = (...args) => $options.onFocus && $options.onFocus(...args)),
    onBlur: _cache[1] || (_cache[1] = (...args) => $options.onBlur && $options.onBlur(...args)),
    onKeydown: _cache[2] || (_cache[2] = (...args) => $options.onKeyDown && $options.onKeyDown(...args)),
    onInput: _cache[3] || (_cache[3] = (...args) => $options.onEditableInput && $options.onEditableInput(...args))
  }, $props.inputProps), null, 16, _hoisted_2)) : (openBlock(), createElementBlock("span", mergeProps({
    key: 1,
    ref: "focusInput",
    id: $props.inputId,
    style: $props.inputStyle,
    class: $options.inputStyleClass,
    tabindex: !$props.disabled ? $props.tabindex : -1,
    role: "combobox",
    "aria-label": _ctx.ariaLabel || ($options.label === 'p-emptylabel' ? undefined : $options.label),
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": $data.overlayVisible,
    "aria-controls": $options.id + '_list',
    "aria-activedescendant": $data.focused ? $options.focusedOptionId : undefined,
    "aria-disabled": $props.disabled,
    onFocus: _cache[4] || (_cache[4] = (...args) => $options.onFocus && $options.onFocus(...args)),
    onBlur: _cache[5] || (_cache[5] = (...args) => $options.onBlur && $options.onBlur(...args)),
    onKeydown: _cache[6] || (_cache[6] = (...args) => $options.onKeyDown && $options.onKeyDown(...args))
  }, $props.inputProps), [renderSlot(_ctx.$slots, "value", {
    value: $props.modelValue,
    placeholder: $props.placeholder
  }, () => [createTextVNode(toDisplayString($options.label === 'p-emptylabel' ? ' ' : $options.label || 'empty'), 1)])], 16, _hoisted_3)), $props.showClear && $props.modelValue != null ? (openBlock(), createElementBlock("i", mergeProps({
    key: 2,
    class: ['p-dropdown-clear-icon', $props.clearIcon],
    onClick: _cache[7] || (_cache[7] = (...args) => $options.onClearClick && $options.onClearClick(...args))
  }, $props.clearIconProps), null, 16)) : createCommentVNode("", true), createElementVNode("div", _hoisted_4, [renderSlot(_ctx.$slots, "indicator", {}, () => [createElementVNode("span", {
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
        onClick: _cache[14] || (_cache[14] = (...args) => $options.onOverlayClick && $options.onOverlayClick(...args)),
        onKeydown: _cache[15] || (_cache[15] = (...args) => $options.onOverlayKeyDown && $options.onOverlayKeyDown(...args))
      }, $props.panelProps), [createElementVNode("span", {
        ref: "firstHiddenFocusableElementOnOverlay",
        role: "presentation",
        "aria-hidden": "true",
        class: "p-hidden-accessible p-hidden-focusable",
        tabindex: 0,
        onFocus: _cache[8] || (_cache[8] = (...args) => $options.onFirstHiddenFocus && $options.onFirstHiddenFocus(...args))
      }, null, 544), renderSlot(_ctx.$slots, "header", {
        value: $props.modelValue,
        options: $options.visibleOptions
      }), $props.filter ? (openBlock(), createElementBlock("div", _hoisted_5, [createElementVNode("div", _hoisted_6, [createElementVNode("input", mergeProps({
        ref: "filterInput",
        type: "text",
        value: $data.filterValue,
        onVnodeUpdated: _cache[9] || (_cache[9] = (...args) => $options.onFilterUpdated && $options.onFilterUpdated(...args)),
        class: "p-dropdown-filter p-inputtext p-component",
        placeholder: $props.filterPlaceholder,
        role: "searchbox",
        autocomplete: "off",
        "aria-owns": $options.id + '_list',
        "aria-activedescendant": $options.focusedOptionId,
        onKeydown: _cache[10] || (_cache[10] = (...args) => $options.onFilterKeyDown && $options.onFilterKeyDown(...args)),
        onBlur: _cache[11] || (_cache[11] = (...args) => $options.onFilterBlur && $options.onFilterBlur(...args)),
        onInput: _cache[12] || (_cache[12] = (...args) => $options.onFilterChange && $options.onFilterChange(...args))
      }, $props.filterInputProps), null, 16, _hoisted_7), createElementVNode("span", {
        class: normalizeClass(['p-dropdown-filter-icon', $props.filterIcon])
      }, null, 2)]), createElementVNode("span", _hoisted_8, toDisplayString($options.filterResultMessageText), 1)])) : createCommentVNode("", true), createElementVNode("div", {
        class: "p-dropdown-items-wrapper",
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
          class: normalizeClass(['p-dropdown-items', styleClass]),
          style: normalizeStyle(contentStyle),
          role: "listbox"
        }, [(openBlock(true), createElementBlock(Fragment, null, renderList(items, (option, i) => {
          return openBlock(), createElementBlock(Fragment, {
            key: $options.getOptionRenderKey(option, $options.getOptionIndex(i, getItemOptions))
          }, [$options.isOptionGroup(option) ? (openBlock(), createElementBlock("li", {
            key: 0,
            id: $options.id + '_' + $options.getOptionIndex(i, getItemOptions),
            style: normalizeStyle({
              height: itemSize ? itemSize + 'px' : undefined
            }),
            class: "p-dropdown-item-group",
            role: "option"
          }, [renderSlot(_ctx.$slots, "optiongroup", {
            option: option.optionGroup,
            index: $options.getOptionIndex(i, getItemOptions)
          }, () => [createTextVNode(toDisplayString($options.getOptionGroupLabel(option.optionGroup)), 1)])], 12, _hoisted_10)) : withDirectives((openBlock(), createElementBlock("li", {
            key: 1,
            id: $options.id + '_' + $options.getOptionIndex(i, getItemOptions),
            style: normalizeStyle({
              height: itemSize ? itemSize + 'px' : undefined
            }),
            class: normalizeClass(['p-dropdown-item', {
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
            onClick: $event => $options.onOptionSelect($event, option),
            onMousemove: $event => $options.onOptionMouseMove($event, $options.getOptionIndex(i, getItemOptions))
          }, [renderSlot(_ctx.$slots, "option", {
            option: option,
            index: $options.getOptionIndex(i, getItemOptions)
          }, () => [createTextVNode(toDisplayString($options.getOptionLabel(option)), 1)])], 46, _hoisted_11)), [[_directive_ripple]])], 64);
        }), 128)), $data.filterValue && (!items || items && items.length === 0) ? (openBlock(), createElementBlock("li", _hoisted_12, [renderSlot(_ctx.$slots, "emptyfilter", {}, () => [createTextVNode(toDisplayString($options.emptyFilterMessageText), 1)])])) : !$props.options || $props.options && $props.options.length === 0 ? (openBlock(), createElementBlock("li", _hoisted_13, [renderSlot(_ctx.$slots, "empty", {}, () => [createTextVNode(toDisplayString($options.emptyMessageText), 1)])])) : createCommentVNode("", true)], 14, _hoisted_9), !$props.options || $props.options && $props.options.length === 0 ? (openBlock(), createElementBlock("span", _hoisted_14, toDisplayString($options.emptyMessageText), 1)) : createCommentVNode("", true), createElementVNode("span", _hoisted_15, toDisplayString($options.selectedMessageText), 1)]),
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
        onFocus: _cache[13] || (_cache[13] = (...args) => $options.onLastHiddenFocus && $options.onLastHiddenFocus(...args))
      }, null, 544)], 16)) : createCommentVNode("", true)]),
      _: 3
    }, 8, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])]),
    _: 3
  }, 8, ["appendTo"])], 10, _hoisted_1);
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

var css_248z = "\n.p-dropdown {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    cursor: pointer;\n    position: relative;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n}\n.p-dropdown-clear-icon {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5rem;\n}\n.p-dropdown-trigger {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n}\n.p-dropdown-label {\n    display: block;\n    white-space: nowrap;\n    overflow: hidden;\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n    width: 1%;\n    text-overflow: ellipsis;\n    cursor: pointer;\n}\n.p-dropdown-label-empty {\n    overflow: hidden;\n    opacity: 0;\n}\ninput.p-dropdown-label {\n    cursor: default;\n}\n.p-dropdown .p-dropdown-panel {\n    min-width: 100%;\n}\n.p-dropdown-panel {\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.p-dropdown-items-wrapper {\n    overflow: auto;\n}\n.p-dropdown-item {\n    cursor: pointer;\n    font-weight: normal;\n    white-space: nowrap;\n    position: relative;\n    overflow: hidden;\n}\n.p-dropdown-item-group {\n    cursor: auto;\n}\n.p-dropdown-items {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n.p-dropdown-filter {\n    width: 100%;\n}\n.p-dropdown-filter-container {\n    position: relative;\n}\n.p-dropdown-filter-icon {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5rem;\n}\n.p-fluid .p-dropdown {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n.p-fluid .p-dropdown .p-dropdown-label {\n    width: 1%;\n}\n";
styleInject(css_248z);
script.render = render;

export { FilterMatchMode as F, script as a, FilterOperator as b, FilterService as c, script$1 as d, script$2 as s };
