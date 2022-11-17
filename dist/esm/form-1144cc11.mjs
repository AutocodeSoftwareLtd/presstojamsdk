import { h, getCurrentInstance, effectScope, inject, onMounted, onUnmounted, shallowRef, ref, computed, onBeforeMount, watch, Fragment, isRef, createVNode, Text, resolveComponent, resolveDirective, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, withDirectives, createCommentVNode, createBlock, resolveDynamicComponent, createTextVNode, toDisplayString as toDisplayString$1, renderList, vModelText, withCtx, Transition, mergeProps, renderSlot, unref, vShow, withKeys, provide, withModifiers } from 'vue';
import { s as script$n, a as script$p } from './dropdown.esm-42467633.mjs';
import { O as ObjectUtils, D as DomHandler, Z as ZIndexUtils, U as UniqueComponentId, C as ConnectedOverlayScrollHandler } from './utils.esm-d009df4f.mjs';
import { s as script$m, O as OverlayEventBus } from './portal.esm-7deedf95.mjs';
import { R as Ripple } from './ripple.esm-9120ee72.mjs';
import { b as createTemporaryStore, g as getStoreById, s as script$q, d as script$s } from './fieldset.esm-bceed8ae.mjs';
import { g as getStore } from './reactivestores-e540cb98.mjs';
import { s as script$o, a as script$r } from './inputtext.esm-98b20197.mjs';
import { F as FocusTrap } from './focustrap.esm-2e0fe540.mjs';
import { R as ReferenceTypes, b as getRouteStructure, d as getMutableCells, e as getImmutableCells } from './routes-c7b670d2.mjs';
import { s as script$t } from './dispatch-response-339e84f1.mjs';

function getDevtoolsGlobalHook() {
  return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function getTarget() {
  // @ts-ignore
  return typeof navigator !== 'undefined' && typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};
}
const isProxyAvailable = typeof Proxy === 'function';

const HOOK_SETUP = 'devtools-plugin:setup';
const HOOK_PLUGIN_SETTINGS_SET = 'plugin:settings:set';

let supported;
let perf;
function isPerformanceSupported() {
  var _a;

  if (supported !== undefined) {
    return supported;
  }

  if (typeof window !== 'undefined' && window.performance) {
    supported = true;
    perf = window.performance;
  } else if (typeof global !== 'undefined' && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
    supported = true;
    perf = global.perf_hooks.performance;
  } else {
    supported = false;
  }

  return supported;
}
function now() {
  return isPerformanceSupported() ? perf.now() : Date.now();
}

class ApiProxy {
  constructor(plugin, hook) {
    this.target = null;
    this.targetQueue = [];
    this.onQueue = [];
    this.plugin = plugin;
    this.hook = hook;
    const defaultSettings = {};

    if (plugin.settings) {
      for (const id in plugin.settings) {
        const item = plugin.settings[id];
        defaultSettings[id] = item.defaultValue;
      }
    }

    const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
    let currentSettings = Object.assign({}, defaultSettings);

    try {
      const raw = localStorage.getItem(localSettingsSaveId);
      const data = JSON.parse(raw);
      Object.assign(currentSettings, data);
    } catch (e) {// noop
    }

    this.fallbacks = {
      getSettings() {
        return currentSettings;
      },

      setSettings(value) {
        try {
          localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
        } catch (e) {// noop
        }

        currentSettings = value;
      },

      now() {
        return now();
      }

    };

    if (hook) {
      hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
        if (pluginId === this.plugin.id) {
          this.fallbacks.setSettings(value);
        }
      });
    }

    this.proxiedOn = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target.on[prop];
        } else {
          return (...args) => {
            this.onQueue.push({
              method: prop,
              args
            });
          };
        }
      }
    });
    this.proxiedTarget = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target[prop];
        } else if (prop === 'on') {
          return this.proxiedOn;
        } else if (Object.keys(this.fallbacks).includes(prop)) {
          return (...args) => {
            this.targetQueue.push({
              method: prop,
              args,
              resolve: () => {}
            });
            return this.fallbacks[prop](...args);
          };
        } else {
          return (...args) => {
            return new Promise(resolve => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve
              });
            });
          };
        }
      }
    });
  }

  async setRealTarget(target) {
    this.target = target;

    for (const item of this.onQueue) {
      this.target.on[item.method](...item.args);
    }

    for (const item of this.targetQueue) {
      item.resolve(await this.target[item.method](...item.args));
    }
  }

}

function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
  const descriptor = pluginDescriptor;
  const target = getTarget();
  const hook = getDevtoolsGlobalHook();
  const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;

  if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
    hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
  } else {
    const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
    const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
    list.push({
      pluginDescriptor: descriptor,
      setupFn,
      proxy
    });
    if (proxy) setupFn(proxy.proxiedTarget);
  }
}

/*!
  * shared v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */

/**
 * Original Utilities
 * written by kazuya kawaguchi
 */
const inBrowser = typeof window !== 'undefined';
let mark;
let measure;

if (process.env.NODE_ENV !== 'production') {
  const perf = inBrowser && window.performance;

  if (perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures) {
    mark = tag => perf.mark(tag);

    measure = (name, startTag, endTag) => {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
    };
  }
}

const RE_ARGS = /\{([0-9a-zA-Z]+)\}/g;
/* eslint-disable */

function format(message, ...args) {
  if (args.length === 1 && isObject(args[0])) {
    args = args[0];
  }

  if (!args || !args.hasOwnProperty) {
    args = {};
  }

  return message.replace(RE_ARGS, (match, identifier) => {
    return args.hasOwnProperty(identifier) ? args[identifier] : '';
  });
}

const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

const makeSymbol = name => hasSymbol ? Symbol(name) : name;

const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({
  l: locale,
  k: key,
  s: source
});

const friendlyJSONstringify = json => JSON.stringify(json).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029').replace(/\u0027/g, '\\u0027');

const isNumber = val => typeof val === 'number' && isFinite(val);

const isDate = val => toTypeString(val) === '[object Date]';

const isRegExp = val => toTypeString(val) === '[object RegExp]';

const isEmptyObject = val => isPlainObject(val) && Object.keys(val).length === 0;

function warn(msg, err) {
  if (typeof console !== 'undefined') {
    console.warn(`[intlify] ` + msg);
    /* istanbul ignore if */

    if (err) {
      console.warn(err.stack);
    }
  }
}

const assign = Object.assign;

let _globalThis;

const getGlobalThis = () => {
  // prettier-ignore
  return _globalThis || (_globalThis = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});
};

function escapeHtml(rawText) {
  return rawText.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
/* eslint-enable */

/**
 * Useful Utilities By Evan you
 * Modified by kazuya kawaguchi
 * MIT License
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/index.ts
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/codeframe.ts
 */


const isArray = Array.isArray;

const isFunction = val => typeof val === 'function';

const isString = val => typeof val === 'string';

const isBoolean = val => typeof val === 'boolean';

const isObject = val => // eslint-disable-line
val !== null && typeof val === 'object';

const objectToString = Object.prototype.toString;

const toTypeString = value => objectToString.call(value);

const isPlainObject = val => toTypeString(val) === '[object Object]'; // for converting list and named values to displayed strings.


const toDisplayString = val => {
  return val == null ? '' : isArray(val) || isPlainObject(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
};

const RANGE = 2;

function generateCodeFrame(source, start = 0, end = source.length) {
  const lines = source.split(/\r?\n/);
  let count = 0;
  const res = [];

  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + 1;

    if (count >= start) {
      for (let j = i - RANGE; j <= i + RANGE || end > count; j++) {
        if (j < 0 || j >= lines.length) continue;
        const line = j + 1;
        res.push(`${line}${' '.repeat(3 - String(line).length)}|  ${lines[j]}`);
        const lineLength = lines[j].length;

        if (j === i) {
          // push underline
          const pad = start - (count - lineLength) + 1;
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + '^'.repeat(length));
          }

          count += lineLength + 1;
        }
      }

      break;
    }
  }

  return res.join('\n');
}
/**
 * Event emitter, forked from the below:
 * - original repository url: https://github.com/developit/mitt
 * - code url: https://github.com/developit/mitt/blob/master/src/index.ts
 * - author: Jason Miller (https://github.com/developit)
 * - license: MIT
 */

/**
 * Create a event emitter
 *
 * @returns An event emitter
 */


function createEmitter() {
  const events = new Map();
  const emitter = {
    events,

    on(event, handler) {
      const handlers = events.get(event);
      const added = handlers && handlers.push(handler);

      if (!added) {
        events.set(event, [handler]);
      }
    },

    off(event, handler) {
      const handlers = events.get(event);

      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
      }
    },

    emit(event, payload) {
      (events.get(event) || []).slice().map(handler => handler(payload));
      (events.get('*') || []).slice().map(handler => handler(event, payload));
    }

  };
  return emitter;
}

/*!
  * message-compiler v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const CompileErrorCodes = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14,
  // Special value for higher-order compilers to pick up the last code
  // to avoid collision of error codes. This should always be kept as the last
  // item.
  __EXTEND_POINT__: 15
};
/** @internal */

const errorMessages$2 = {
  // tokenizer error messages
  [CompileErrorCodes.EXPECTED_TOKEN]: `Expected token: '{0}'`,
  [CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER]: `Invalid token in placeholder: '{0}'`,
  [CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]: `Unterminated single quote in placeholder`,
  [CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE]: `Unknown escape sequence: \\{0}`,
  [CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE]: `Invalid unicode escape sequence: {0}`,
  [CompileErrorCodes.UNBALANCED_CLOSING_BRACE]: `Unbalanced closing brace`,
  [CompileErrorCodes.UNTERMINATED_CLOSING_BRACE]: `Unterminated closing brace`,
  [CompileErrorCodes.EMPTY_PLACEHOLDER]: `Empty placeholder`,
  [CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER]: `Not allowed nest placeholder`,
  [CompileErrorCodes.INVALID_LINKED_FORMAT]: `Invalid linked format`,
  // parser error messages
  [CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL]: `Plural must have messages`,
  [CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER]: `Unexpected empty linked modifier`,
  [CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY]: `Unexpected empty linked key`,
  [CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS]: `Unexpected lexical analysis in token: '{0}'`
};

function createCompileError(code, loc, options = {}) {
  const {
    domain,
    messages,
    args
  } = options;
  const msg = process.env.NODE_ENV !== 'production' ? format((messages || errorMessages$2)[code] || '', ...(args || [])) : code;
  const error = new SyntaxError(String(msg));
  error.code = code;

  if (loc) {
    error.location = loc;
  }

  error.domain = domain;
  return error;
}
/** @internal */


function defaultOnError(error) {
  throw error;
}

function createPosition(line, column, offset) {
  return {
    line,
    column,
    offset
  };
}

function createLocation(start, end, source) {
  const loc = {
    start,
    end
  };

  if (source != null) {
    loc.source = source;
  }

  return loc;
}

const CHAR_SP = ' ';
const CHAR_CR = '\r';
const CHAR_LF = '\n';
const CHAR_LS = String.fromCharCode(0x2028);
const CHAR_PS = String.fromCharCode(0x2029);

function createScanner(str) {
  const _buf = str;
  let _index = 0;
  let _line = 1;
  let _column = 1;
  let _peekOffset = 0;

  const isCRLF = index => _buf[index] === CHAR_CR && _buf[index + 1] === CHAR_LF;

  const isLF = index => _buf[index] === CHAR_LF;

  const isPS = index => _buf[index] === CHAR_PS;

  const isLS = index => _buf[index] === CHAR_LS;

  const isLineEnd = index => isCRLF(index) || isLF(index) || isPS(index) || isLS(index);

  const index = () => _index;

  const line = () => _line;

  const column = () => _column;

  const peekOffset = () => _peekOffset;

  const charAt = offset => isCRLF(offset) || isPS(offset) || isLS(offset) ? CHAR_LF : _buf[offset];

  const currentChar = () => charAt(_index);

  const currentPeek = () => charAt(_index + _peekOffset);

  function next() {
    _peekOffset = 0;

    if (isLineEnd(_index)) {
      _line++;
      _column = 0;
    }

    if (isCRLF(_index)) {
      _index++;
    }

    _index++;
    _column++;
    return _buf[_index];
  }

  function peek() {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++;
    }

    _peekOffset++;
    return _buf[_index + _peekOffset];
  }

  function reset() {
    _index = 0;
    _line = 1;
    _column = 1;
    _peekOffset = 0;
  }

  function resetPeek(offset = 0) {
    _peekOffset = offset;
  }

  function skipToPeek() {
    const target = _index + _peekOffset; // eslint-disable-next-line no-unmodified-loop-condition

    while (target !== _index) {
      next();
    }

    _peekOffset = 0;
  }

  return {
    index,
    line,
    column,
    peekOffset,
    charAt,
    currentChar,
    currentPeek,
    next,
    peek,
    reset,
    resetPeek,
    skipToPeek
  };
}

const EOF = undefined;
const LITERAL_DELIMITER = "'";
const ERROR_DOMAIN$1 = 'tokenizer';

function createTokenizer(source, options = {}) {
  const location = options.location !== false;

  const _scnr = createScanner(source);

  const currentOffset = () => _scnr.index();

  const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());

  const _initLoc = currentPosition();

  const _initOffset = currentOffset();

  const _context = {
    currentType: 14
    /* EOF */
    ,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: 14
    /* EOF */
    ,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ''
  };

  const context = () => _context;

  const {
    onError
  } = options;

  function emitError(code, pos, offset, ...args) {
    const ctx = context();
    pos.column += offset;
    pos.offset += offset;

    if (onError) {
      const loc = createLocation(ctx.startLoc, pos);
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$1,
        args
      });
      onError(err);
    }
  }

  function getToken(context, type, value) {
    context.endLoc = currentPosition();
    context.currentType = type;
    const token = {
      type
    };

    if (location) {
      token.loc = createLocation(context.startLoc, context.endLoc);
    }

    if (value != null) {
      token.value = value;
    }

    return token;
  }

  const getEndToken = context => getToken(context, 14
  /* EOF */
  );

  function eat(scnr, ch) {
    if (scnr.currentChar() === ch) {
      scnr.next();
      return ch;
    } else {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
      return '';
    }
  }

  function peekSpaces(scnr) {
    let buf = '';

    while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
      buf += scnr.currentPeek();
      scnr.peek();
    }

    return buf;
  }

  function skipSpaces(scnr) {
    const buf = peekSpaces(scnr);
    scnr.skipToPeek();
    return buf;
  }

  function isIdentifierStart(ch) {
    if (ch === EOF) {
      return false;
    }

    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc === 95 // _
    ;
  }

  function isNumberStart(ch) {
    if (ch === EOF) {
      return false;
    }

    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57; // 0-9
  }

  function isNamedIdentifierStart(scnr, context) {
    const {
      currentType
    } = context;

    if (currentType !== 2
    /* BraceLeft */
    ) {
      return false;
    }

    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }

  function isListIdentifierStart(scnr, context) {
    const {
      currentType
    } = context;

    if (currentType !== 2
    /* BraceLeft */
    ) {
      return false;
    }

    peekSpaces(scnr);
    const ch = scnr.currentPeek() === '-' ? scnr.peek() : scnr.currentPeek();
    const ret = isNumberStart(ch);
    scnr.resetPeek();
    return ret;
  }

  function isLiteralStart(scnr, context) {
    const {
      currentType
    } = context;

    if (currentType !== 2
    /* BraceLeft */
    ) {
      return false;
    }

    peekSpaces(scnr);
    const ret = scnr.currentPeek() === LITERAL_DELIMITER;
    scnr.resetPeek();
    return ret;
  }

  function isLinkedDotStart(scnr, context) {
    const {
      currentType
    } = context;

    if (currentType !== 8
    /* LinkedAlias */
    ) {
      return false;
    }

    peekSpaces(scnr);
    const ret = scnr.currentPeek() === "."
    /* LinkedDot */
    ;
    scnr.resetPeek();
    return ret;
  }

  function isLinkedModifierStart(scnr, context) {
    const {
      currentType
    } = context;

    if (currentType !== 9
    /* LinkedDot */
    ) {
      return false;
    }

    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }

  function isLinkedDelimiterStart(scnr, context) {
    const {
      currentType
    } = context;

    if (!(currentType === 8
    /* LinkedAlias */
    || currentType === 12
    /* LinkedModifier */
    )) {
      return false;
    }

    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ":"
    /* LinkedDelimiter */
    ;
    scnr.resetPeek();
    return ret;
  }

  function isLinkedReferStart(scnr, context) {
    const {
      currentType
    } = context;

    if (currentType !== 10
    /* LinkedDelimiter */
    ) {
      return false;
    }

    const fn = () => {
      const ch = scnr.currentPeek();

      if (ch === "{"
      /* BraceLeft */
      ) {
        return isIdentifierStart(scnr.peek());
      } else if (ch === "@"
      /* LinkedAlias */
      || ch === "%"
      /* Modulo */
      || ch === "|"
      /* Pipe */
      || ch === ":"
      /* LinkedDelimiter */
      || ch === "."
      /* LinkedDot */
      || ch === CHAR_SP || !ch) {
        return false;
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn();
      } else {
        // other characters
        return isIdentifierStart(ch);
      }
    };

    const ret = fn();
    scnr.resetPeek();
    return ret;
  }

  function isPluralStart(scnr) {
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === "|"
    /* Pipe */
    ;
    scnr.resetPeek();
    return ret;
  }

  function detectModuloStart(scnr) {
    const spaces = peekSpaces(scnr);
    const ret = scnr.currentPeek() === "%"
    /* Modulo */
    && scnr.peek() === "{"
    /* BraceLeft */
    ;
    scnr.resetPeek();
    return {
      isModulo: ret,
      hasSpace: spaces.length > 0
    };
  }

  function isTextStart(scnr, reset = true) {
    const fn = (hasSpace = false, prev = '', detectModulo = false) => {
      const ch = scnr.currentPeek();

      if (ch === "{"
      /* BraceLeft */
      ) {
        return prev === "%"
        /* Modulo */
        ? false : hasSpace;
      } else if (ch === "@"
      /* LinkedAlias */
      || !ch) {
        return prev === "%"
        /* Modulo */
        ? true : hasSpace;
      } else if (ch === "%"
      /* Modulo */
      ) {
        scnr.peek();
        return fn(hasSpace, "%"
        /* Modulo */
        , true);
      } else if (ch === "|"
      /* Pipe */
      ) {
        return prev === "%"
        /* Modulo */
        || detectModulo ? true : !(prev === CHAR_SP || prev === CHAR_LF);
      } else if (ch === CHAR_SP) {
        scnr.peek();
        return fn(true, CHAR_SP, detectModulo);
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn(true, CHAR_LF, detectModulo);
      } else {
        return true;
      }
    };

    const ret = fn();
    reset && scnr.resetPeek();
    return ret;
  }

  function takeChar(scnr, fn) {
    const ch = scnr.currentChar();

    if (ch === EOF) {
      return EOF;
    }

    if (fn(ch)) {
      scnr.next();
      return ch;
    }

    return null;
  }

  function takeIdentifierChar(scnr) {
    const closure = ch => {
      const cc = ch.charCodeAt(0);
      return cc >= 97 && cc <= 122 || // a-z
      cc >= 65 && cc <= 90 || // A-Z
      cc >= 48 && cc <= 57 || // 0-9
      cc === 95 || // _
      cc === 36 // $
      ;
    };

    return takeChar(scnr, closure);
  }

  function takeDigit(scnr) {
    const closure = ch => {
      const cc = ch.charCodeAt(0);
      return cc >= 48 && cc <= 57; // 0-9
    };

    return takeChar(scnr, closure);
  }

  function takeHexDigit(scnr) {
    const closure = ch => {
      const cc = ch.charCodeAt(0);
      return cc >= 48 && cc <= 57 || // 0-9
      cc >= 65 && cc <= 70 || // A-F
      cc >= 97 && cc <= 102; // a-f
    };

    return takeChar(scnr, closure);
  }

  function getDigits(scnr) {
    let ch = '';
    let num = '';

    while (ch = takeDigit(scnr)) {
      num += ch;
    }

    return num;
  }

  function readModulo(scnr) {
    skipSpaces(scnr);
    const ch = scnr.currentChar();

    if (ch !== "%"
    /* Modulo */
    ) {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
    }

    scnr.next();
    return "%"
    /* Modulo */
    ;
  }

  function readText(scnr) {
    let buf = '';

    while (true) {
      const ch = scnr.currentChar();

      if (ch === "{"
      /* BraceLeft */
      || ch === "}"
      /* BraceRight */
      || ch === "@"
      /* LinkedAlias */
      || ch === "|"
      /* Pipe */
      || !ch) {
        break;
      } else if (ch === "%"
      /* Modulo */
      ) {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else {
          break;
        }
      } else if (ch === CHAR_SP || ch === CHAR_LF) {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else if (isPluralStart(scnr)) {
          break;
        } else {
          buf += ch;
          scnr.next();
        }
      } else {
        buf += ch;
        scnr.next();
      }
    }

    return buf;
  }

  function readNamedIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = '';
    let name = '';

    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }

    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }

    return name;
  }

  function readListIdentifier(scnr) {
    skipSpaces(scnr);
    let value = '';

    if (scnr.currentChar() === '-') {
      scnr.next();
      value += `-${getDigits(scnr)}`;
    } else {
      value += getDigits(scnr);
    }

    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }

    return value;
  }

  function readLiteral(scnr) {
    skipSpaces(scnr);
    eat(scnr, `\'`);
    let ch = '';
    let literal = '';

    const fn = x => x !== LITERAL_DELIMITER && x !== CHAR_LF;

    while (ch = takeChar(scnr, fn)) {
      if (ch === '\\') {
        literal += readEscapeSequence(scnr);
      } else {
        literal += ch;
      }
    }

    const current = scnr.currentChar();

    if (current === CHAR_LF || current === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, currentPosition(), 0); // TODO: Is it correct really?

      if (current === CHAR_LF) {
        scnr.next();
        eat(scnr, `\'`);
      }

      return literal;
    }

    eat(scnr, `\'`);
    return literal;
  }

  function readEscapeSequence(scnr) {
    const ch = scnr.currentChar();

    switch (ch) {
      case '\\':
      case `\'`:
        scnr.next();
        return `\\${ch}`;

      case 'u':
        return readUnicodeEscapeSequence(scnr, ch, 4);

      case 'U':
        return readUnicodeEscapeSequence(scnr, ch, 6);

      default:
        emitError(CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE, currentPosition(), 0, ch);
        return '';
    }
  }

  function readUnicodeEscapeSequence(scnr, unicode, digits) {
    eat(scnr, unicode);
    let sequence = '';

    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr);

      if (!ch) {
        emitError(CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
        break;
      }

      sequence += ch;
    }

    return `\\${unicode}${sequence}`;
  }

  function readInvalidIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = '';
    let identifiers = '';

    const closure = ch => ch !== "{"
    /* BraceLeft */
    && ch !== "}"
    /* BraceRight */
    && ch !== CHAR_SP && ch !== CHAR_LF;

    while (ch = takeChar(scnr, closure)) {
      identifiers += ch;
    }

    return identifiers;
  }

  function readLinkedModifier(scnr) {
    let ch = '';
    let name = '';

    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }

    return name;
  }

  function readLinkedRefer(scnr) {
    const fn = (detect = false, buf) => {
      const ch = scnr.currentChar();

      if (ch === "{"
      /* BraceLeft */
      || ch === "%"
      /* Modulo */
      || ch === "@"
      /* LinkedAlias */
      || ch === "|"
      /* Pipe */
      || !ch) {
        return buf;
      } else if (ch === CHAR_SP) {
        return buf;
      } else if (ch === CHAR_LF) {
        buf += ch;
        scnr.next();
        return fn(detect, buf);
      } else {
        buf += ch;
        scnr.next();
        return fn(true, buf);
      }
    };

    return fn(false, '');
  }

  function readPlural(scnr) {
    skipSpaces(scnr);
    const plural = eat(scnr, "|"
    /* Pipe */
    );
    skipSpaces(scnr);
    return plural;
  } // TODO: We need refactoring of token parsing ...


  function readTokenInPlaceholder(scnr, context) {
    let token = null;
    const ch = scnr.currentChar();

    switch (ch) {
      case "{"
      /* BraceLeft */
      :
        if (context.braceNest >= 1) {
          emitError(CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER, currentPosition(), 0);
        }

        scnr.next();
        token = getToken(context, 2
        /* BraceLeft */
        , "{"
        /* BraceLeft */
        );
        skipSpaces(scnr);
        context.braceNest++;
        return token;

      case "}"
      /* BraceRight */
      :
        if (context.braceNest > 0 && context.currentType === 2
        /* BraceLeft */
        ) {
          emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0);
        }

        scnr.next();
        token = getToken(context, 3
        /* BraceRight */
        , "}"
        /* BraceRight */
        );
        context.braceNest--;
        context.braceNest > 0 && skipSpaces(scnr);

        if (context.inLinked && context.braceNest === 0) {
          context.inLinked = false;
        }

        return token;

      case "@"
      /* LinkedAlias */
      :
        if (context.braceNest > 0) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
        }

        token = readTokenInLinked(scnr, context) || getEndToken(context);
        context.braceNest = 0;
        return token;

      default:
        let validNamedIdentifier = true;
        let validListIdentifier = true;
        let validLiteral = true;

        if (isPluralStart(scnr)) {
          if (context.braceNest > 0) {
            emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          }

          token = getToken(context, 1
          /* Pipe */
          , readPlural(scnr)); // reset

          context.braceNest = 0;
          context.inLinked = false;
          return token;
        }

        if (context.braceNest > 0 && (context.currentType === 5
        /* Named */
        || context.currentType === 6
        /* List */
        || context.currentType === 7
        /* Literal */
        )) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          context.braceNest = 0;
          return readToken(scnr, context);
        }

        if (validNamedIdentifier = isNamedIdentifierStart(scnr, context)) {
          token = getToken(context, 5
          /* Named */
          , readNamedIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }

        if (validListIdentifier = isListIdentifierStart(scnr, context)) {
          token = getToken(context, 6
          /* List */
          , readListIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }

        if (validLiteral = isLiteralStart(scnr, context)) {
          token = getToken(context, 7
          /* Literal */
          , readLiteral(scnr));
          skipSpaces(scnr);
          return token;
        }

        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          // TODO: we should be re-designed invalid cases, when we will extend message syntax near the future ...
          token = getToken(context, 13
          /* InvalidPlace */
          , readInvalidIdentifier(scnr));
          emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, token.value);
          skipSpaces(scnr);
          return token;
        }

        break;
    }

    return token;
  } // TODO: We need refactoring of token parsing ...


  function readTokenInLinked(scnr, context) {
    const {
      currentType
    } = context;
    let token = null;
    const ch = scnr.currentChar();

    if ((currentType === 8
    /* LinkedAlias */
    || currentType === 9
    /* LinkedDot */
    || currentType === 12
    /* LinkedModifier */
    || currentType === 10
    /* LinkedDelimiter */
    ) && (ch === CHAR_LF || ch === CHAR_SP)) {
      emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
    }

    switch (ch) {
      case "@"
      /* LinkedAlias */
      :
        scnr.next();
        token = getToken(context, 8
        /* LinkedAlias */
        , "@"
        /* LinkedAlias */
        );
        context.inLinked = true;
        return token;

      case "."
      /* LinkedDot */
      :
        skipSpaces(scnr);
        scnr.next();
        return getToken(context, 9
        /* LinkedDot */
        , "."
        /* LinkedDot */
        );

      case ":"
      /* LinkedDelimiter */
      :
        skipSpaces(scnr);
        scnr.next();
        return getToken(context, 10
        /* LinkedDelimiter */
        , ":"
        /* LinkedDelimiter */
        );

      default:
        if (isPluralStart(scnr)) {
          token = getToken(context, 1
          /* Pipe */
          , readPlural(scnr)); // reset

          context.braceNest = 0;
          context.inLinked = false;
          return token;
        }

        if (isLinkedDotStart(scnr, context) || isLinkedDelimiterStart(scnr, context)) {
          skipSpaces(scnr);
          return readTokenInLinked(scnr, context);
        }

        if (isLinkedModifierStart(scnr, context)) {
          skipSpaces(scnr);
          return getToken(context, 12
          /* LinkedModifier */
          , readLinkedModifier(scnr));
        }

        if (isLinkedReferStart(scnr, context)) {
          skipSpaces(scnr);

          if (ch === "{"
          /* BraceLeft */
          ) {
            // scan the placeholder
            return readTokenInPlaceholder(scnr, context) || token;
          } else {
            return getToken(context, 11
            /* LinkedKey */
            , readLinkedRefer(scnr));
          }
        }

        if (currentType === 8
        /* LinkedAlias */
        ) {
          emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
        }

        context.braceNest = 0;
        context.inLinked = false;
        return readToken(scnr, context);
    }
  } // TODO: We need refactoring of token parsing ...


  function readToken(scnr, context) {
    let token = {
      type: 14
      /* EOF */

    };

    if (context.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context) || getEndToken(context);
    }

    if (context.inLinked) {
      return readTokenInLinked(scnr, context) || getEndToken(context);
    }

    const ch = scnr.currentChar();

    switch (ch) {
      case "{"
      /* BraceLeft */
      :
        return readTokenInPlaceholder(scnr, context) || getEndToken(context);

      case "}"
      /* BraceRight */
      :
        emitError(CompileErrorCodes.UNBALANCED_CLOSING_BRACE, currentPosition(), 0);
        scnr.next();
        return getToken(context, 3
        /* BraceRight */
        , "}"
        /* BraceRight */
        );

      case "@"
      /* LinkedAlias */
      :
        return readTokenInLinked(scnr, context) || getEndToken(context);

      default:
        if (isPluralStart(scnr)) {
          token = getToken(context, 1
          /* Pipe */
          , readPlural(scnr)); // reset

          context.braceNest = 0;
          context.inLinked = false;
          return token;
        }

        const {
          isModulo,
          hasSpace
        } = detectModuloStart(scnr);

        if (isModulo) {
          return hasSpace ? getToken(context, 0
          /* Text */
          , readText(scnr)) : getToken(context, 4
          /* Modulo */
          , readModulo(scnr));
        }

        if (isTextStart(scnr)) {
          return getToken(context, 0
          /* Text */
          , readText(scnr));
        }

        break;
    }

    return token;
  }

  function nextToken() {
    const {
      currentType,
      offset,
      startLoc,
      endLoc
    } = _context;
    _context.lastType = currentType;
    _context.lastOffset = offset;
    _context.lastStartLoc = startLoc;
    _context.lastEndLoc = endLoc;
    _context.offset = currentOffset();
    _context.startLoc = currentPosition();

    if (_scnr.currentChar() === EOF) {
      return getToken(_context, 14
      /* EOF */
      );
    }

    return readToken(_scnr, _context);
  }

  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  };
}

const ERROR_DOMAIN = 'parser'; // Backslash backslash, backslash quote, uHHHH, UHHHHHH.

const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;

function fromEscapeSequence(match, codePoint4, codePoint6) {
  switch (match) {
    case `\\\\`:
      return `\\`;

    case `\\\'`:
      return `\'`;

    default:
      {
        const codePoint = parseInt(codePoint4 || codePoint6, 16);

        if (codePoint <= 0xd7ff || codePoint >= 0xe000) {
          return String.fromCodePoint(codePoint);
        } // invalid ...
        // Replace them with U+FFFD REPLACEMENT CHARACTER.


        return '�';
      }
  }
}

function createParser(options = {}) {
  const location = options.location !== false;
  const {
    onError
  } = options;

  function emitError(tokenzer, code, start, offset, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset;
    end.column += offset;

    if (onError) {
      const loc = createLocation(start, end);
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN,
        args
      });
      onError(err);
    }
  }

  function startNode(type, offset, loc) {
    const node = {
      type,
      start: offset,
      end: offset
    };

    if (location) {
      node.loc = {
        start: loc,
        end: loc
      };
    }

    return node;
  }

  function endNode(node, offset, pos, type) {
    node.end = offset;

    if (type) {
      node.type = type;
    }

    if (location && node.loc) {
      node.loc.end = pos;
    }
  }

  function parseText(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(3
    /* Text */
    , context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }

  function parseList(tokenizer, index) {
    const context = tokenizer.context();
    const {
      lastOffset: offset,
      lastStartLoc: loc
    } = context; // get brace left loc

    const node = startNode(5
    /* List */
    , offset, loc);
    node.index = parseInt(index, 10);
    tokenizer.nextToken(); // skip brach right

    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }

  function parseNamed(tokenizer, key) {
    const context = tokenizer.context();
    const {
      lastOffset: offset,
      lastStartLoc: loc
    } = context; // get brace left loc

    const node = startNode(4
    /* Named */
    , offset, loc);
    node.key = key;
    tokenizer.nextToken(); // skip brach right

    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }

  function parseLiteral(tokenizer, value) {
    const context = tokenizer.context();
    const {
      lastOffset: offset,
      lastStartLoc: loc
    } = context; // get brace left loc

    const node = startNode(9
    /* Literal */
    , offset, loc);
    node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
    tokenizer.nextToken(); // skip brach right

    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }

  function parseLinkedModifier(tokenizer) {
    const token = tokenizer.nextToken();
    const context = tokenizer.context();
    const {
      lastOffset: offset,
      lastStartLoc: loc
    } = context; // get linked dot loc

    const node = startNode(8
    /* LinkedModifier */
    , offset, loc);

    if (token.type !== 12
    /* LinkedModifier */
    ) {
      // empty modifier
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER, context.lastStartLoc, 0);
      node.value = '';
      endNode(node, offset, loc);
      return {
        nextConsumeToken: token,
        node
      };
    } // check token


    if (token.value == null) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }

    node.value = token.value || '';
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node
    };
  }

  function parseLinkedKey(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(7
    /* LinkedKey */
    , context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }

  function parseLinked(tokenizer) {
    const context = tokenizer.context();
    const linkedNode = startNode(6
    /* Linked */
    , context.offset, context.startLoc);
    let token = tokenizer.nextToken();

    if (token.type === 9
    /* LinkedDot */
    ) {
      const parsed = parseLinkedModifier(tokenizer);
      linkedNode.modifier = parsed.node;
      token = parsed.nextConsumeToken || tokenizer.nextToken();
    } // asset check token


    if (token.type !== 10
    /* LinkedDelimiter */
    ) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }

    token = tokenizer.nextToken(); // skip brace left

    if (token.type === 2
    /* BraceLeft */
    ) {
      token = tokenizer.nextToken();
    }

    switch (token.type) {
      case 11
      /* LinkedKey */
      :
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }

        linkedNode.key = parseLinkedKey(tokenizer, token.value || '');
        break;

      case 5
      /* Named */
      :
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }

        linkedNode.key = parseNamed(tokenizer, token.value || '');
        break;

      case 6
      /* List */
      :
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }

        linkedNode.key = parseList(tokenizer, token.value || '');
        break;

      case 7
      /* Literal */
      :
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }

        linkedNode.key = parseLiteral(tokenizer, token.value || '');
        break;

      default:
        // empty key
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY, context.lastStartLoc, 0);
        const nextContext = tokenizer.context();
        const emptyLinkedKeyNode = startNode(7
        /* LinkedKey */
        , nextContext.offset, nextContext.startLoc);
        emptyLinkedKeyNode.value = '';
        endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
        linkedNode.key = emptyLinkedKeyNode;
        endNode(linkedNode, nextContext.offset, nextContext.startLoc);
        return {
          nextConsumeToken: token,
          node: linkedNode
        };
    }

    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node: linkedNode
    };
  }

  function parseMessage(tokenizer) {
    const context = tokenizer.context();
    const startOffset = context.currentType === 1
    /* Pipe */
    ? tokenizer.currentOffset() : context.offset;
    const startLoc = context.currentType === 1
    /* Pipe */
    ? context.endLoc : context.startLoc;
    const node = startNode(2
    /* Message */
    , startOffset, startLoc);
    node.items = [];
    let nextToken = null;

    do {
      const token = nextToken || tokenizer.nextToken();
      nextToken = null;

      switch (token.type) {
        case 0
        /* Text */
        :
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }

          node.items.push(parseText(tokenizer, token.value || ''));
          break;

        case 6
        /* List */
        :
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }

          node.items.push(parseList(tokenizer, token.value || ''));
          break;

        case 5
        /* Named */
        :
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }

          node.items.push(parseNamed(tokenizer, token.value || ''));
          break;

        case 7
        /* Literal */
        :
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }

          node.items.push(parseLiteral(tokenizer, token.value || ''));
          break;

        case 8
        /* LinkedAlias */
        :
          const parsed = parseLinked(tokenizer);
          node.items.push(parsed.node);
          nextToken = parsed.nextConsumeToken || null;
          break;
      }
    } while (context.currentType !== 14
    /* EOF */
    && context.currentType !== 1
    /* Pipe */
    ); // adjust message node loc


    const endOffset = context.currentType === 1
    /* Pipe */
    ? context.lastOffset : tokenizer.currentOffset();
    const endLoc = context.currentType === 1
    /* Pipe */
    ? context.lastEndLoc : tokenizer.currentPosition();
    endNode(node, endOffset, endLoc);
    return node;
  }

  function parsePlural(tokenizer, offset, loc, msgNode) {
    const context = tokenizer.context();
    let hasEmptyMessage = msgNode.items.length === 0;
    const node = startNode(1
    /* Plural */
    , offset, loc);
    node.cases = [];
    node.cases.push(msgNode);

    do {
      const msg = parseMessage(tokenizer);

      if (!hasEmptyMessage) {
        hasEmptyMessage = msg.items.length === 0;
      }

      node.cases.push(msg);
    } while (context.currentType !== 14
    /* EOF */
    );

    if (hasEmptyMessage) {
      emitError(tokenizer, CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL, loc, 0);
    }

    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }

  function parseResource(tokenizer) {
    const context = tokenizer.context();
    const {
      offset,
      startLoc
    } = context;
    const msgNode = parseMessage(tokenizer);

    if (context.currentType === 14
    /* EOF */
    ) {
      return msgNode;
    } else {
      return parsePlural(tokenizer, offset, startLoc, msgNode);
    }
  }

  function parse(source) {
    const tokenizer = createTokenizer(source, assign({}, options));
    const context = tokenizer.context();
    const node = startNode(0
    /* Resource */
    , context.offset, context.startLoc);

    if (location && node.loc) {
      node.loc.source = source;
    }

    node.body = parseResource(tokenizer); // assert whether achieved to EOF

    if (context.currentType !== 14
    /* EOF */
    ) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, source[context.offset] || '');
    }

    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }

  return {
    parse
  };
}

function getTokenCaption(token) {
  if (token.type === 14
  /* EOF */
  ) {
    return 'EOF';
  }

  const name = (token.value || '').replace(/\r?\n/gu, '\\n');
  return name.length > 10 ? name.slice(0, 9) + '…' : name;
}

function createTransformer(ast, options = {} // eslint-disable-line
) {
  const _context = {
    ast,
    helpers: new Set()
  };

  const context = () => _context;

  const helper = name => {
    _context.helpers.add(name);

    return name;
  };

  return {
    context,
    helper
  };
}

function traverseNodes(nodes, transformer) {
  for (let i = 0; i < nodes.length; i++) {
    traverseNode(nodes[i], transformer);
  }
}

function traverseNode(node, transformer) {
  // TODO: if we need pre-hook of transform, should be implemented to here
  switch (node.type) {
    case 1
    /* Plural */
    :
      traverseNodes(node.cases, transformer);
      transformer.helper("plural"
      /* PLURAL */
      );
      break;

    case 2
    /* Message */
    :
      traverseNodes(node.items, transformer);
      break;

    case 6
    /* Linked */
    :
      const linked = node;
      traverseNode(linked.key, transformer);
      transformer.helper("linked"
      /* LINKED */
      );
      transformer.helper("type"
      /* TYPE */
      );
      break;

    case 5
    /* List */
    :
      transformer.helper("interpolate"
      /* INTERPOLATE */
      );
      transformer.helper("list"
      /* LIST */
      );
      break;

    case 4
    /* Named */
    :
      transformer.helper("interpolate"
      /* INTERPOLATE */
      );
      transformer.helper("named"
      /* NAMED */
      );
      break;
  } // TODO: if we need post-hook of transform, should be implemented to here

} // transform AST


function transform(ast, options = {} // eslint-disable-line
) {
  const transformer = createTransformer(ast);
  transformer.helper("normalize"
  /* NORMALIZE */
  ); // traverse

  ast.body && traverseNode(ast.body, transformer); // set meta information

  const context = transformer.context();
  ast.helpers = Array.from(context.helpers);
}

function createCodeGenerator(ast, options) {
  const {
    sourceMap,
    filename,
    breakLineCode,
    needIndent: _needIndent
  } = options;
  const _context = {
    source: ast.loc.source,
    filename,
    code: '',
    column: 1,
    line: 1,
    offset: 0,
    map: undefined,
    breakLineCode,
    needIndent: _needIndent,
    indentLevel: 0
  };

  const context = () => _context;

  function push(code, node) {
    _context.code += code;
  }

  function _newline(n, withBreakLine = true) {
    const _breakLineCode = withBreakLine ? breakLineCode : '';

    push(_needIndent ? _breakLineCode + `  `.repeat(n) : _breakLineCode);
  }

  function indent(withNewLine = true) {
    const level = ++_context.indentLevel;
    withNewLine && _newline(level);
  }

  function deindent(withNewLine = true) {
    const level = --_context.indentLevel;
    withNewLine && _newline(level);
  }

  function newline() {
    _newline(_context.indentLevel);
  }

  const helper = key => `_${key}`;

  const needIndent = () => _context.needIndent;

  return {
    context,
    push,
    indent,
    deindent,
    newline,
    helper,
    needIndent
  };
}

function generateLinkedNode(generator, node) {
  const {
    helper
  } = generator;
  generator.push(`${helper("linked"
  /* LINKED */
  )}(`);
  generateNode(generator, node.key);

  if (node.modifier) {
    generator.push(`, `);
    generateNode(generator, node.modifier);
    generator.push(`, _type`);
  } else {
    generator.push(`, undefined, _type`);
  }

  generator.push(`)`);
}

function generateMessageNode(generator, node) {
  const {
    helper,
    needIndent
  } = generator;
  generator.push(`${helper("normalize"
  /* NORMALIZE */
  )}([`);
  generator.indent(needIndent());
  const length = node.items.length;

  for (let i = 0; i < length; i++) {
    generateNode(generator, node.items[i]);

    if (i === length - 1) {
      break;
    }

    generator.push(', ');
  }

  generator.deindent(needIndent());
  generator.push('])');
}

function generatePluralNode(generator, node) {
  const {
    helper,
    needIndent
  } = generator;

  if (node.cases.length > 1) {
    generator.push(`${helper("plural"
    /* PLURAL */
    )}([`);
    generator.indent(needIndent());
    const length = node.cases.length;

    for (let i = 0; i < length; i++) {
      generateNode(generator, node.cases[i]);

      if (i === length - 1) {
        break;
      }

      generator.push(', ');
    }

    generator.deindent(needIndent());
    generator.push(`])`);
  }
}

function generateResource(generator, node) {
  if (node.body) {
    generateNode(generator, node.body);
  } else {
    generator.push('null');
  }
}

function generateNode(generator, node) {
  const {
    helper
  } = generator;

  switch (node.type) {
    case 0
    /* Resource */
    :
      generateResource(generator, node);
      break;

    case 1
    /* Plural */
    :
      generatePluralNode(generator, node);
      break;

    case 2
    /* Message */
    :
      generateMessageNode(generator, node);
      break;

    case 6
    /* Linked */
    :
      generateLinkedNode(generator, node);
      break;

    case 8
    /* LinkedModifier */
    :
      generator.push(JSON.stringify(node.value), node);
      break;

    case 7
    /* LinkedKey */
    :
      generator.push(JSON.stringify(node.value), node);
      break;

    case 5
    /* List */
    :
      generator.push(`${helper("interpolate"
      /* INTERPOLATE */
      )}(${helper("list"
      /* LIST */
      )}(${node.index}))`, node);
      break;

    case 4
    /* Named */
    :
      generator.push(`${helper("interpolate"
      /* INTERPOLATE */
      )}(${helper("named"
      /* NAMED */
      )}(${JSON.stringify(node.key)}))`, node);
      break;

    case 9
    /* Literal */
    :
      generator.push(JSON.stringify(node.value), node);
      break;

    case 3
    /* Text */
    :
      generator.push(JSON.stringify(node.value), node);
      break;

    default:
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`unhandled codegen node type: ${node.type}`);
      }

  }
} // generate code from AST


const generate = (ast, options = {} // eslint-disable-line
) => {
  const mode = isString(options.mode) ? options.mode : 'normal';
  const filename = isString(options.filename) ? options.filename : 'message.intl';
  const sourceMap = !!options.sourceMap; // prettier-ignore

  const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === 'arrow' ? ';' : '\n';
  const needIndent = options.needIndent ? options.needIndent : mode !== 'arrow';
  const helpers = ast.helpers || [];
  const generator = createCodeGenerator(ast, {
    mode,
    filename,
    sourceMap,
    breakLineCode,
    needIndent
  });
  generator.push(mode === 'normal' ? `function __msg__ (ctx) {` : `(ctx) => {`);
  generator.indent(needIndent);

  if (helpers.length > 0) {
    generator.push(`const { ${helpers.map(s => `${s}: _${s}`).join(', ')} } = ctx`);
    generator.newline();
  }

  generator.push(`return `);
  generateNode(generator, ast);
  generator.deindent(needIndent);
  generator.push(`}`);
  const {
    code,
    map
  } = generator.context();
  return {
    ast,
    code,
    map: map ? map.toJSON() : undefined // eslint-disable-line @typescript-eslint/no-explicit-any

  };
};

function baseCompile(source, options = {}) {
  const assignedOptions = assign({}, options); // parse source codes

  const parser = createParser(assignedOptions);
  const ast = parser.parse(source); // transform ASTs

  transform(ast, assignedOptions); // generate javascript codes

  return generate(ast, assignedOptions);
}

/*!
  * devtools-if v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const IntlifyDevToolsHooks = {
  I18nInit: 'i18n:init',
  FunctionTranslate: 'function:translate'
};

/*!
  * core-base v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const pathStateMachine = [];
pathStateMachine[0
/* BEFORE_PATH */
] = {
  ["w"
  /* WORKSPACE */
  ]: [0
  /* BEFORE_PATH */
  ],
  ["i"
  /* IDENT */
  ]: [3
  /* IN_IDENT */
  , 0
  /* APPEND */
  ],
  ["["
  /* LEFT_BRACKET */
  ]: [4
  /* IN_SUB_PATH */
  ],
  ["o"
  /* END_OF_FAIL */
  ]: [7
  /* AFTER_PATH */
  ]
};
pathStateMachine[1
/* IN_PATH */
] = {
  ["w"
  /* WORKSPACE */
  ]: [1
  /* IN_PATH */
  ],
  ["."
  /* DOT */
  ]: [2
  /* BEFORE_IDENT */
  ],
  ["["
  /* LEFT_BRACKET */
  ]: [4
  /* IN_SUB_PATH */
  ],
  ["o"
  /* END_OF_FAIL */
  ]: [7
  /* AFTER_PATH */
  ]
};
pathStateMachine[2
/* BEFORE_IDENT */
] = {
  ["w"
  /* WORKSPACE */
  ]: [2
  /* BEFORE_IDENT */
  ],
  ["i"
  /* IDENT */
  ]: [3
  /* IN_IDENT */
  , 0
  /* APPEND */
  ],
  ["0"
  /* ZERO */
  ]: [3
  /* IN_IDENT */
  , 0
  /* APPEND */
  ]
};
pathStateMachine[3
/* IN_IDENT */
] = {
  ["i"
  /* IDENT */
  ]: [3
  /* IN_IDENT */
  , 0
  /* APPEND */
  ],
  ["0"
  /* ZERO */
  ]: [3
  /* IN_IDENT */
  , 0
  /* APPEND */
  ],
  ["w"
  /* WORKSPACE */
  ]: [1
  /* IN_PATH */
  , 1
  /* PUSH */
  ],
  ["."
  /* DOT */
  ]: [2
  /* BEFORE_IDENT */
  , 1
  /* PUSH */
  ],
  ["["
  /* LEFT_BRACKET */
  ]: [4
  /* IN_SUB_PATH */
  , 1
  /* PUSH */
  ],
  ["o"
  /* END_OF_FAIL */
  ]: [7
  /* AFTER_PATH */
  , 1
  /* PUSH */
  ]
};
pathStateMachine[4
/* IN_SUB_PATH */
] = {
  ["'"
  /* SINGLE_QUOTE */
  ]: [5
  /* IN_SINGLE_QUOTE */
  , 0
  /* APPEND */
  ],
  ["\""
  /* DOUBLE_QUOTE */
  ]: [6
  /* IN_DOUBLE_QUOTE */
  , 0
  /* APPEND */
  ],
  ["["
  /* LEFT_BRACKET */
  ]: [4
  /* IN_SUB_PATH */
  , 2
  /* INC_SUB_PATH_DEPTH */
  ],
  ["]"
  /* RIGHT_BRACKET */
  ]: [1
  /* IN_PATH */
  , 3
  /* PUSH_SUB_PATH */
  ],
  ["o"
  /* END_OF_FAIL */
  ]: 8
  /* ERROR */
  ,
  ["l"
  /* ELSE */
  ]: [4
  /* IN_SUB_PATH */
  , 0
  /* APPEND */
  ]
};
pathStateMachine[5
/* IN_SINGLE_QUOTE */
] = {
  ["'"
  /* SINGLE_QUOTE */
  ]: [4
  /* IN_SUB_PATH */
  , 0
  /* APPEND */
  ],
  ["o"
  /* END_OF_FAIL */
  ]: 8
  /* ERROR */
  ,
  ["l"
  /* ELSE */
  ]: [5
  /* IN_SINGLE_QUOTE */
  , 0
  /* APPEND */
  ]
};
pathStateMachine[6
/* IN_DOUBLE_QUOTE */
] = {
  ["\""
  /* DOUBLE_QUOTE */
  ]: [4
  /* IN_SUB_PATH */
  , 0
  /* APPEND */
  ],
  ["o"
  /* END_OF_FAIL */
  ]: 8
  /* ERROR */
  ,
  ["l"
  /* ELSE */
  ]: [6
  /* IN_DOUBLE_QUOTE */
  , 0
  /* APPEND */
  ]
};
/**
 * Check if an expression is a literal value.
 */

const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;

function isLiteral(exp) {
  return literalValueRE.test(exp);
}
/**
 * Strip quotes from a string
 */


function stripQuotes(str) {
  const a = str.charCodeAt(0);
  const b = str.charCodeAt(str.length - 1);
  return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
}
/**
 * Determine the type of a character in a keypath.
 */


function getPathCharType(ch) {
  if (ch === undefined || ch === null) {
    return "o"
    /* END_OF_FAIL */
    ;
  }

  const code = ch.charCodeAt(0);

  switch (code) {
    case 0x5b: // [

    case 0x5d: // ]

    case 0x2e: // .

    case 0x22: // "

    case 0x27:
      // '
      return ch;

    case 0x5f: // _

    case 0x24: // $

    case 0x2d:
      // -
      return "i"
      /* IDENT */
      ;

    case 0x09: // Tab (HT)

    case 0x0a: // Newline (LF)

    case 0x0d: // Return (CR)

    case 0xa0: // No-break space (NBSP)

    case 0xfeff: // Byte Order Mark (BOM)

    case 0x2028: // Line Separator (LS)

    case 0x2029:
      // Paragraph Separator (PS)
      return "w"
      /* WORKSPACE */
      ;
  }

  return "i"
  /* IDENT */
  ;
}
/**
 * Format a subPath, return its plain form if it is
 * a literal string or number. Otherwise prepend the
 * dynamic indicator (*).
 */


function formatSubPath(path) {
  const trimmed = path.trim(); // invalid leading 0

  if (path.charAt(0) === '0' && isNaN(parseInt(path))) {
    return false;
  }

  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*"
  /* ASTARISK */
  + trimmed;
}
/**
 * Parse a string path into an array of segments
 */


function parse(path) {
  const keys = [];
  let index = -1;
  let mode = 0
  /* BEFORE_PATH */
  ;
  let subPathDepth = 0;
  let c;
  let key; // eslint-disable-line

  let newChar;
  let type;
  let transition;
  let action;
  let typeMap;
  const actions = [];

  actions[0
  /* APPEND */
  ] = () => {
    if (key === undefined) {
      key = newChar;
    } else {
      key += newChar;
    }
  };

  actions[1
  /* PUSH */
  ] = () => {
    if (key !== undefined) {
      keys.push(key);
      key = undefined;
    }
  };

  actions[2
  /* INC_SUB_PATH_DEPTH */
  ] = () => {
    actions[0
    /* APPEND */
    ]();
    subPathDepth++;
  };

  actions[3
  /* PUSH_SUB_PATH */
  ] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4
      /* IN_SUB_PATH */
      ;
      actions[0
      /* APPEND */
      ]();
    } else {
      subPathDepth = 0;

      if (key === undefined) {
        return false;
      }

      key = formatSubPath(key);

      if (key === false) {
        return false;
      } else {
        actions[1
        /* PUSH */
        ]();
      }
    }
  };

  function maybeUnescapeQuote() {
    const nextChar = path[index + 1];

    if (mode === 5
    /* IN_SINGLE_QUOTE */
    && nextChar === "'"
    /* SINGLE_QUOTE */
    || mode === 6
    /* IN_DOUBLE_QUOTE */
    && nextChar === "\""
    /* DOUBLE_QUOTE */
    ) {
      index++;
      newChar = '\\' + nextChar;
      actions[0
      /* APPEND */
      ]();
      return true;
    }
  }

  while (mode !== null) {
    index++;
    c = path[index];

    if (c === '\\' && maybeUnescapeQuote()) {
      continue;
    }

    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap["l"
    /* ELSE */
    ] || 8
    /* ERROR */
    ; // check parse error

    if (transition === 8
    /* ERROR */
    ) {
      return;
    }

    mode = transition[0];

    if (transition[1] !== undefined) {
      action = actions[transition[1]];

      if (action) {
        newChar = c;

        if (action() === false) {
          return;
        }
      }
    } // check parse finish


    if (mode === 7
    /* AFTER_PATH */
    ) {
      return keys;
    }
  }
} // path token cache


const cache = new Map();
/**
 * key-value message resolver
 *
 * @remarks
 * Resolves messages with the key-value structure. Note that messages with a hierarchical structure such as objects cannot be resolved
 *
 * @param obj - A target object to be resolved with path
 * @param path - A {@link Path | path} to resolve the value of message
 *
 * @returns A resolved {@link PathValue | path value}
 *
 * @VueI18nGeneral
 */

function resolveWithKeyValue(obj, path) {
  return isObject(obj) ? obj[path] : null;
}
/**
 * message resolver
 *
 * @remarks
 * Resolves messages. messages with a hierarchical structure such as objects can be resolved. This resolver is used in VueI18n as default.
 *
 * @param obj - A target object to be resolved with path
 * @param path - A {@link Path | path} to resolve the value of message
 *
 * @returns A resolved {@link PathValue | path value}
 *
 * @VueI18nGeneral
 */


function resolveValue(obj, path) {
  // check object
  if (!isObject(obj)) {
    return null;
  } // parse path


  let hit = cache.get(path);

  if (!hit) {
    hit = parse(path);

    if (hit) {
      cache.set(path, hit);
    }
  } // check hit


  if (!hit) {
    return null;
  } // resolve path value


  const len = hit.length;
  let last = obj;
  let i = 0;

  while (i < len) {
    const val = last[hit[i]];

    if (val === undefined) {
      return null;
    }

    last = val;
    i++;
  }

  return last;
}

const DEFAULT_MODIFIER = str => str;

const DEFAULT_MESSAGE = ctx => ''; // eslint-disable-line


const DEFAULT_MESSAGE_DATA_TYPE = 'text';

const DEFAULT_NORMALIZE = values => values.length === 0 ? '' : values.join('');

const DEFAULT_INTERPOLATE = toDisplayString;

function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);

  if (choicesLength === 2) {
    // prettier-ignore
    return choice ? choice > 1 ? 1 : 0 : 1;
  }

  return choice ? Math.min(choice, 2) : 0;
}

function getPluralIndex(options) {
  // prettier-ignore
  const index = isNumber(options.pluralIndex) ? options.pluralIndex : -1; // prettier-ignore

  return options.named && (isNumber(options.named.count) || isNumber(options.named.n)) ? isNumber(options.named.count) ? options.named.count : isNumber(options.named.n) ? options.named.n : index : index;
}

function normalizeNamed(pluralIndex, props) {
  if (!props.count) {
    props.count = pluralIndex;
  }

  if (!props.n) {
    props.n = pluralIndex;
  }
}

function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isObject(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = isObject(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? pluralDefault : undefined;

  const plural = messages => {
    return messages[pluralRule(pluralIndex, messages.length, orgPluralRule)];
  };

  const _list = options.list || [];

  const list = index => _list[index]; // eslint-disable-next-line @typescript-eslint/no-explicit-any


  const _named = options.named || {};

  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named);

  const named = key => _named[key];

  function message(key) {
    // prettier-ignore
    const msg = isFunction(options.messages) ? options.messages(key) : isObject(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) // resolve from parent messages
    : DEFAULT_MESSAGE : msg;
  }

  const _modifier = name => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;

  const normalize = isPlainObject(options.processor) && isFunction(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isPlainObject(options.processor) && isFunction(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const type = isPlainObject(options.processor) && isString(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;

  const linked = (key, ...args) => {
    const [arg1, arg2] = args;
    let type = 'text';
    let modifier = '';

    if (args.length === 1) {
      if (isObject(arg1)) {
        modifier = arg1.modifier || modifier;
        type = arg1.type || type;
      } else if (isString(arg1)) {
        modifier = arg1 || modifier;
      }
    } else if (args.length === 2) {
      if (isString(arg1)) {
        modifier = arg1 || modifier;
      }

      if (isString(arg2)) {
        type = arg2 || type;
      }
    }

    let msg = message(key)(ctx); // The message in vnode resolved with linked are returned as an array by processor.nomalize

    if (type === 'vnode' && isArray(msg) && modifier) {
      msg = msg[0];
    }

    return modifier ? _modifier(modifier)(msg, type) : msg;
  };

  const ctx = {
    ["list"
    /* LIST */
    ]: list,
    ["named"
    /* NAMED */
    ]: named,
    ["plural"
    /* PLURAL */
    ]: plural,
    ["linked"
    /* LINKED */
    ]: linked,
    ["message"
    /* MESSAGE */
    ]: message,
    ["type"
    /* TYPE */
    ]: type,
    ["interpolate"
    /* INTERPOLATE */
    ]: interpolate,
    ["normalize"
    /* NORMALIZE */
    ]: normalize
  };
  return ctx;
}

let devtools = null;

function setDevToolsHook(hook) {
  devtools = hook;
}

function initI18nDevTools(i18n, version, meta) {
  // TODO: queue if devtools is undefined
  devtools && devtools.emit(IntlifyDevToolsHooks.I18nInit, {
    timestamp: Date.now(),
    i18n,
    version,
    meta
  });
}

const translateDevTools = /* #__PURE__*/createDevToolsHook(IntlifyDevToolsHooks.FunctionTranslate);

function createDevToolsHook(hook) {
  return payloads => devtools && devtools.emit(hook, payloads);
}

const CoreWarnCodes = {
  NOT_FOUND_KEY: 1,
  FALLBACK_TO_TRANSLATE: 2,
  CANNOT_FORMAT_NUMBER: 3,
  FALLBACK_TO_NUMBER_FORMAT: 4,
  CANNOT_FORMAT_DATE: 5,
  FALLBACK_TO_DATE_FORMAT: 6,
  __EXTEND_POINT__: 7
};
/** @internal */

const warnMessages$1 = {
  [CoreWarnCodes.NOT_FOUND_KEY]: `Not found '{key}' key in '{locale}' locale messages.`,
  [CoreWarnCodes.FALLBACK_TO_TRANSLATE]: `Fall back to translate '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.CANNOT_FORMAT_NUMBER]: `Cannot format a number value due to not supported Intl.NumberFormat.`,
  [CoreWarnCodes.FALLBACK_TO_NUMBER_FORMAT]: `Fall back to number format '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.CANNOT_FORMAT_DATE]: `Cannot format a date value due to not supported Intl.DateTimeFormat.`,
  [CoreWarnCodes.FALLBACK_TO_DATE_FORMAT]: `Fall back to datetime format '{key}' key with '{target}' locale.`
};

function getWarnMessage$1(code, ...args) {
  return format(warnMessages$1[code], ...args);
}
/**
 * Fallback with simple implemenation
 *
 * @remarks
 * A fallback locale function implemented with a simple fallback algorithm.
 *
 * Basically, it returns the value as specified in the `fallbackLocale` props, and is processed with the fallback inside intlify.
 *
 * @param ctx - A {@link CoreContext | context}
 * @param fallback - A {@link FallbackLocale | fallback locale}
 * @param start - A starting {@link Locale | locale}
 *
 * @returns Fallback locales
 *
 * @VueI18nGeneral
 */


function fallbackWithSimple(ctx, fallback, start // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  // prettier-ignore
  return [...new Set([start, ...(isArray(fallback) ? fallback : isObject(fallback) ? Object.keys(fallback) : isString(fallback) ? [fallback] : [start])])];
}
/**
 * Fallback with locale chain
 *
 * @remarks
 * A fallback locale function implemented with a fallback chain algorithm. It's used in VueI18n as default.
 *
 * @param ctx - A {@link CoreContext | context}
 * @param fallback - A {@link FallbackLocale | fallback locale}
 * @param start - A starting {@link Locale | locale}
 *
 * @returns Fallback locales
 *
 * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
 *
 * @VueI18nGeneral
 */


function fallbackWithLocaleChain(ctx, fallback, start) {
  const startLocale = isString(start) ? start : DEFAULT_LOCALE;
  const context = ctx;

  if (!context.__localeChainCache) {
    context.__localeChainCache = new Map();
  }

  let chain = context.__localeChainCache.get(startLocale);

  if (!chain) {
    chain = []; // first block defined by start

    let block = [start]; // while any intervening block found

    while (isArray(block)) {
      block = appendBlockToChain(chain, block, fallback);
    } // prettier-ignore
    // last block defined by default


    const defaults = isArray(fallback) || !isPlainObject(fallback) ? fallback : fallback['default'] ? fallback['default'] : null; // convert defaults to array

    block = isString(defaults) ? [defaults] : defaults;

    if (isArray(block)) {
      appendBlockToChain(chain, block, false);
    }

    context.__localeChainCache.set(startLocale, chain);
  }

  return chain;
}

function appendBlockToChain(chain, block, blocks) {
  let follow = true;

  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i];

    if (isString(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks);
    }
  }

  return follow;
}

function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split('-');

  do {
    const target = tokens.join('-');
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);

  return follow;
}

function appendItemToChain(chain, target, blocks) {
  let follow = false;

  if (!chain.includes(target)) {
    follow = true;

    if (target) {
      follow = target[target.length - 1] !== '!';
      const locale = target.replace(/!/g, '');
      chain.push(locale);

      if ((isArray(blocks) || isPlainObject(blocks)) && blocks[locale] // eslint-disable-line @typescript-eslint/no-explicit-any
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        follow = blocks[locale];
      }
    }
  }

  return follow;
}
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Intlify core-base version
 * @internal
 */


const VERSION$1 = '9.2.2';
const NOT_REOSLVED = -1;
const DEFAULT_LOCALE = 'en-US';
const MISSING_RESOLVE_VALUE = '';

const capitalize = str => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;

function getDefaultLinkedModifiers() {
  return {
    upper: (val, type) => {
      // prettier-ignore
      return type === 'text' && isString(val) ? val.toUpperCase() : type === 'vnode' && isObject(val) && '__v_isVNode' in val ? val.children.toUpperCase() : val;
    },
    lower: (val, type) => {
      // prettier-ignore
      return type === 'text' && isString(val) ? val.toLowerCase() : type === 'vnode' && isObject(val) && '__v_isVNode' in val ? val.children.toLowerCase() : val;
    },
    capitalize: (val, type) => {
      // prettier-ignore
      return type === 'text' && isString(val) ? capitalize(val) : type === 'vnode' && isObject(val) && '__v_isVNode' in val ? capitalize(val.children) : val;
    }
  };
}

let _compiler;

function registerMessageCompiler(compiler) {
  _compiler = compiler;
}

let _resolver;
/**
 * Register the message resolver
 *
 * @param resolver - A {@link MessageResolver} function
 *
 * @VueI18nGeneral
 */


function registerMessageResolver(resolver) {
  _resolver = resolver;
}

let _fallbacker;
/**
 * Register the locale fallbacker
 *
 * @param fallbacker - A {@link LocaleFallbacker} function
 *
 * @VueI18nGeneral
 */


function registerLocaleFallbacker(fallbacker) {
  _fallbacker = fallbacker;
} // Additional Meta for Intlify DevTools


let _additionalMeta = null;

const setAdditionalMeta = meta => {
  _additionalMeta = meta;
};

const getAdditionalMeta = () => _additionalMeta;

let _fallbackContext = null;

const setFallbackContext = context => {
  _fallbackContext = context;
};

const getFallbackContext = () => _fallbackContext; // ID for CoreContext


let _cid = 0;

function createCoreContext(options = {}) {
  // setup options
  const version = isString(options.version) ? options.version : VERSION$1;
  const locale = isString(options.locale) ? options.locale : DEFAULT_LOCALE;
  const fallbackLocale = isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || isString(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : locale;
  const messages = isPlainObject(options.messages) ? options.messages : {
    [locale]: {}
  };
  const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : {
    [locale]: {}
  };
  const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : {
    [locale]: {}
  };
  const modifiers = assign({}, options.modifiers || {}, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || {};
  const missing = isFunction(options.missing) ? options.missing : null;
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction(options.messageCompiler) ? options.messageCompiler : _compiler;
  const messageResolver = isFunction(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
  const localeFallbacker = isFunction(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
  const fallbackContext = isObject(options.fallbackContext) ? options.fallbackContext : undefined;
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn; // setup internal options

  const internalOptions = options;

  const __datetimeFormatters = isObject(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : new Map();

  const __numberFormatters = isObject(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : new Map();

  const __meta = isObject(internalOptions.__meta) ? internalOptions.__meta : {};

  _cid++;
  const context = {
    version,
    cid: _cid,
    locale,
    fallbackLocale,
    messages,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  };
  {
    context.datetimeFormats = datetimeFormats;
    context.numberFormats = numberFormats;
    context.__datetimeFormatters = __datetimeFormatters;
    context.__numberFormatters = __numberFormatters;
  } // for vue-devtools timeline event

  if (process.env.NODE_ENV !== 'production') {
    context.__v_emitter = internalOptions.__v_emitter != null ? internalOptions.__v_emitter : undefined;
  } // NOTE: experimental !!


  if (process.env.NODE_ENV !== 'production' || __INTLIFY_PROD_DEVTOOLS__) {
    initI18nDevTools(context, version, __meta);
  }

  return context;
}
/** @internal */


function isTranslateFallbackWarn(fallback, key) {
  return fallback instanceof RegExp ? fallback.test(key) : fallback;
}
/** @internal */


function isTranslateMissingWarn(missing, key) {
  return missing instanceof RegExp ? missing.test(key) : missing;
}
/** @internal */


function handleMissing(context, key, locale, missingWarn, type) {
  const {
    missing,
    onWarn
  } = context; // for vue-devtools timeline event

  if (process.env.NODE_ENV !== 'production') {
    const emitter = context.__v_emitter;

    if (emitter) {
      emitter.emit("missing"
      /* MISSING */
      , {
        locale,
        key,
        type,
        groupId: `${type}:${key}`
      });
    }
  }

  if (missing !== null) {
    const ret = missing(context, locale, key, type);
    return isString(ret) ? ret : key;
  } else {
    if (process.env.NODE_ENV !== 'production' && isTranslateMissingWarn(missingWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.NOT_FOUND_KEY, {
        key,
        locale
      }));
    }

    return key;
  }
}
/** @internal */


function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = new Map();
  ctx.localeFallbacker(ctx, fallback, locale);
}
/* eslint-enable @typescript-eslint/no-explicit-any */


const RE_HTML_TAG = /<\/?[\w\s="/.':;#-\/]+>/;
const WARN_MESSAGE = `Detected HTML in '{source}' message. Recommend not using HTML messages to avoid XSS.`;

function checkHtmlMessage(source, options) {
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;

  if (warnHtmlMessage && RE_HTML_TAG.test(source)) {
    warn(format(WARN_MESSAGE, {
      source
    }));
  }
}

const defaultOnCacheKey = source => source;

let compileCache = Object.create(null);

function compileToFunction(source, options = {}) {
  {
    // check HTML message
    process.env.NODE_ENV !== 'production' && checkHtmlMessage(source, options); // check caches

    const onCacheKey = options.onCacheKey || defaultOnCacheKey;
    const key = onCacheKey(source);
    const cached = compileCache[key];

    if (cached) {
      return cached;
    } // compile error detecting


    let occurred = false;
    const onError = options.onError || defaultOnError;

    options.onError = err => {
      occurred = true;
      onError(err);
    }; // compile


    const {
      code
    } = baseCompile(source, options); // evaluate function

    const msg = new Function(`return ${code}`)(); // if occurred compile error, don't cache

    return !occurred ? compileCache[key] = msg : msg;
  }
}

let code$2 = CompileErrorCodes.__EXTEND_POINT__;

const inc$2 = () => ++code$2;

const CoreErrorCodes = {
  INVALID_ARGUMENT: code$2,
  INVALID_DATE_ARGUMENT: inc$2(),
  INVALID_ISO_DATE_ARGUMENT: inc$2(),
  __EXTEND_POINT__: inc$2() // 18

};

function createCoreError(code) {
  return createCompileError(code, null, process.env.NODE_ENV !== 'production' ? {
    messages: errorMessages$1
  } : undefined);
}
/** @internal */


const errorMessages$1 = {
  [CoreErrorCodes.INVALID_ARGUMENT]: 'Invalid arguments',
  [CoreErrorCodes.INVALID_DATE_ARGUMENT]: 'The date provided is an invalid Date object.' + 'Make sure your Date represents a valid date.',
  [CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT]: 'The argument provided is not a valid ISO date string'
};

const NOOP_MESSAGE_FUNCTION = () => '';

const isMessageFunction = val => isFunction(val); // implementation of `translate` function


function translate(context, ...args) {
  const {
    fallbackFormat,
    postTranslation,
    unresolving,
    messageCompiler,
    fallbackLocale,
    messages
  } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage; // prettier-ignore

  const defaultMsgOrKey = isString(options.default) || isBoolean(options.default) // default by function option
  ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat // default by `fallbackFormat` option
  ? !messageCompiler ? () => key : key : '';
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey !== '';
  const locale = isString(options.locale) ? options.locale : context.locale; // escape params

  escapeParameter && escapeParams(options); // resolve message format
  // eslint-disable-next-line prefer-const

  let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [key, locale, messages[locale] || {}]; // NOTE:
  //  Fix to work around `ssrTransfrom` bug in Vite.
  //  https://github.com/vitejs/vite/issues/4306
  //  To get around this, use temporary variables.
  //  https://github.com/nuxt/framework/issues/1461#issuecomment-954606243

  let format = formatScope; // if you use default message, set it as message format!

  let cacheBaseKey = key;

  if (!resolvedMessage && !(isString(format) || isMessageFunction(format))) {
    if (enableDefaultMsg) {
      format = defaultMsgOrKey;
      cacheBaseKey = format;
    }
  } // checking message format and target locale


  if (!resolvedMessage && (!(isString(format) || isMessageFunction(format)) || !isString(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }

  if (process.env.NODE_ENV !== 'production' && isString(format) && context.messageCompiler == null) {
    warn(`The message format compilation is not supported in this build. ` + `Because message compiler isn't included. ` + `You need to pre-compilation all message format. ` + `So translate function return '${key}'.`);
    return key;
  } // setup compile error detecting


  let occurred = false;

  const errorDetector = () => {
    occurred = true;
  }; // compile message format


  const msg = !isMessageFunction(format) ? compileMessageFormat(context, key, targetLocale, format, cacheBaseKey, errorDetector) : format; // if occurred compile error, return the message format

  if (occurred) {
    return format;
  } // evaluate message with context


  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext); // if use post translation option, proceed it with handler

  const ret = postTranslation ? postTranslation(messaged, key) : messaged; // NOTE: experimental !!

  if (process.env.NODE_ENV !== 'production' || __INTLIFY_PROD_DEVTOOLS__) {
    // prettier-ignore
    const payloads = {
      timestamp: Date.now(),
      key: isString(key) ? key : isMessageFunction(format) ? format.key : '',
      locale: targetLocale || (isMessageFunction(format) ? format.locale : ''),
      format: isString(format) ? format : isMessageFunction(format) ? format.source : '',
      message: ret
    };
    payloads.meta = assign({}, context.__meta, getAdditionalMeta() || {});
    translateDevTools(payloads);
  }

  return ret;
}

function escapeParams(options) {
  if (isArray(options.list)) {
    options.list = options.list.map(item => isString(item) ? escapeHtml(item) : item);
  } else if (isObject(options.named)) {
    Object.keys(options.named).forEach(key => {
      if (isString(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}

function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const {
    messages,
    onWarn,
    messageResolver: resolveValue,
    localeFallbacker
  } = context;
  const locales = localeFallbacker(context, fallbackLocale, locale); // eslint-disable-line @typescript-eslint/no-explicit-any

  let message = {};
  let targetLocale;
  let format = null;
  let from = locale;
  let to = null;
  const type = 'translate';

  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i];

    if (process.env.NODE_ENV !== 'production' && locale !== targetLocale && isTranslateFallbackWarn(fallbackWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.FALLBACK_TO_TRANSLATE, {
        key,
        target: targetLocale
      }));
    } // for vue-devtools timeline event


    if (process.env.NODE_ENV !== 'production' && locale !== targetLocale) {
      const emitter = context.__v_emitter;

      if (emitter) {
        emitter.emit("fallback"
        /* FALBACK */
        , {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        });
      }
    }

    message = messages[targetLocale] || {}; // for vue-devtools timeline event

    let start = null;
    let startTag;
    let endTag;

    if (process.env.NODE_ENV !== 'production' && inBrowser) {
      start = window.performance.now();
      startTag = 'intlify-message-resolve-start';
      endTag = 'intlify-message-resolve-end';
      mark && mark(startTag);
    }

    if ((format = resolveValue(message, key)) === null) {
      // if null, resolve with object key path
      format = message[key]; // eslint-disable-line @typescript-eslint/no-explicit-any
    } // for vue-devtools timeline event


    if (process.env.NODE_ENV !== 'production' && inBrowser) {
      const end = window.performance.now();
      const emitter = context.__v_emitter;

      if (emitter && start && format) {
        emitter.emit("message-resolve"
        /* MESSAGE_RESOLVE */
        , {
          type: "message-resolve"
          /* MESSAGE_RESOLVE */
          ,
          key,
          message: format,
          time: end - start,
          groupId: `${type}:${key}`
        });
      }

      if (startTag && endTag && mark && measure) {
        mark(endTag);
        measure('intlify message resolve', startTag, endTag);
      }
    }

    if (isString(format) || isFunction(format)) break;
    const missingRet = handleMissing(context, // eslint-disable-line @typescript-eslint/no-explicit-any
    key, targetLocale, missingWarn, type);

    if (missingRet !== key) {
      format = missingRet;
    }

    from = to;
  }

  return [format, targetLocale, message];
}

function compileMessageFormat(context, key, targetLocale, format, cacheBaseKey, errorDetector) {
  const {
    messageCompiler,
    warnHtmlMessage
  } = context;

  if (isMessageFunction(format)) {
    const msg = format;
    msg.locale = msg.locale || targetLocale;
    msg.key = msg.key || key;
    return msg;
  }

  if (messageCompiler == null) {
    const msg = () => format;

    msg.locale = targetLocale;
    msg.key = key;
    return msg;
  } // for vue-devtools timeline event


  let start = null;
  let startTag;
  let endTag;

  if (process.env.NODE_ENV !== 'production' && inBrowser) {
    start = window.performance.now();
    startTag = 'intlify-message-compilation-start';
    endTag = 'intlify-message-compilation-end';
    mark && mark(startTag);
  }

  const msg = messageCompiler(format, getCompileOptions(context, targetLocale, cacheBaseKey, format, warnHtmlMessage, errorDetector)); // for vue-devtools timeline event

  if (process.env.NODE_ENV !== 'production' && inBrowser) {
    const end = window.performance.now();
    const emitter = context.__v_emitter;

    if (emitter && start) {
      emitter.emit("message-compilation"
      /* MESSAGE_COMPILATION */
      , {
        type: "message-compilation"
        /* MESSAGE_COMPILATION */
        ,
        message: format,
        time: end - start,
        groupId: `${'translate'}:${key}`
      });
    }

    if (startTag && endTag && mark && measure) {
      mark(endTag);
      measure('intlify message compilation', startTag, endTag);
    }
  }

  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format;
  return msg;
}

function evaluateMessage(context, msg, msgCtx) {
  // for vue-devtools timeline event
  let start = null;
  let startTag;
  let endTag;

  if (process.env.NODE_ENV !== 'production' && inBrowser) {
    start = window.performance.now();
    startTag = 'intlify-message-evaluation-start';
    endTag = 'intlify-message-evaluation-end';
    mark && mark(startTag);
  }

  const messaged = msg(msgCtx); // for vue-devtools timeline event

  if (process.env.NODE_ENV !== 'production' && inBrowser) {
    const end = window.performance.now();
    const emitter = context.__v_emitter;

    if (emitter && start) {
      emitter.emit("message-evaluation"
      /* MESSAGE_EVALUATION */
      , {
        type: "message-evaluation"
        /* MESSAGE_EVALUATION */
        ,
        value: messaged,
        time: end - start,
        groupId: `${'translate'}:${msg.key}`
      });
    }

    if (startTag && endTag && mark && measure) {
      mark(endTag);
      measure('intlify message evaluation', startTag, endTag);
    }
  }

  return messaged;
}
/** @internal */


function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = {};

  if (!isString(arg1) && !isNumber(arg1) && !isMessageFunction(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  } // prettier-ignore


  const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;

  if (isNumber(arg2)) {
    options.plural = arg2;
  } else if (isString(arg2)) {
    options.default = arg2;
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2;
  } else if (isArray(arg2)) {
    options.list = arg2;
  }

  if (isNumber(arg3)) {
    options.plural = arg3;
  } else if (isString(arg3)) {
    options.default = arg3;
  } else if (isPlainObject(arg3)) {
    assign(options, arg3);
  }

  return [key, options];
}

function getCompileOptions(context, locale, key, source, warnHtmlMessage, errorDetector) {
  return {
    warnHtmlMessage,
    onError: err => {
      errorDetector && errorDetector(err);

      if (process.env.NODE_ENV !== 'production') {
        const message = `Message compilation error: ${err.message}`;
        const codeFrame = err.location && generateCodeFrame(source, err.location.start.offset, err.location.end.offset);
        const emitter = context.__v_emitter;

        if (emitter) {
          emitter.emit("compile-error"
          /* COMPILE_ERROR */
          , {
            message: source,
            error: err.message,
            start: err.location && err.location.start.offset,
            end: err.location && err.location.end.offset,
            groupId: `${'translate'}:${key}`
          });
        }

        console.error(codeFrame ? `${message}\n${codeFrame}` : message);
      } else {
        throw err;
      }
    },
    onCacheKey: source => generateFormatCacheKey(locale, key, source)
  };
}

function getMessageContextOptions(context, locale, message, options) {
  const {
    modifiers,
    pluralRules,
    messageResolver: resolveValue,
    fallbackLocale,
    fallbackWarn,
    missingWarn,
    fallbackContext
  } = context;

  const resolveMessage = key => {
    let val = resolveValue(message, key); // fallback to root context

    if (val == null && fallbackContext) {
      const [,, message] = resolveMessageFormat(fallbackContext, key, locale, fallbackLocale, fallbackWarn, missingWarn);
      val = resolveValue(message, key);
    }

    if (isString(val)) {
      let occurred = false;

      const errorDetector = () => {
        occurred = true;
      };

      const msg = compileMessageFormat(context, key, locale, val, key, errorDetector);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      // TODO: should be implemented warning message
      return NOOP_MESSAGE_FUNCTION;
    }
  };

  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };

  if (context.processor) {
    ctxOptions.processor = context.processor;
  }

  if (options.list) {
    ctxOptions.list = options.list;
  }

  if (options.named) {
    ctxOptions.named = options.named;
  }

  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }

  return ctxOptions;
}

const intlDefined = typeof Intl !== 'undefined';
const Availabilities = {
  dateTimeFormat: intlDefined && typeof Intl.DateTimeFormat !== 'undefined',
  numberFormat: intlDefined && typeof Intl.NumberFormat !== 'undefined'
}; // implementation of `datetime` function

function datetime(context, ...args) {
  const {
    datetimeFormats,
    unresolving,
    fallbackLocale,
    onWarn,
    localeFallbacker
  } = context;
  const {
    __datetimeFormatters
  } = context;

  if (process.env.NODE_ENV !== 'production' && !Availabilities.dateTimeFormat) {
    onWarn(getWarnMessage$1(CoreWarnCodes.CANNOT_FORMAT_DATE));
    return MISSING_RESOLVE_VALUE;
  }

  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = isString(options.locale) ? options.locale : context.locale;
  const locales = localeFallbacker(context, // eslint-disable-line @typescript-eslint/no-explicit-any
  fallbackLocale, locale);

  if (!isString(key) || key === '') {
    return new Intl.DateTimeFormat(locale, overrides).format(value);
  } // resolve format


  let datetimeFormat = {};
  let targetLocale;
  let format = null;
  let from = locale;
  let to = null;
  const type = 'datetime format';

  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i];

    if (process.env.NODE_ENV !== 'production' && locale !== targetLocale && isTranslateFallbackWarn(fallbackWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.FALLBACK_TO_DATE_FORMAT, {
        key,
        target: targetLocale
      }));
    } // for vue-devtools timeline event


    if (process.env.NODE_ENV !== 'production' && locale !== targetLocale) {
      const emitter = context.__v_emitter;

      if (emitter) {
        emitter.emit("fallback"
        /* FALBACK */
        , {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        });
      }
    }

    datetimeFormat = datetimeFormats[targetLocale] || {};
    format = datetimeFormat[key];
    if (isPlainObject(format)) break;
    handleMissing(context, key, targetLocale, missingWarn, type); // eslint-disable-line @typescript-eslint/no-explicit-any

    from = to;
  } // checking format and target locale


  if (!isPlainObject(format) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }

  let id = `${targetLocale}__${key}`;

  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }

  let formatter = __datetimeFormatters.get(id);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign({}, format, overrides));

    __datetimeFormatters.set(id, formatter);
  }

  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
/** @internal */


const DATETIME_FORMAT_OPTIONS_KEYS = ['localeMatcher', 'weekday', 'era', 'year', 'month', 'day', 'hour', 'minute', 'second', 'timeZoneName', 'formatMatcher', 'hour12', 'timeZone', 'dateStyle', 'timeStyle', 'calendar', 'dayPeriod', 'numberingSystem', 'hourCycle', 'fractionalSecondDigits'];
/** @internal */

function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = {};
  let overrides = {};
  let value;

  if (isString(arg1)) {
    // Only allow ISO strings - other date formats are often supported,
    // but may cause different results in different browsers.
    const matches = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);

    if (!matches) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    } // Some browsers can not parse the iso datetime separated by space,
    // this is a compromise solution by replace the 'T'/' ' with 'T'


    const dateTime = matches[3] ? matches[3].trim().startsWith('T') ? `${matches[1].trim()}${matches[3].trim()}` : `${matches[1].trim()}T${matches[3].trim()}` : matches[1].trim();
    value = new Date(dateTime);

    try {
      // This will fail if the date is not valid
      value.toISOString();
    } catch (e) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
    }

    value = arg1;
  } else if (isNumber(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }

  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach(key => {
      if (DATETIME_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }

  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }

  if (isPlainObject(arg4)) {
    overrides = arg4;
  }

  return [options.key || '', value, options, overrides];
}
/** @internal */


function clearDateTimeFormat(ctx, locale, format) {
  const context = ctx;

  for (const key in format) {
    const id = `${locale}__${key}`;

    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }

    context.__datetimeFormatters.delete(id);
  }
} // implementation of `number` function


function number(context, ...args) {
  const {
    numberFormats,
    unresolving,
    fallbackLocale,
    onWarn,
    localeFallbacker
  } = context;
  const {
    __numberFormatters
  } = context;

  if (process.env.NODE_ENV !== 'production' && !Availabilities.numberFormat) {
    onWarn(getWarnMessage$1(CoreWarnCodes.CANNOT_FORMAT_NUMBER));
    return MISSING_RESOLVE_VALUE;
  }

  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = isString(options.locale) ? options.locale : context.locale;
  const locales = localeFallbacker(context, // eslint-disable-line @typescript-eslint/no-explicit-any
  fallbackLocale, locale);

  if (!isString(key) || key === '') {
    return new Intl.NumberFormat(locale, overrides).format(value);
  } // resolve format


  let numberFormat = {};
  let targetLocale;
  let format = null;
  let from = locale;
  let to = null;
  const type = 'number format';

  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i];

    if (process.env.NODE_ENV !== 'production' && locale !== targetLocale && isTranslateFallbackWarn(fallbackWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.FALLBACK_TO_NUMBER_FORMAT, {
        key,
        target: targetLocale
      }));
    } // for vue-devtools timeline event


    if (process.env.NODE_ENV !== 'production' && locale !== targetLocale) {
      const emitter = context.__v_emitter;

      if (emitter) {
        emitter.emit("fallback"
        /* FALBACK */
        , {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        });
      }
    }

    numberFormat = numberFormats[targetLocale] || {};
    format = numberFormat[key];
    if (isPlainObject(format)) break;
    handleMissing(context, key, targetLocale, missingWarn, type); // eslint-disable-line @typescript-eslint/no-explicit-any

    from = to;
  } // checking format and target locale


  if (!isPlainObject(format) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }

  let id = `${targetLocale}__${key}`;

  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }

  let formatter = __numberFormatters.get(id);

  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign({}, format, overrides));

    __numberFormatters.set(id, formatter);
  }

  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
/** @internal */


const NUMBER_FORMAT_OPTIONS_KEYS = ['localeMatcher', 'style', 'currency', 'currencyDisplay', 'currencySign', 'useGrouping', 'minimumIntegerDigits', 'minimumFractionDigits', 'maximumFractionDigits', 'minimumSignificantDigits', 'maximumSignificantDigits', 'compactDisplay', 'notation', 'signDisplay', 'unit', 'unitDisplay', 'roundingMode', 'roundingPriority', 'roundingIncrement', 'trailingZeroDisplay'];
/** @internal */

function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = {};
  let overrides = {};

  if (!isNumber(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }

  const value = arg1;

  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach(key => {
      if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }

  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }

  if (isPlainObject(arg4)) {
    overrides = arg4;
  }

  return [options.key || '', value, options, overrides];
}
/** @internal */


function clearNumberFormat(ctx, locale, format) {
  const context = ctx;

  for (const key in format) {
    const id = `${locale}__${key}`;

    if (!context.__numberFormatters.has(id)) {
      continue;
    }

    context.__numberFormatters.delete(id);
  }
} // TODO: we could not exports for Node native ES Moudles yet...


{
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== 'boolean') {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
}

/*!
  * vue-devtools v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const VueDevToolsLabels = {
  ["vue-devtools-plugin-vue-i18n"
  /* PLUGIN */
  ]: 'Vue I18n devtools',
  ["vue-i18n-resource-inspector"
  /* CUSTOM_INSPECTOR */
  ]: 'I18n Resources',
  ["vue-i18n-timeline"
  /* TIMELINE */
  ]: 'Vue I18n'
};
const VueDevToolsPlaceholders = {
  ["vue-i18n-resource-inspector"
  /* CUSTOM_INSPECTOR */
  ]: 'Search for scopes ...'
};
const VueDevToolsTimelineColors = {
  ["vue-i18n-timeline"
  /* TIMELINE */
  ]: 0xffcd19
};

/*!
  * vue-i18n v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
/**
 * Vue I18n Version
 *
 * @remarks
 * Semver format. Same format as the package.json `version` field.
 *
 * @VueI18nGeneral
 */

const VERSION = '9.2.2';
/**
 * This is only called in esm-bundler builds.
 * istanbul-ignore-next
 */

function initFeatureFlags() {
  let needWarn = false;

  if (typeof __VUE_I18N_FULL_INSTALL__ !== 'boolean') {
    needWarn = true;
    getGlobalThis().__VUE_I18N_FULL_INSTALL__ = true;
  }

  if (typeof __VUE_I18N_LEGACY_API__ !== 'boolean') {
    needWarn = true;
    getGlobalThis().__VUE_I18N_LEGACY_API__ = true;
  }

  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== 'boolean') {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }

  if (process.env.NODE_ENV !== 'production' && needWarn) {
    console.warn(`You are running the esm-bundler build of vue-i18n. It is recommended to ` + `configure your bundler to explicitly replace feature flag globals ` + `with boolean literals to get proper tree-shaking in the final bundle.`);
  }
}

let code$1 = CoreWarnCodes.__EXTEND_POINT__;

const inc$1 = () => ++code$1;

const I18nWarnCodes = {
  FALLBACK_TO_ROOT: code$1,
  NOT_SUPPORTED_PRESERVE: inc$1(),
  NOT_SUPPORTED_FORMATTER: inc$1(),
  NOT_SUPPORTED_PRESERVE_DIRECTIVE: inc$1(),
  NOT_SUPPORTED_GET_CHOICE_INDEX: inc$1(),
  COMPONENT_NAME_LEGACY_COMPATIBLE: inc$1(),
  NOT_FOUND_PARENT_SCOPE: inc$1() // 13

};
const warnMessages = {
  [I18nWarnCodes.FALLBACK_TO_ROOT]: `Fall back to {type} '{key}' with root locale.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE]: `Not supported 'preserve'.`,
  [I18nWarnCodes.NOT_SUPPORTED_FORMATTER]: `Not supported 'formatter'.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE]: `Not supported 'preserveDirectiveContent'.`,
  [I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX]: `Not supported 'getChoiceIndex'.`,
  [I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE]: `Component name legacy compatible: '{name}' -> 'i18n'`,
  [I18nWarnCodes.NOT_FOUND_PARENT_SCOPE]: `Not found parent scope. use the global scope.`
};

function getWarnMessage(code, ...args) {
  return format(warnMessages[code], ...args);
}

let code = CompileErrorCodes.__EXTEND_POINT__;

const inc = () => ++code;

const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: code,
  // legacy module errors
  INVALID_ARGUMENT: inc(),
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: inc(),
  NOT_INSLALLED: inc(),
  NOT_AVAILABLE_IN_LEGACY_MODE: inc(),
  // directive module errors
  REQUIRED_VALUE: inc(),
  INVALID_VALUE: inc(),
  // vue-devtools errors
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: inc(),
  NOT_INSLALLED_WITH_PROVIDE: inc(),
  // unexpected error
  UNEXPECTED_ERROR: inc(),
  // not compatible legacy vue-i18n constructor
  NOT_COMPATIBLE_LEGACY_VUE_I18N: inc(),
  // bridge support vue 2.x only
  BRIDGE_SUPPORT_VUE_2_ONLY: inc(),
  // need to define `i18n` option in `allowComposition: true` and `useScope: 'local' at `useI18n``
  MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: inc(),
  // Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: inc(),
  // for enhancement
  __EXTEND_POINT__: inc() // 29

};

function createI18nError(code, ...args) {
  return createCompileError(code, null, process.env.NODE_ENV !== 'production' ? {
    messages: errorMessages,
    args
  } : undefined);
}

const errorMessages = {
  [I18nErrorCodes.UNEXPECTED_RETURN_TYPE]: 'Unexpected return type in composer',
  [I18nErrorCodes.INVALID_ARGUMENT]: 'Invalid argument',
  [I18nErrorCodes.MUST_BE_CALL_SETUP_TOP]: 'Must be called at the top of a `setup` function',
  [I18nErrorCodes.NOT_INSLALLED]: 'Need to install with `app.use` function',
  [I18nErrorCodes.UNEXPECTED_ERROR]: 'Unexpected error',
  [I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE]: 'Not available in legacy mode',
  [I18nErrorCodes.REQUIRED_VALUE]: `Required in value: {0}`,
  [I18nErrorCodes.INVALID_VALUE]: `Invalid value`,
  [I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN]: `Cannot setup vue-devtools plugin`,
  [I18nErrorCodes.NOT_INSLALLED_WITH_PROVIDE]: 'Need to install with `provide` function',
  [I18nErrorCodes.NOT_COMPATIBLE_LEGACY_VUE_I18N]: 'Not compatible legacy VueI18n.',
  [I18nErrorCodes.BRIDGE_SUPPORT_VUE_2_ONLY]: 'vue-i18n-bridge support Vue 2.x only',
  [I18nErrorCodes.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION]: 'Must define ‘i18n’ option or custom block in Composition API with using local scope in Legacy API mode',
  [I18nErrorCodes.NOT_AVAILABLE_COMPOSITION_IN_LEGACY]: 'Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly'
};
const TransrateVNodeSymbol = /* #__PURE__*/makeSymbol('__transrateVNode');
const DatetimePartsSymbol = /* #__PURE__*/makeSymbol('__datetimeParts');
const NumberPartsSymbol = /* #__PURE__*/makeSymbol('__numberParts');
const EnableEmitter = /* #__PURE__*/makeSymbol('__enableEmitter');
const DisableEmitter = /* #__PURE__*/makeSymbol('__disableEmitter');
const SetPluralRulesSymbol = makeSymbol('__setPluralRules');
makeSymbol('__intlifyMeta');
const InejctWithOption = /* #__PURE__*/makeSymbol('__injectWithOption');
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Transform flat json in obj to normal json in obj
 */

function handleFlatJson(obj) {
  // check obj
  if (!isObject(obj)) {
    return obj;
  }

  for (const key in obj) {
    // check key
    if (!hasOwn(obj, key)) {
      continue;
    } // handle for normal json


    if (!key.includes('.')) {
      // recursive process value if value is also a object
      if (isObject(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } // handle for flat json, transform to normal json
    else {
      // go to the last object
      const subKeys = key.split('.');
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;

      for (let i = 0; i < lastIndex; i++) {
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = {};
        }

        currentObj = currentObj[subKeys[i]];
      } // update last object value, delete old property


      currentObj[subKeys[lastIndex]] = obj[key];
      delete obj[key]; // recursive process value if value is also a object

      if (isObject(currentObj[subKeys[lastIndex]])) {
        handleFlatJson(currentObj[subKeys[lastIndex]]);
      }
    }
  }

  return obj;
}

function getLocaleMessages(locale, options) {
  const {
    messages,
    __i18n,
    messageResolver,
    flatJson
  } = options; // prettier-ignore

  const ret = isPlainObject(messages) ? messages : isArray(__i18n) ? {} : {
    [locale]: {}
  }; // merge locale messages of i18n custom block

  if (isArray(__i18n)) {
    __i18n.forEach(custom => {
      if ('locale' in custom && 'resource' in custom) {
        const {
          locale,
          resource
        } = custom;

        if (locale) {
          ret[locale] = ret[locale] || {};
          deepCopy(resource, ret[locale]);
        } else {
          deepCopy(resource, ret);
        }
      } else {
        isString(custom) && deepCopy(JSON.parse(custom), ret);
      }
    });
  } // handle messages for flat json


  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }

  return ret;
}

const isNotObjectOrIsArray = val => !isObject(val) || isArray(val); // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types


function deepCopy(src, des) {
  // src and des should both be objects, and non of then can be a array
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }

  for (const key in src) {
    if (hasOwn(src, key)) {
      if (isNotObjectOrIsArray(src[key]) || isNotObjectOrIsArray(des[key])) {
        // replace with src[key] when:
        // src[key] or des[key] is not a object, or
        // src[key] or des[key] is a array
        des[key] = src[key];
      } else {
        // src[key] and des[key] are both object, merge them
        deepCopy(src[key], des[key]);
      }
    }
  }
} // eslint-disable-next-line @typescript-eslint/no-explicit-any


function getComponentOptions(instance) {
  return instance.type;
}

function adjustI18nResources(global, options, componentOptions // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  let messages = isObject(options.messages) ? options.messages : {};

  if ('__i18nGlobal' in componentOptions) {
    messages = getLocaleMessages(global.locale.value, {
      messages,
      __i18n: componentOptions.__i18nGlobal
    });
  } // merge locale messages


  const locales = Object.keys(messages);

  if (locales.length) {
    locales.forEach(locale => {
      global.mergeLocaleMessage(locale, messages[locale]);
    });
  }

  {
    // merge datetime formats
    if (isObject(options.datetimeFormats)) {
      const locales = Object.keys(options.datetimeFormats);

      if (locales.length) {
        locales.forEach(locale => {
          global.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    } // merge number formats


    if (isObject(options.numberFormats)) {
      const locales = Object.keys(options.numberFormats);

      if (locales.length) {
        locales.forEach(locale => {
          global.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
  }
}

function createTextNode(key) {
  return createVNode(Text, null, key, 0);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
// extend VNode interface


const DEVTOOLS_META = '__INTLIFY_META__';
let composerID = 0;

function defineCoreMissingHandler(missing) {
  return (ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || undefined, type);
  };
} // for Intlify DevTools


const getMetaInfo = () => {
  const instance = getCurrentInstance();
  let meta = null; // eslint-disable-line @typescript-eslint/no-explicit-any

  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? {
    [DEVTOOLS_META]: meta
  } // eslint-disable-line @typescript-eslint/no-explicit-any
  : null;
};
/**
 * Create composer interface factory
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types


function createComposer(options = {}, VueI18nLegacy) {
  const {
    __root
  } = options;

  const _isGlobal = __root === undefined;

  let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;

  const _locale = ref( // prettier-ignore
  __root && _inheritLocale ? __root.locale.value : isString(options.locale) ? options.locale : DEFAULT_LOCALE);

  const _fallbackLocale = ref( // prettier-ignore
  __root && _inheritLocale ? __root.fallbackLocale.value : isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value);

  const _messages = ref(getLocaleMessages(_locale.value, options)); // prettier-ignore


  const _datetimeFormats = ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : {
    [_locale.value]: {}
  }); // prettier-ignore


  const _numberFormats = ref(isPlainObject(options.numberFormats) ? options.numberFormats : {
    [_locale.value]: {}
  }); // warning suppress options
  // prettier-ignore


  let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true; // prettier-ignore


  let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true; // prettier-ignore


  let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true; // configure fall back to root


  let _fallbackFormat = !!options.fallbackFormat; // runtime missing


  let _missing = isFunction(options.missing) ? options.missing : null;

  let _runtimeMissing = isFunction(options.missing) ? defineCoreMissingHandler(options.missing) : null; // postTranslation handler


  let _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null; // prettier-ignore


  let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;

  let _escapeParameter = !!options.escapeParameter; // custom linked modifiers
  // prettier-ignore


  const _modifiers = __root ? __root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {}; // pluralRules


  let _pluralRules = options.pluralRules || __root && __root.pluralRules; // runtime context
  // eslint-disable-next-line prefer-const


  let _context;

  const getCoreContext = () => {
    _isGlobal && setFallbackContext(null);
    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? undefined : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? undefined : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      __meta: {
        framework: 'vue'
      }
    };
    {
      ctxOptions.datetimeFormats = _datetimeFormats.value;
      ctxOptions.numberFormats = _numberFormats.value;
      ctxOptions.__datetimeFormatters = isPlainObject(_context) ? _context.__datetimeFormatters : undefined;
      ctxOptions.__numberFormatters = isPlainObject(_context) ? _context.__numberFormatters : undefined;
    }

    if (process.env.NODE_ENV !== 'production') {
      ctxOptions.__v_emitter = isPlainObject(_context) ? _context.__v_emitter : undefined;
    }

    const ctx = createCoreContext(ctxOptions);
    _isGlobal && setFallbackContext(ctx);
    return ctx;
  };

  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value); // track reactivity

  function trackReactivityValues() {
    return [_locale.value, _fallbackLocale.value, _messages.value, _datetimeFormats.value, _numberFormats.value];
  } // locale


  const locale = computed({
    get: () => _locale.value,
    set: val => {
      _locale.value = val;
      _context.locale = _locale.value;
    }
  }); // fallbackLocale

  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: val => {
      _fallbackLocale.value = val;
      _context.fallbackLocale = _fallbackLocale.value;
      updateFallbackLocale(_context, _locale.value, val);
    }
  }); // messages

  const messages = computed(() => _messages.value); // datetimeFormats

  const datetimeFormats = /* #__PURE__*/computed(() => _datetimeFormats.value); // numberFormats

  const numberFormats = /* #__PURE__*/computed(() => _numberFormats.value); // getPostTranslationHandler

  function getPostTranslationHandler() {
    return isFunction(_postTranslation) ? _postTranslation : null;
  } // setPostTranslationHandler


  function setPostTranslationHandler(handler) {
    _postTranslation = handler;
    _context.postTranslation = handler;
  } // getMissingHandler


  function getMissingHandler() {
    return _missing;
  } // setMissingHandler


  function setMissingHandler(handler) {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler);
    }

    _missing = handler;
    _context.missing = _runtimeMissing;
  }

  function isResolvedTranslateMessage(type, arg // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    return type !== 'translate' || !arg.resolvedMessage;
  }

  const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
    trackReactivityValues(); // track reactive dependency
    // NOTE: experimental !!

    let ret;

    if (process.env.NODE_ENV !== 'production' || __INTLIFY_PROD_DEVTOOLS__) {
      try {
        setAdditionalMeta(getMetaInfo());

        if (!_isGlobal) {
          _context.fallbackContext = __root ? getFallbackContext() : undefined;
        }

        ret = fn(_context);
      } finally {
        setAdditionalMeta(null);

        if (!_isGlobal) {
          _context.fallbackContext = undefined;
        }
      }
    } else {
      ret = fn(_context);
    }

    if (isNumber(ret) && ret === NOT_REOSLVED) {
      const [key, arg2] = argumentParser();

      if (process.env.NODE_ENV !== 'production' && __root && isString(key) && isResolvedTranslateMessage(warnType, arg2)) {
        if (_fallbackRoot && (isTranslateFallbackWarn(_fallbackWarn, key) || isTranslateMissingWarn(_missingWarn, key))) {
          warn(getWarnMessage(I18nWarnCodes.FALLBACK_TO_ROOT, {
            key,
            type: warnType
          }));
        } // for vue-devtools timeline event


        if (process.env.NODE_ENV !== 'production') {
          const {
            __v_emitter: emitter
          } = _context;

          if (emitter && _fallbackRoot) {
            emitter.emit("fallback"
            /* FALBACK */
            , {
              type: warnType,
              key,
              to: 'global',
              groupId: `${warnType}:${key}`
            });
          }
        }
      }

      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      /* istanbul ignore next */
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
    }
  }; // t


  function t(...args) {
    return wrapWithDeps(context => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), 'translate', root => Reflect.apply(root.t, root, [...args]), key => key, val => isString(val));
  } // rt


  function rt(...args) {
    const [arg1, arg2, arg3] = args;

    if (arg3 && !isObject(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
    }

    return t(...[arg1, arg2, assign({
      resolvedMessage: true
    }, arg3 || {})]);
  } // d


  function d(...args) {
    return wrapWithDeps(context => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), 'datetime format', root => Reflect.apply(root.d, root, [...args]), () => MISSING_RESOLVE_VALUE, val => isString(val));
  } // n


  function n(...args) {
    return wrapWithDeps(context => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), 'number format', root => Reflect.apply(root.n, root, [...args]), () => MISSING_RESOLVE_VALUE, val => isString(val));
  } // for custom processor


  function normalize(values) {
    return values.map(val => isString(val) || isNumber(val) || isBoolean(val) ? createTextNode(String(val)) : val);
  }

  const interpolate = val => val;

  const processor = {
    normalize,
    interpolate,
    type: 'vnode'
  }; // transrateVNode, using for `i18n-t` component

  function transrateVNode(...args) {
    return wrapWithDeps(context => {
      let ret;
      const _context = context;

      try {
        _context.processor = processor;
        ret = Reflect.apply(translate, null, [_context, ...args]);
      } finally {
        _context.processor = null;
      }

      return ret;
    }, () => parseTranslateArgs(...args), 'translate', // eslint-disable-next-line @typescript-eslint/no-explicit-any
    root => root[TransrateVNodeSymbol](...args), key => [createTextNode(key)], val => isArray(val));
  } // numberParts, using for `i18n-n` component


  function numberParts(...args) {
    return wrapWithDeps(context => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), 'number format', // eslint-disable-next-line @typescript-eslint/no-explicit-any
    root => root[NumberPartsSymbol](...args), () => [], val => isString(val) || isArray(val));
  } // datetimeParts, using for `i18n-d` component


  function datetimeParts(...args) {
    return wrapWithDeps(context => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), 'datetime format', // eslint-disable-next-line @typescript-eslint/no-explicit-any
    root => root[DatetimePartsSymbol](...args), () => [], val => isString(val) || isArray(val));
  }

  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  } // te


  function te(key, locale) {
    const targetLocale = isString(locale) ? locale : _locale.value;
    const message = getLocaleMessage(targetLocale);
    return _context.messageResolver(message, key) !== null;
  }

  function resolveMessages(key) {
    let messages = null;
    const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);

    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {};

      const messageValue = _context.messageResolver(targetLocaleMessages, key);

      if (messageValue != null) {
        messages = messageValue;
        break;
      }
    }

    return messages;
  } // tm


  function tm(key) {
    const messages = resolveMessages(key); // prettier-ignore

    return messages != null ? messages : __root ? __root.tm(key) || {} : {};
  } // getLocaleMessage


  function getLocaleMessage(locale) {
    return _messages.value[locale] || {};
  } // setLocaleMessage


  function setLocaleMessage(locale, message) {
    _messages.value[locale] = message;
    _context.messages = _messages.value;
  } // mergeLocaleMessage


  function mergeLocaleMessage(locale, message) {
    _messages.value[locale] = _messages.value[locale] || {};
    deepCopy(message, _messages.value[locale]);
    _context.messages = _messages.value;
  } // getDateTimeFormat


  function getDateTimeFormat(locale) {
    return _datetimeFormats.value[locale] || {};
  } // setDateTimeFormat


  function setDateTimeFormat(locale, format) {
    _datetimeFormats.value[locale] = format;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale, format);
  } // mergeDateTimeFormat


  function mergeDateTimeFormat(locale, format) {
    _datetimeFormats.value[locale] = assign(_datetimeFormats.value[locale] || {}, format);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale, format);
  } // getNumberFormat


  function getNumberFormat(locale) {
    return _numberFormats.value[locale] || {};
  } // setNumberFormat


  function setNumberFormat(locale, format) {
    _numberFormats.value[locale] = format;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale, format);
  } // mergeNumberFormat


  function mergeNumberFormat(locale, format) {
    _numberFormats.value[locale] = assign(_numberFormats.value[locale] || {}, format);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale, format);
  } // for debug


  composerID++; // watch root locale & fallbackLocale

  if (__root && inBrowser) {
    watch(__root.locale, val => {
      if (_inheritLocale) {
        _locale.value = val;
        _context.locale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
    watch(__root.fallbackLocale, val => {
      if (_inheritLocale) {
        _fallbackLocale.value = val;
        _context.fallbackLocale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
  } // define basic composition API!


  const composer = {
    id: composerID,
    locale,
    fallbackLocale,

    get inheritLocale() {
      return _inheritLocale;
    },

    set inheritLocale(val) {
      _inheritLocale = val;

      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },

    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },

    messages,

    get modifiers() {
      return _modifiers;
    },

    get pluralRules() {
      return _pluralRules || {};
    },

    get isGlobal() {
      return _isGlobal;
    },

    get missingWarn() {
      return _missingWarn;
    },

    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },

    get fallbackWarn() {
      return _fallbackWarn;
    },

    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },

    get fallbackRoot() {
      return _fallbackRoot;
    },

    set fallbackRoot(val) {
      _fallbackRoot = val;
    },

    get fallbackFormat() {
      return _fallbackFormat;
    },

    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },

    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },

    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },

    get escapeParameter() {
      return _escapeParameter;
    },

    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },

    t,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  };
  {
    composer.datetimeFormats = datetimeFormats;
    composer.numberFormats = numberFormats;
    composer.rt = rt;
    composer.te = te;
    composer.tm = tm;
    composer.d = d;
    composer.n = n;
    composer.getDateTimeFormat = getDateTimeFormat;
    composer.setDateTimeFormat = setDateTimeFormat;
    composer.mergeDateTimeFormat = mergeDateTimeFormat;
    composer.getNumberFormat = getNumberFormat;
    composer.setNumberFormat = setNumberFormat;
    composer.mergeNumberFormat = mergeNumberFormat;
    composer[InejctWithOption] = options.__injectWithOption;
    composer[TransrateVNodeSymbol] = transrateVNode;
    composer[DatetimePartsSymbol] = datetimeParts;
    composer[NumberPartsSymbol] = numberParts;
  } // for vue-devtools timeline event

  if (process.env.NODE_ENV !== 'production') {
    composer[EnableEmitter] = emitter => {
      _context.__v_emitter = emitter;
    };

    composer[DisableEmitter] = () => {
      _context.__v_emitter = undefined;
    };
  }

  return composer;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Convert to I18n Composer Options from VueI18n Options
 *
 * @internal
 */


function convertComposerOptions(options) {
  const locale = isString(options.locale) ? options.locale : DEFAULT_LOCALE;
  const fallbackLocale = isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : locale;
  const missing = isFunction(options.missing) ? options.missing : undefined;
  const missingWarn = isBoolean(options.silentTranslationWarn) || isRegExp(options.silentTranslationWarn) ? !options.silentTranslationWarn : true;
  const fallbackWarn = isBoolean(options.silentFallbackWarn) || isRegExp(options.silentFallbackWarn) ? !options.silentFallbackWarn : true;
  const fallbackRoot = isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  const fallbackFormat = !!options.formatFallbackMessages;
  const modifiers = isPlainObject(options.modifiers) ? options.modifiers : {};
  const pluralizationRules = options.pluralizationRules;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : undefined;
  const warnHtmlMessage = isString(options.warnHtmlInMessage) ? options.warnHtmlInMessage !== 'off' : true;
  const escapeParameter = !!options.escapeParameterHtml;
  const inheritLocale = isBoolean(options.sync) ? options.sync : true;

  if (process.env.NODE_ENV !== 'production' && options.formatter) {
    warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER));
  }

  if (process.env.NODE_ENV !== 'production' && options.preserveDirectiveContent) {
    warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE));
  }

  let messages = options.messages;

  if (isPlainObject(options.sharedMessages)) {
    const sharedMessages = options.sharedMessages;
    const locales = Object.keys(sharedMessages);
    messages = locales.reduce((messages, locale) => {
      const message = messages[locale] || (messages[locale] = {});
      assign(message, sharedMessages[locale]);
      return messages;
    }, messages || {});
  }

  const {
    __i18n,
    __root,
    __injectWithOption
  } = options;
  const datetimeFormats = options.datetimeFormats;
  const numberFormats = options.numberFormats;
  const flatJson = options.flatJson;
  return {
    locale,
    fallbackLocale,
    messages,
    flatJson,
    datetimeFormats,
    numberFormats,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackRoot,
    fallbackFormat,
    modifiers,
    pluralRules: pluralizationRules,
    postTranslation,
    warnHtmlMessage,
    escapeParameter,
    messageResolver: options.messageResolver,
    inheritLocale,
    __i18n,
    __root,
    __injectWithOption
  };
}
/**
 * create VueI18n interface factory
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types


function createVueI18n(options = {}, VueI18nLegacy) {
  {
    const composer = createComposer(convertComposerOptions(options)); // defines VueI18n

    const vueI18n = {
      // id
      id: composer.id,

      // locale
      get locale() {
        return composer.locale.value;
      },

      set locale(val) {
        composer.locale.value = val;
      },

      // fallbackLocale
      get fallbackLocale() {
        return composer.fallbackLocale.value;
      },

      set fallbackLocale(val) {
        composer.fallbackLocale.value = val;
      },

      // messages
      get messages() {
        return composer.messages.value;
      },

      // datetimeFormats
      get datetimeFormats() {
        return composer.datetimeFormats.value;
      },

      // numberFormats
      get numberFormats() {
        return composer.numberFormats.value;
      },

      // availableLocales
      get availableLocales() {
        return composer.availableLocales;
      },

      // formatter
      get formatter() {
        process.env.NODE_ENV !== 'production' && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER)); // dummy

        return {
          interpolate() {
            return [];
          }

        };
      },

      set formatter(val) {
        process.env.NODE_ENV !== 'production' && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER));
      },

      // missing
      get missing() {
        return composer.getMissingHandler();
      },

      set missing(handler) {
        composer.setMissingHandler(handler);
      },

      // silentTranslationWarn
      get silentTranslationWarn() {
        return isBoolean(composer.missingWarn) ? !composer.missingWarn : composer.missingWarn;
      },

      set silentTranslationWarn(val) {
        composer.missingWarn = isBoolean(val) ? !val : val;
      },

      // silentFallbackWarn
      get silentFallbackWarn() {
        return isBoolean(composer.fallbackWarn) ? !composer.fallbackWarn : composer.fallbackWarn;
      },

      set silentFallbackWarn(val) {
        composer.fallbackWarn = isBoolean(val) ? !val : val;
      },

      // modifiers
      get modifiers() {
        return composer.modifiers;
      },

      // formatFallbackMessages
      get formatFallbackMessages() {
        return composer.fallbackFormat;
      },

      set formatFallbackMessages(val) {
        composer.fallbackFormat = val;
      },

      // postTranslation
      get postTranslation() {
        return composer.getPostTranslationHandler();
      },

      set postTranslation(handler) {
        composer.setPostTranslationHandler(handler);
      },

      // sync
      get sync() {
        return composer.inheritLocale;
      },

      set sync(val) {
        composer.inheritLocale = val;
      },

      // warnInHtmlMessage
      get warnHtmlInMessage() {
        return composer.warnHtmlMessage ? 'warn' : 'off';
      },

      set warnHtmlInMessage(val) {
        composer.warnHtmlMessage = val !== 'off';
      },

      // escapeParameterHtml
      get escapeParameterHtml() {
        return composer.escapeParameter;
      },

      set escapeParameterHtml(val) {
        composer.escapeParameter = val;
      },

      // preserveDirectiveContent
      get preserveDirectiveContent() {
        process.env.NODE_ENV !== 'production' && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE));
        return true;
      },

      set preserveDirectiveContent(val) {
        process.env.NODE_ENV !== 'production' && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE));
      },

      // pluralizationRules
      get pluralizationRules() {
        return composer.pluralRules || {};
      },

      // for internal
      __composer: composer,

      // t
      t(...args) {
        const [arg1, arg2, arg3] = args;
        const options = {};
        let list = null;
        let named = null;

        if (!isString(arg1)) {
          throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
        }

        const key = arg1;

        if (isString(arg2)) {
          options.locale = arg2;
        } else if (isArray(arg2)) {
          list = arg2;
        } else if (isPlainObject(arg2)) {
          named = arg2;
        }

        if (isArray(arg3)) {
          list = arg3;
        } else if (isPlainObject(arg3)) {
          named = arg3;
        } // return composer.t(key, (list || named || {}) as any, options)


        return Reflect.apply(composer.t, composer, [key, list || named || {}, options]);
      },

      rt(...args) {
        return Reflect.apply(composer.rt, composer, [...args]);
      },

      // tc
      tc(...args) {
        const [arg1, arg2, arg3] = args;
        const options = {
          plural: 1
        };
        let list = null;
        let named = null;

        if (!isString(arg1)) {
          throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
        }

        const key = arg1;

        if (isString(arg2)) {
          options.locale = arg2;
        } else if (isNumber(arg2)) {
          options.plural = arg2;
        } else if (isArray(arg2)) {
          list = arg2;
        } else if (isPlainObject(arg2)) {
          named = arg2;
        }

        if (isString(arg3)) {
          options.locale = arg3;
        } else if (isArray(arg3)) {
          list = arg3;
        } else if (isPlainObject(arg3)) {
          named = arg3;
        } // return composer.t(key, (list || named || {}) as any, options)


        return Reflect.apply(composer.t, composer, [key, list || named || {}, options]);
      },

      // te
      te(key, locale) {
        return composer.te(key, locale);
      },

      // tm
      tm(key) {
        return composer.tm(key);
      },

      // getLocaleMessage
      getLocaleMessage(locale) {
        return composer.getLocaleMessage(locale);
      },

      // setLocaleMessage
      setLocaleMessage(locale, message) {
        composer.setLocaleMessage(locale, message);
      },

      // mergeLocaleMessage
      mergeLocaleMessage(locale, message) {
        composer.mergeLocaleMessage(locale, message);
      },

      // d
      d(...args) {
        return Reflect.apply(composer.d, composer, [...args]);
      },

      // getDateTimeFormat
      getDateTimeFormat(locale) {
        return composer.getDateTimeFormat(locale);
      },

      // setDateTimeFormat
      setDateTimeFormat(locale, format) {
        composer.setDateTimeFormat(locale, format);
      },

      // mergeDateTimeFormat
      mergeDateTimeFormat(locale, format) {
        composer.mergeDateTimeFormat(locale, format);
      },

      // n
      n(...args) {
        return Reflect.apply(composer.n, composer, [...args]);
      },

      // getNumberFormat
      getNumberFormat(locale) {
        return composer.getNumberFormat(locale);
      },

      // setNumberFormat
      setNumberFormat(locale, format) {
        composer.setNumberFormat(locale, format);
      },

      // mergeNumberFormat
      mergeNumberFormat(locale, format) {
        composer.mergeNumberFormat(locale, format);
      },

      // getChoiceIndex
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getChoiceIndex(choice, choicesLength) {
        process.env.NODE_ENV !== 'production' && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX));
        return -1;
      },

      // for internal
      __onComponentInstanceCreated(target) {
        const {
          componentInstanceCreatedListener
        } = options;

        if (componentInstanceCreatedListener) {
          componentInstanceCreatedListener(target, vueI18n);
        }
      }

    }; // for vue-devtools timeline event

    if (process.env.NODE_ENV !== 'production') {
      vueI18n.__enableEmitter = emitter => {
        const __composer = composer;
        __composer[EnableEmitter] && __composer[EnableEmitter](emitter);
      };

      vueI18n.__disableEmitter = () => {
        const __composer = composer;
        __composer[DisableEmitter] && __composer[DisableEmitter]();
      };
    }

    return vueI18n;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */


const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    validator: (val
    /* ComponetI18nScope */
    ) => val === 'parent' || val === 'global',
    default: 'parent'
    /* ComponetI18nScope */

  },
  i18n: {
    type: Object
  }
};

function getInterpolateArg( // eslint-disable-next-line @typescript-eslint/no-explicit-any
{
  slots
}, // SetupContext,
keys) {
  if (keys.length === 1 && keys[0] === 'default') {
    // default slot with list
    const ret = slots.default ? slots.default() : []; // eslint-disable-next-line @typescript-eslint/no-explicit-any

    return ret.reduce((slot, current) => {
      return slot = [...slot, ...(isArray(current.children) ? current.children : [current])];
    }, []);
  } else {
    // named slots
    return keys.reduce((arg, key) => {
      const slot = slots[key];

      if (slot) {
        arg[key] = slot();
      }

      return arg;
    }, {});
  }
} // eslint-disable-next-line @typescript-eslint/no-explicit-any


function getFragmentableTag(tag) {
  return Fragment;
}
/**
 * Translation Component
 *
 * @remarks
 * See the following items for property about details
 *
 * @VueI18nSee [TranslationProps](component#translationprops)
 * @VueI18nSee [BaseFormatProps](component#baseformatprops)
 * @VueI18nSee [Component Interpolation](../guide/advanced/component)
 *
 * @example
 * ```html
 * <div id="app">
 *   <!-- ... -->
 *   <i18n path="term" tag="label" for="tos">
 *     <a :href="url" target="_blank">{{ $t('tos') }}</a>
 *   </i18n>
 *   <!-- ... -->
 * </div>
 * ```
 * ```js
 * import { createApp } from 'vue'
 * import { createI18n } from 'vue-i18n'
 *
 * const messages = {
 *   en: {
 *     tos: 'Term of Service',
 *     term: 'I accept xxx {0}.'
 *   },
 *   ja: {
 *     tos: '利用規約',
 *     term: '私は xxx の{0}に同意します。'
 *   }
 * }
 *
 * const i18n = createI18n({
 *   locale: 'en',
 *   messages
 * })
 *
 * const app = createApp({
 *   data: {
 *     url: '/term'
 *   }
 * }).use(i18n).mount('#app')
 * ```
 *
 * @VueI18nComponent
 */


const Translation =
/* defineComponent */
{
  /* eslint-disable */
  name: 'i18n-t',
  props: assign({
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: val => isNumber(val) || !isNaN(val)
    }
  }, baseFormatProps),

  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const {
      slots,
      attrs
    } = context; // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050

    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return () => {
      const keys = Object.keys(slots).filter(key => key !== '_');
      const options = {};

      if (props.locale) {
        options.locale = props.locale;
      }

      if (props.plural !== undefined) {
        options.plural = isString(props.plural) ? +props.plural : props.plural;
      }

      const arg = getInterpolateArg(context, keys); // eslint-disable-next-line @typescript-eslint/no-explicit-any

      const children = i18n[TransrateVNodeSymbol](props.keypath, arg, options);
      const assignedAttrs = assign({}, attrs);
      const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
      return h(tag, assignedAttrs, children);
    };
  }

};

function isVNode(target) {
  return isArray(target) && !isString(target[0]);
}

function renderFormatter(props, context, slotKeys, partFormatter) {
  const {
    slots,
    attrs
  } = context;
  return () => {
    const options = {
      part: true
    };
    let overrides = {};

    if (props.locale) {
      options.locale = props.locale;
    }

    if (isString(props.format)) {
      options.key = props.format;
    } else if (isObject(props.format)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isString(props.format.key)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options.key = props.format.key;
      } // Filter out number format options only


      overrides = Object.keys(props.format).reduce((options, prop) => {
        return slotKeys.includes(prop) ? assign({}, options, {
          [prop]: props.format[prop]
        }) // eslint-disable-line @typescript-eslint/no-explicit-any
        : options;
      }, {});
    }

    const parts = partFormatter(...[props.value, options, overrides]);
    let children = [options.key];

    if (isArray(parts)) {
      children = parts.map((part, index) => {
        const slot = slots[part.type];
        const node = slot ? slot({
          [part.type]: part.value,
          index,
          parts
        }) : [part.value];

        if (isVNode(node)) {
          node[0].key = `${part.type}-${index}`;
        }

        return node;
      });
    } else if (isString(parts)) {
      children = [parts];
    }

    const assignedAttrs = assign({}, attrs);
    const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
    return h(tag, assignedAttrs, children);
  };
}
/**
 * Number Format Component
 *
 * @remarks
 * See the following items for property about details
 *
 * @VueI18nSee [FormattableProps](component#formattableprops)
 * @VueI18nSee [BaseFormatProps](component#baseformatprops)
 * @VueI18nSee [Custom Formatting](../guide/essentials/number#custom-formatting)
 *
 * @VueI18nDanger
 * Not supported IE, due to no support `Intl.NumberFormat#formatToParts` in [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts)
 *
 * If you want to use it, you need to use [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-numberformat)
 *
 * @VueI18nComponent
 */


const NumberFormat =
/* defineComponent */
{
  /* eslint-disable */
  name: 'i18n-n',
  props: assign({
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),

  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: 'parent',
      __useComponent: true
    });
    return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
    i18n[NumberPartsSymbol](...args));
  }

};
/**
 * Datetime Format Component
 *
 * @remarks
 * See the following items for property about details
 *
 * @VueI18nSee [FormattableProps](component#formattableprops)
 * @VueI18nSee [BaseFormatProps](component#baseformatprops)
 * @VueI18nSee [Custom Formatting](../guide/essentials/datetime#custom-formatting)
 *
 * @VueI18nDanger
 * Not supported IE, due to no support `Intl.DateTimeFormat#formatToParts` in [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)
 *
 * If you want to use it, you need to use [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-datetimeformat)
 *
 * @VueI18nComponent
 */

const DatetimeFormat =
/*defineComponent */
{
  /* eslint-disable */
  name: 'i18n-d',
  props: assign({
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),

  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: 'parent',
      __useComponent: true
    });
    return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
    i18n[DatetimePartsSymbol](...args));
  }

};

function getComposer$2(i18n, instance) {
  const i18nInternal = i18n;

  if (i18n.mode === 'composition') {
    return i18nInternal.__getInstance(instance) || i18n.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);

    return vueI18n != null ? vueI18n.__composer : i18n.global.__composer;
  }
}

function vTDirective(i18n) {
  const _process = binding => {
    const {
      instance,
      modifiers,
      value
    } = binding;
    /* istanbul ignore if */

    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }

    const composer = getComposer$2(i18n, instance.$);

    if (process.env.NODE_ENV !== 'production' && modifiers.preserve) {
      warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE));
    }

    const parsedValue = parseValue(value);
    return [Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]), composer];
  };

  const register = (el, binding) => {
    const [textContent, composer] = _process(binding);

    if (inBrowser && i18n.global === composer) {
      // global scope only
      el.__i18nWatcher = watch(composer.locale, () => {
        binding.instance && binding.instance.$forceUpdate();
      });
    }

    el.__composer = composer;
    el.textContent = textContent;
  };

  const unregister = el => {
    if (inBrowser && el.__i18nWatcher) {
      el.__i18nWatcher();

      el.__i18nWatcher = undefined;
      delete el.__i18nWatcher;
    }

    if (el.__composer) {
      el.__composer = undefined;
      delete el.__composer;
    }
  };

  const update = (el, {
    value
  }) => {
    if (el.__composer) {
      const composer = el.__composer;
      const parsedValue = parseValue(value);
      el.textContent = Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]);
    }
  };

  const getSSRProps = binding => {
    const [textContent] = _process(binding);

    return {
      textContent
    };
  };

  return {
    created: register,
    unmounted: unregister,
    beforeUpdate: update,
    getSSRProps
  };
}

function parseValue(value) {
  if (isString(value)) {
    return {
      path: value
    };
  } else if (isPlainObject(value)) {
    if (!('path' in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, 'path');
    }

    return value;
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
}

function makeParams(value) {
  const {
    path,
    locale,
    args,
    choice,
    plural
  } = value;
  const options = {};
  const named = args || {};

  if (isString(locale)) {
    options.locale = locale;
  }

  if (isNumber(choice)) {
    options.plural = choice;
  }

  if (isNumber(plural)) {
    options.plural = plural;
  }

  return [path, named, options];
}

function apply(app, i18n, ...options) {
  const pluginOptions = isPlainObject(options[0]) ? options[0] : {};
  const useI18nComponentName = !!pluginOptions.useI18nComponentName;
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;

  if (process.env.NODE_ENV !== 'production' && globalInstall && useI18nComponentName) {
    warn(getWarnMessage(I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE, {
      name: Translation.name
    }));
  }

  if (globalInstall) {
    // install components
    app.component(!useI18nComponentName ? Translation.name : 'i18n', Translation);
    app.component(NumberFormat.name, NumberFormat);
    app.component(DatetimeFormat.name, DatetimeFormat);
  } // install directive


  {
    app.directive('t', vTDirective(i18n));
  }
}

const VUE_I18N_COMPONENT_TYPES = 'vue-i18n: composer properties';
let devtoolsApi;

async function enableDevTools(app, i18n) {
  return new Promise((resolve, reject) => {
    try {
      setupDevtoolsPlugin({
        id: "vue-devtools-plugin-vue-i18n"
        /* PLUGIN */
        ,
        label: VueDevToolsLabels["vue-devtools-plugin-vue-i18n"
        /* PLUGIN */
        ],
        packageName: 'vue-i18n',
        homepage: 'https://vue-i18n.intlify.dev',
        logo: 'https://vue-i18n.intlify.dev/vue-i18n-devtools-logo.png',
        componentStateTypes: [VUE_I18N_COMPONENT_TYPES],
        app: app // eslint-disable-line @typescript-eslint/no-explicit-any

      }, api => {
        devtoolsApi = api;
        api.on.visitComponentTree(({
          componentInstance,
          treeNode
        }) => {
          updateComponentTreeTags(componentInstance, treeNode, i18n);
        });
        api.on.inspectComponent(({
          componentInstance,
          instanceData
        }) => {
          if (componentInstance.vnode.el && componentInstance.vnode.el.__VUE_I18N__ && instanceData) {
            if (i18n.mode === 'legacy') {
              // ignore global scope on legacy mode
              if (componentInstance.vnode.el.__VUE_I18N__ !== i18n.global.__composer) {
                inspectComposer(instanceData, componentInstance.vnode.el.__VUE_I18N__);
              }
            } else {
              inspectComposer(instanceData, componentInstance.vnode.el.__VUE_I18N__);
            }
          }
        });
        api.addInspector({
          id: "vue-i18n-resource-inspector"
          /* CUSTOM_INSPECTOR */
          ,
          label: VueDevToolsLabels["vue-i18n-resource-inspector"
          /* CUSTOM_INSPECTOR */
          ],
          icon: 'language',
          treeFilterPlaceholder: VueDevToolsPlaceholders["vue-i18n-resource-inspector"
          /* CUSTOM_INSPECTOR */
          ]
        });
        api.on.getInspectorTree(payload => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector"
          /* CUSTOM_INSPECTOR */
          ) {
            registerScope(payload, i18n);
          }
        });
        const roots = new Map();
        api.on.getInspectorState(async payload => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector"
          /* CUSTOM_INSPECTOR */
          ) {
            api.unhighlightElement();
            inspectScope(payload, i18n);

            if (payload.nodeId === 'global') {
              if (!roots.has(payload.app)) {
                const [root] = await api.getComponentInstances(payload.app);
                roots.set(payload.app, root);
              }

              api.highlightElement(roots.get(payload.app));
            } else {
              const instance = getComponentInstance(payload.nodeId, i18n);
              instance && api.highlightElement(instance);
            }
          }
        });
        api.on.editInspectorState(payload => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector"
          /* CUSTOM_INSPECTOR */
          ) {
            editScope(payload, i18n);
          }
        });
        api.addTimelineLayer({
          id: "vue-i18n-timeline"
          /* TIMELINE */
          ,
          label: VueDevToolsLabels["vue-i18n-timeline"
          /* TIMELINE */
          ],
          color: VueDevToolsTimelineColors["vue-i18n-timeline"
          /* TIMELINE */
          ]
        });
        resolve(true);
      });
    } catch (e) {
      console.error(e);
      reject(false);
    }
  });
} // eslint-disable-next-line @typescript-eslint/no-explicit-any


function getI18nScopeLable(instance) {
  return instance.type.name || instance.type.displayName || instance.type.__file || 'Anonymous';
}

function updateComponentTreeTags(instance, // eslint-disable-line @typescript-eslint/no-explicit-any
treeNode, i18n) {
  // prettier-ignore
  const global = i18n.mode === 'composition' ? i18n.global : i18n.global.__composer;

  if (instance && instance.vnode.el && instance.vnode.el.__VUE_I18N__) {
    // add custom tags local scope only
    if (instance.vnode.el.__VUE_I18N__ !== global) {
      const tag = {
        label: `i18n (${getI18nScopeLable(instance)} Scope)`,
        textColor: 0x000000,
        backgroundColor: 0xffcd19
      };
      treeNode.tags.push(tag);
    }
  }
}

function inspectComposer(instanceData, composer) {
  const type = VUE_I18N_COMPONENT_TYPES;
  instanceData.state.push({
    type,
    key: 'locale',
    editable: true,
    value: composer.locale.value
  });
  instanceData.state.push({
    type,
    key: 'availableLocales',
    editable: false,
    value: composer.availableLocales
  });
  instanceData.state.push({
    type,
    key: 'fallbackLocale',
    editable: true,
    value: composer.fallbackLocale.value
  });
  instanceData.state.push({
    type,
    key: 'inheritLocale',
    editable: true,
    value: composer.inheritLocale
  });
  instanceData.state.push({
    type,
    key: 'messages',
    editable: false,
    value: getLocaleMessageValue(composer.messages.value)
  });
  {
    instanceData.state.push({
      type,
      key: 'datetimeFormats',
      editable: false,
      value: composer.datetimeFormats.value
    });
    instanceData.state.push({
      type,
      key: 'numberFormats',
      editable: false,
      value: composer.numberFormats.value
    });
  }
} // eslint-disable-next-line @typescript-eslint/no-explicit-any


function getLocaleMessageValue(messages) {
  const value = {};
  Object.keys(messages).forEach(key => {
    const v = messages[key];

    if (isFunction(v) && 'source' in v) {
      value[key] = getMessageFunctionDetails(v);
    } else if (isObject(v)) {
      value[key] = getLocaleMessageValue(v);
    } else {
      value[key] = v;
    }
  });
  return value;
}

const ESC = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '&': '&amp;'
};

function escape(s) {
  return s.replace(/[<>"&]/g, escapeChar);
}

function escapeChar(a) {
  return ESC[a] || a;
} // eslint-disable-next-line @typescript-eslint/no-explicit-any


function getMessageFunctionDetails(func) {
  const argString = func.source ? `("${escape(func.source)}")` : `(?)`;
  return {
    _custom: {
      type: 'function',
      display: `<span>ƒ</span> ${argString}`
    }
  };
}

function registerScope(payload, i18n) {
  payload.rootNodes.push({
    id: 'global',
    label: 'Global Scope'
  }); // prettier-ignore

  const global = i18n.mode === 'composition' ? i18n.global : i18n.global.__composer;

  for (const [keyInstance, instance] of i18n.__instances) {
    // prettier-ignore
    const composer = i18n.mode === 'composition' ? instance : instance.__composer;

    if (global === composer) {
      continue;
    }

    payload.rootNodes.push({
      id: composer.id.toString(),
      label: `${getI18nScopeLable(keyInstance)} Scope`
    });
  }
}

function getComponentInstance(nodeId, i18n) {
  let instance = null;

  if (nodeId !== 'global') {
    for (const [component, composer] of i18n.__instances.entries()) {
      if (composer.id.toString() === nodeId) {
        instance = component;
        break;
      }
    }
  }

  return instance;
}

function getComposer$1(nodeId, i18n) {
  if (nodeId === 'global') {
    return i18n.mode === 'composition' ? i18n.global : i18n.global.__composer;
  } else {
    const instance = Array.from(i18n.__instances.values()).find(item => item.id.toString() === nodeId);

    if (instance) {
      return i18n.mode === 'composition' ? instance : instance.__composer;
    } else {
      return null;
    }
  }
}

function inspectScope(payload, i18n // eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
  const composer = getComposer$1(payload.nodeId, i18n);

  if (composer) {
    // TODO:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.state = makeScopeInspectState(composer);
  }

  return null;
}

function makeScopeInspectState(composer) {
  const state = {};
  const localeType = 'Locale related info';
  const localeStates = [{
    type: localeType,
    key: 'locale',
    editable: true,
    value: composer.locale.value
  }, {
    type: localeType,
    key: 'fallbackLocale',
    editable: true,
    value: composer.fallbackLocale.value
  }, {
    type: localeType,
    key: 'availableLocales',
    editable: false,
    value: composer.availableLocales
  }, {
    type: localeType,
    key: 'inheritLocale',
    editable: true,
    value: composer.inheritLocale
  }];
  state[localeType] = localeStates;
  const localeMessagesType = 'Locale messages info';
  const localeMessagesStates = [{
    type: localeMessagesType,
    key: 'messages',
    editable: false,
    value: getLocaleMessageValue(composer.messages.value)
  }];
  state[localeMessagesType] = localeMessagesStates;
  {
    const datetimeFormatsType = 'Datetime formats info';
    const datetimeFormatsStates = [{
      type: datetimeFormatsType,
      key: 'datetimeFormats',
      editable: false,
      value: composer.datetimeFormats.value
    }];
    state[datetimeFormatsType] = datetimeFormatsStates;
    const numberFormatsType = 'Datetime formats info';
    const numberFormatsStates = [{
      type: numberFormatsType,
      key: 'numberFormats',
      editable: false,
      value: composer.numberFormats.value
    }];
    state[numberFormatsType] = numberFormatsStates;
  }
  return state;
}

function addTimelineEvent(event, payload) {
  if (devtoolsApi) {
    let groupId;

    if (payload && 'groupId' in payload) {
      groupId = payload.groupId;
      delete payload.groupId;
    }

    devtoolsApi.addTimelineEvent({
      layerId: "vue-i18n-timeline"
      /* TIMELINE */
      ,
      event: {
        title: event,
        groupId,
        time: Date.now(),
        meta: {},
        data: payload || {},
        logType: event === "compile-error"
        /* COMPILE_ERROR */
        ? 'error' : event === "fallback"
        /* FALBACK */
        || event === "missing"
        /* MISSING */
        ? 'warning' : 'default'
      }
    });
  }
}

function editScope(payload, i18n) {
  const composer = getComposer$1(payload.nodeId, i18n);

  if (composer) {
    const [field] = payload.path;

    if (field === 'locale' && isString(payload.state.value)) {
      composer.locale.value = payload.state.value;
    } else if (field === 'fallbackLocale' && (isString(payload.state.value) || isArray(payload.state.value) || isObject(payload.state.value))) {
      composer.fallbackLocale.value = payload.state.value;
    } else if (field === 'inheritLocale' && isBoolean(payload.state.value)) {
      composer.inheritLocale = payload.state.value;
    }
  }
}
/**
 * Supports compatibility for legacy vue-i18n APIs
 * This mixin is used when we use vue-i18n@v9.x or later
 */


function defineMixin(vuei18n, composer, i18n) {
  return {
    beforeCreate() {
      const instance = getCurrentInstance();
      /* istanbul ignore if */

      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
      }

      const options = this.$options;

      if (options.i18n) {
        const optionsI18n = options.i18n;

        if (options.__i18n) {
          optionsI18n.__i18n = options.__i18n;
        }

        optionsI18n.__root = composer;

        if (this === this.$root) {
          this.$i18n = mergeToRoot(vuei18n, optionsI18n);
        } else {
          optionsI18n.__injectWithOption = true;
          this.$i18n = createVueI18n(optionsI18n);
        }
      } else if (options.__i18n) {
        if (this === this.$root) {
          this.$i18n = mergeToRoot(vuei18n, options);
        } else {
          this.$i18n = createVueI18n({
            __i18n: options.__i18n,
            __injectWithOption: true,
            __root: composer
          });
        }
      } else {
        // set global
        this.$i18n = vuei18n;
      }

      if (options.__i18nGlobal) {
        adjustI18nResources(composer, options, options);
      }

      vuei18n.__onComponentInstanceCreated(this.$i18n);

      i18n.__setInstance(instance, this.$i18n); // defines vue-i18n legacy APIs


      this.$t = (...args) => this.$i18n.t(...args);

      this.$rt = (...args) => this.$i18n.rt(...args);

      this.$tc = (...args) => this.$i18n.tc(...args);

      this.$te = (key, locale) => this.$i18n.te(key, locale);

      this.$d = (...args) => this.$i18n.d(...args);

      this.$n = (...args) => this.$i18n.n(...args);

      this.$tm = key => this.$i18n.tm(key);
    },

    mounted() {
      /* istanbul ignore if */
      if ((process.env.NODE_ENV !== 'production' || __VUE_PROD_DEVTOOLS__) && !false && this.$el && this.$i18n) {
        this.$el.__VUE_I18N__ = this.$i18n.__composer;
        const emitter = this.__v_emitter = createEmitter();
        const _vueI18n = this.$i18n;
        _vueI18n.__enableEmitter && _vueI18n.__enableEmitter(emitter);
        emitter.on('*', addTimelineEvent);
      }
    },

    unmounted() {
      const instance = getCurrentInstance();
      /* istanbul ignore if */

      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
      }
      /* istanbul ignore if */


      if ((process.env.NODE_ENV !== 'production' || __VUE_PROD_DEVTOOLS__) && !false && this.$el && this.$el.__VUE_I18N__) {
        if (this.__v_emitter) {
          this.__v_emitter.off('*', addTimelineEvent);

          delete this.__v_emitter;
        }

        if (this.$i18n) {
          const _vueI18n = this.$i18n;
          _vueI18n.__disableEmitter && _vueI18n.__disableEmitter();
          delete this.$el.__VUE_I18N__;
        }
      }

      delete this.$t;
      delete this.$rt;
      delete this.$tc;
      delete this.$te;
      delete this.$d;
      delete this.$n;
      delete this.$tm;

      i18n.__deleteInstance(instance);

      delete this.$i18n;
    }

  };
}

function mergeToRoot(root, options) {
  root.locale = options.locale || root.locale;
  root.fallbackLocale = options.fallbackLocale || root.fallbackLocale;
  root.missing = options.missing || root.missing;
  root.silentTranslationWarn = options.silentTranslationWarn || root.silentFallbackWarn;
  root.silentFallbackWarn = options.silentFallbackWarn || root.silentFallbackWarn;
  root.formatFallbackMessages = options.formatFallbackMessages || root.formatFallbackMessages;
  root.postTranslation = options.postTranslation || root.postTranslation;
  root.warnHtmlInMessage = options.warnHtmlInMessage || root.warnHtmlInMessage;
  root.escapeParameterHtml = options.escapeParameterHtml || root.escapeParameterHtml;
  root.sync = options.sync || root.sync;

  root.__composer[SetPluralRulesSymbol](options.pluralizationRules || root.pluralizationRules);

  const messages = getLocaleMessages(root.locale, {
    messages: options.messages,
    __i18n: options.__i18n
  });
  Object.keys(messages).forEach(locale => root.mergeLocaleMessage(locale, messages[locale]));

  if (options.datetimeFormats) {
    Object.keys(options.datetimeFormats).forEach(locale => root.mergeDateTimeFormat(locale, options.datetimeFormats[locale]));
  }

  if (options.numberFormats) {
    Object.keys(options.numberFormats).forEach(locale => root.mergeNumberFormat(locale, options.numberFormats[locale]));
  }

  return root;
}
/**
 * Injection key for {@link useI18n}
 *
 * @remarks
 * The global injection key for I18n instances with `useI18n`. this injection key is used in Web Components.
 * Specify the i18n instance created by {@link createI18n} together with `provide` function.
 *
 * @VueI18nGeneral
 */


const I18nInjectionKey = /* #__PURE__*/makeSymbol('global-vue-i18n'); // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types

function createI18n(options = {}, VueI18nLegacy) {
  // prettier-ignore
  const __legacyMode = __VUE_I18N_LEGACY_API__ && isBoolean(options.legacy) ? options.legacy : __VUE_I18N_LEGACY_API__; // prettier-ignore


  const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true; // prettier-ignore


  const __allowComposition = __VUE_I18N_LEGACY_API__ && __legacyMode ? !!options.allowComposition : true;

  const __instances = new Map();

  const [globalScope, __global] = createGlobal(options, __legacyMode);
  const symbol = makeSymbol(process.env.NODE_ENV !== 'production' ? 'vue-i18n' : '');

  function __getInstance(component) {
    return __instances.get(component) || null;
  }

  function __setInstance(component, instance) {
    __instances.set(component, instance);
  }

  function __deleteInstance(component) {
    __instances.delete(component);
  }

  {
    const i18n = {
      // mode
      get mode() {
        return __VUE_I18N_LEGACY_API__ && __legacyMode ? 'legacy' : 'composition';
      },

      // allowComposition
      get allowComposition() {
        return __allowComposition;
      },

      // install plugin
      async install(app, ...options) {
        if ((process.env.NODE_ENV !== 'production' || __VUE_PROD_DEVTOOLS__) && !false) {
          app.__VUE_I18N__ = i18n;
        } // setup global provider


        app.__VUE_I18N_SYMBOL__ = symbol;
        app.provide(app.__VUE_I18N_SYMBOL__, i18n); // global method and properties injection for Composition API

        if (!__legacyMode && __globalInjection) {
          injectGlobalFields(app, i18n.global);
        } // install built-in components and directive


        if (__VUE_I18N_FULL_INSTALL__) {
          apply(app, i18n, ...options);
        } // setup mixin for Legacy API


        if (__VUE_I18N_LEGACY_API__ && __legacyMode) {
          app.mixin(defineMixin(__global, __global.__composer, i18n));
        } // release global scope


        const unmountApp = app.unmount;

        app.unmount = () => {
          i18n.dispose();
          unmountApp();
        }; // setup vue-devtools plugin


        if ((process.env.NODE_ENV !== 'production' || __VUE_PROD_DEVTOOLS__) && !false) {
          const ret = await enableDevTools(app, i18n);

          if (!ret) {
            throw createI18nError(I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN);
          }

          const emitter = createEmitter();

          if (__legacyMode) {
            const _vueI18n = __global;
            _vueI18n.__enableEmitter && _vueI18n.__enableEmitter(emitter);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const _composer = __global;
            _composer[EnableEmitter] && _composer[EnableEmitter](emitter);
          }

          emitter.on('*', addTimelineEvent);
        }
      },

      // global accessor
      get global() {
        return __global;
      },

      dispose() {
        globalScope.stop();
      },

      // @internal
      __instances,
      // @internal
      __getInstance,
      // @internal
      __setInstance,
      // @internal
      __deleteInstance
    };
    return i18n;
  }
} // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types


function useI18n(options = {}) {
  const instance = getCurrentInstance();

  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
  }

  if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.NOT_INSLALLED);
  }

  const i18n = getI18nInstance(instance);
  const global = getGlobalComposer(i18n);
  const componentOptions = getComponentOptions(instance);
  const scope = getScope(options, componentOptions);

  if (__VUE_I18N_LEGACY_API__) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (i18n.mode === 'legacy' && !options.__useComponent) {
      if (!i18n.allowComposition) {
        throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE);
      }

      return useI18nForLegacy(instance, scope, global, options);
    }
  }

  if (scope === 'global') {
    adjustI18nResources(global, options, componentOptions);
    return global;
  }

  if (scope === 'parent') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let composer = getComposer(i18n, instance, options.__useComponent);

    if (composer == null) {
      if (process.env.NODE_ENV !== 'production') {
        warn(getWarnMessage(I18nWarnCodes.NOT_FOUND_PARENT_SCOPE));
      }

      composer = global;
    }

    return composer;
  }

  const i18nInternal = i18n;

  let composer = i18nInternal.__getInstance(instance);

  if (composer == null) {
    const composerOptions = assign({}, options);

    if ('__i18n' in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n;
    }

    if (global) {
      composerOptions.__root = global;
    }

    composer = createComposer(composerOptions);
    setupLifeCycle(i18nInternal, instance, composer);

    i18nInternal.__setInstance(instance, composer);
  }

  return composer;
}

function createGlobal(options, legacyMode, VueI18nLegacy // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const scope = effectScope();
  {
    const obj = __VUE_I18N_LEGACY_API__ && legacyMode ? scope.run(() => createVueI18n(options)) : scope.run(() => createComposer(options));

    if (obj == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }

    return [scope, obj];
  }
}

function getI18nInstance(instance) {
  {
    const i18n = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
    /* istanbul ignore if */

    if (!i18n) {
      throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSLALLED_WITH_PROVIDE);
    }

    return i18n;
  }
} // eslint-disable-next-line @typescript-eslint/no-explicit-any


function getScope(options, componentOptions) {
  // prettier-ignore
  return isEmptyObject(options) ? '__i18n' in componentOptions ? 'local' : 'global' : !options.useScope ? 'local' : options.useScope;
}

function getGlobalComposer(i18n) {
  // prettier-ignore
  return i18n.mode === 'composition' ? i18n.global : i18n.global.__composer;
}

function getComposer(i18n, target, useComponent = false) {
  let composer = null;
  const root = target.root;
  let current = target.parent;

  while (current != null) {
    const i18nInternal = i18n;

    if (i18n.mode === 'composition') {
      composer = i18nInternal.__getInstance(current);
    } else {
      if (__VUE_I18N_LEGACY_API__) {
        const vueI18n = i18nInternal.__getInstance(current);

        if (vueI18n != null) {
          composer = vueI18n.__composer;

          if (useComponent && composer && !composer[InejctWithOption] // eslint-disable-line @typescript-eslint/no-explicit-any
          ) {
            composer = null;
          }
        }
      }
    }

    if (composer != null) {
      break;
    }

    if (root === current) {
      break;
    }

    current = current.parent;
  }

  return composer;
}

function setupLifeCycle(i18n, target, composer) {
  let emitter = null;
  {
    onMounted(() => {
      // inject composer instance to DOM for intlify-devtools
      if ((process.env.NODE_ENV !== 'production' || __VUE_PROD_DEVTOOLS__) && !false && target.vnode.el) {
        target.vnode.el.__VUE_I18N__ = composer;
        emitter = createEmitter(); // eslint-disable-next-line @typescript-eslint/no-explicit-any

        const _composer = composer;
        _composer[EnableEmitter] && _composer[EnableEmitter](emitter);
        emitter.on('*', addTimelineEvent);
      }
    }, target);
    onUnmounted(() => {
      // remove composer instance from DOM for intlify-devtools
      if ((process.env.NODE_ENV !== 'production' || __VUE_PROD_DEVTOOLS__) && !false && target.vnode.el && target.vnode.el.__VUE_I18N__) {
        emitter && emitter.off('*', addTimelineEvent); // eslint-disable-next-line @typescript-eslint/no-explicit-any

        const _composer = composer;
        _composer[DisableEmitter] && _composer[DisableEmitter]();
        delete target.vnode.el.__VUE_I18N__;
      }

      i18n.__deleteInstance(target);
    }, target);
  }
}

function useI18nForLegacy(instance, scope, root, options = {} // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const isLocale = scope === 'local';

  const _composer = shallowRef(null);

  if (isLocale && instance.proxy && !(instance.proxy.$options.i18n || instance.proxy.$options.__i18n)) {
    throw createI18nError(I18nErrorCodes.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);
  }

  const _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;

  const _locale = ref( // prettier-ignore
  isLocale && _inheritLocale ? root.locale.value : isString(options.locale) ? options.locale : DEFAULT_LOCALE);

  const _fallbackLocale = ref( // prettier-ignore
  isLocale && _inheritLocale ? root.fallbackLocale.value : isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value);

  const _messages = ref(getLocaleMessages(_locale.value, options)); // prettier-ignore


  const _datetimeFormats = ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : {
    [_locale.value]: {}
  }); // prettier-ignore


  const _numberFormats = ref(isPlainObject(options.numberFormats) ? options.numberFormats : {
    [_locale.value]: {}
  }); // prettier-ignore


  const _missingWarn = isLocale ? root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true; // prettier-ignore


  const _fallbackWarn = isLocale ? root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true; // prettier-ignore


  const _fallbackRoot = isLocale ? root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true; // configure fall back to root


  const _fallbackFormat = !!options.fallbackFormat; // runtime missing


  const _missing = isFunction(options.missing) ? options.missing : null; // postTranslation handler


  const _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null; // prettier-ignore


  const _warnHtmlMessage = isLocale ? root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;

  const _escapeParameter = !!options.escapeParameter; // prettier-ignore


  const _modifiers = isLocale ? root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {}; // pluralRules


  const _pluralRules = options.pluralRules || isLocale && root.pluralRules; // track reactivity


  function trackReactivityValues() {
    return [_locale.value, _fallbackLocale.value, _messages.value, _datetimeFormats.value, _numberFormats.value];
  } // locale


  const locale = computed({
    get: () => {
      return _composer.value ? _composer.value.locale.value : _locale.value;
    },
    set: val => {
      if (_composer.value) {
        _composer.value.locale.value = val;
      }

      _locale.value = val;
    }
  }); // fallbackLocale

  const fallbackLocale = computed({
    get: () => {
      return _composer.value ? _composer.value.fallbackLocale.value : _fallbackLocale.value;
    },
    set: val => {
      if (_composer.value) {
        _composer.value.fallbackLocale.value = val;
      }

      _fallbackLocale.value = val;
    }
  }); // messages

  const messages = computed(() => {
    if (_composer.value) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return _composer.value.messages.value;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return _messages.value;
    }
  });
  const datetimeFormats = computed(() => _datetimeFormats.value);
  const numberFormats = computed(() => _numberFormats.value);

  function getPostTranslationHandler() {
    return _composer.value ? _composer.value.getPostTranslationHandler() : _postTranslation;
  }

  function setPostTranslationHandler(handler) {
    if (_composer.value) {
      _composer.value.setPostTranslationHandler(handler);
    }
  }

  function getMissingHandler() {
    return _composer.value ? _composer.value.getMissingHandler() : _missing;
  }

  function setMissingHandler(handler) {
    if (_composer.value) {
      _composer.value.setMissingHandler(handler);
    }
  }

  function warpWithDeps(fn) {
    trackReactivityValues();
    return fn();
  }

  function t(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.t, null, [...args])) : warpWithDeps(() => '');
  }

  function rt(...args) {
    return _composer.value ? Reflect.apply(_composer.value.rt, null, [...args]) : '';
  }

  function d(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.d, null, [...args])) : warpWithDeps(() => '');
  }

  function n(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.n, null, [...args])) : warpWithDeps(() => '');
  }

  function tm(key) {
    return _composer.value ? _composer.value.tm(key) : {};
  }

  function te(key, locale) {
    return _composer.value ? _composer.value.te(key, locale) : false;
  }

  function getLocaleMessage(locale) {
    return _composer.value ? _composer.value.getLocaleMessage(locale) : {};
  }

  function setLocaleMessage(locale, message) {
    if (_composer.value) {
      _composer.value.setLocaleMessage(locale, message);

      _messages.value[locale] = message;
    }
  }

  function mergeLocaleMessage(locale, message) {
    if (_composer.value) {
      _composer.value.mergeLocaleMessage(locale, message);
    }
  }

  function getDateTimeFormat(locale) {
    return _composer.value ? _composer.value.getDateTimeFormat(locale) : {};
  }

  function setDateTimeFormat(locale, format) {
    if (_composer.value) {
      _composer.value.setDateTimeFormat(locale, format);

      _datetimeFormats.value[locale] = format;
    }
  }

  function mergeDateTimeFormat(locale, format) {
    if (_composer.value) {
      _composer.value.mergeDateTimeFormat(locale, format);
    }
  }

  function getNumberFormat(locale) {
    return _composer.value ? _composer.value.getNumberFormat(locale) : {};
  }

  function setNumberFormat(locale, format) {
    if (_composer.value) {
      _composer.value.setNumberFormat(locale, format);

      _numberFormats.value[locale] = format;
    }
  }

  function mergeNumberFormat(locale, format) {
    if (_composer.value) {
      _composer.value.mergeNumberFormat(locale, format);
    }
  }

  const wrapper = {
    get id() {
      return _composer.value ? _composer.value.id : -1;
    },

    locale,
    fallbackLocale,
    messages,
    datetimeFormats,
    numberFormats,

    get inheritLocale() {
      return _composer.value ? _composer.value.inheritLocale : _inheritLocale;
    },

    set inheritLocale(val) {
      if (_composer.value) {
        _composer.value.inheritLocale = val;
      }
    },

    get availableLocales() {
      return _composer.value ? _composer.value.availableLocales : Object.keys(_messages.value);
    },

    get modifiers() {
      return _composer.value ? _composer.value.modifiers : _modifiers;
    },

    get pluralRules() {
      return _composer.value ? _composer.value.pluralRules : _pluralRules;
    },

    get isGlobal() {
      return _composer.value ? _composer.value.isGlobal : false;
    },

    get missingWarn() {
      return _composer.value ? _composer.value.missingWarn : _missingWarn;
    },

    set missingWarn(val) {
      if (_composer.value) {
        _composer.value.missingWarn = val;
      }
    },

    get fallbackWarn() {
      return _composer.value ? _composer.value.fallbackWarn : _fallbackWarn;
    },

    set fallbackWarn(val) {
      if (_composer.value) {
        _composer.value.missingWarn = val;
      }
    },

    get fallbackRoot() {
      return _composer.value ? _composer.value.fallbackRoot : _fallbackRoot;
    },

    set fallbackRoot(val) {
      if (_composer.value) {
        _composer.value.fallbackRoot = val;
      }
    },

    get fallbackFormat() {
      return _composer.value ? _composer.value.fallbackFormat : _fallbackFormat;
    },

    set fallbackFormat(val) {
      if (_composer.value) {
        _composer.value.fallbackFormat = val;
      }
    },

    get warnHtmlMessage() {
      return _composer.value ? _composer.value.warnHtmlMessage : _warnHtmlMessage;
    },

    set warnHtmlMessage(val) {
      if (_composer.value) {
        _composer.value.warnHtmlMessage = val;
      }
    },

    get escapeParameter() {
      return _composer.value ? _composer.value.escapeParameter : _escapeParameter;
    },

    set escapeParameter(val) {
      if (_composer.value) {
        _composer.value.escapeParameter = val;
      }
    },

    t,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    rt,
    d,
    n,
    tm,
    te,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getDateTimeFormat,
    setDateTimeFormat,
    mergeDateTimeFormat,
    getNumberFormat,
    setNumberFormat,
    mergeNumberFormat
  };

  function sync(composer) {
    composer.locale.value = _locale.value;
    composer.fallbackLocale.value = _fallbackLocale.value;
    Object.keys(_messages.value).forEach(locale => {
      composer.mergeLocaleMessage(locale, _messages.value[locale]);
    });
    Object.keys(_datetimeFormats.value).forEach(locale => {
      composer.mergeDateTimeFormat(locale, _datetimeFormats.value[locale]);
    });
    Object.keys(_numberFormats.value).forEach(locale => {
      composer.mergeNumberFormat(locale, _numberFormats.value[locale]);
    });
    composer.escapeParameter = _escapeParameter;
    composer.fallbackFormat = _fallbackFormat;
    composer.fallbackRoot = _fallbackRoot;
    composer.fallbackWarn = _fallbackWarn;
    composer.missingWarn = _missingWarn;
    composer.warnHtmlMessage = _warnHtmlMessage;
  }

  onBeforeMount(() => {
    if (instance.proxy == null || instance.proxy.$i18n == null) {
      throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any


    const composer = _composer.value = instance.proxy.$i18n.__composer;

    if (scope === 'global') {
      _locale.value = composer.locale.value;
      _fallbackLocale.value = composer.fallbackLocale.value;
      _messages.value = composer.messages.value;
      _datetimeFormats.value = composer.datetimeFormats.value;
      _numberFormats.value = composer.numberFormats.value;
    } else if (isLocale) {
      sync(composer);
    }
  });
  return wrapper;
}

const globalExportProps = ['locale', 'fallbackLocale', 'availableLocales'];
const globalExportMethods = ['t', 'rt', 'd', 'n', 'tm'];

function injectGlobalFields(app, composer) {
  const i18n = Object.create(null);
  globalExportProps.forEach(prop => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);

    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }

    const wrap = isRef(desc.value) // check computed props
    ? {
      get() {
        return desc.value.value;
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(val) {
        desc.value.value = val;
      }

    } : {
      get() {
        return desc.get && desc.get();
      }

    };
    Object.defineProperty(i18n, prop, wrap);
  });
  app.config.globalProperties.$i18n = i18n;
  globalExportMethods.forEach(method => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);

    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }

    Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
  });
} // register message compiler at vue-i18n


registerMessageCompiler(compileToFunction); // register message resolver at vue-i18n

registerMessageResolver(resolveValue); // register fallback locale at vue-i18n

registerLocaleFallbacker(fallbackWithLocaleChain);
{
  initFeatureFlags();
} // NOTE: experimental !!

if (process.env.NODE_ENV !== 'production' || __INTLIFY_PROD_DEVTOOLS__) {
  const target = getGlobalThis();
  target.__INTLIFY__ = true;
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}

if (process.env.NODE_ENV !== 'production') ;

var script$1$2 = {
  name: 'TreeNode',
  emits: ['node-toggle', 'node-click', 'checkbox-change'],
  props: {
    node: {
      type: null,
      default: null
    },
    expandedKeys: {
      type: null,
      default: null
    },
    selectionKeys: {
      type: null,
      default: null
    },
    selectionMode: {
      type: String,
      default: null
    },
    templates: {
      type: null,
      default: null
    },
    level: {
      type: Number,
      default: null
    },
    index: {
      type: Number,
      default: null
    }
  },
  nodeTouched: false,
  methods: {
    toggle() {
      this.$emit('node-toggle', this.node);
    },

    label(node) {
      return typeof node.label === 'function' ? node.label() : node.label;
    },

    onChildNodeToggle(node) {
      this.$emit('node-toggle', node);
    },

    onClick(event) {
      if (DomHandler.hasClass(event.target, 'p-tree-toggler') || DomHandler.hasClass(event.target.parentElement, 'p-tree-toggler')) {
        return;
      }

      if (this.isCheckboxSelectionMode()) {
        this.toggleCheckbox();
      } else {
        this.$emit('node-click', {
          originalEvent: event,
          nodeTouched: this.nodeTouched,
          node: this.node
        });
      }

      this.nodeTouched = false;
    },

    onChildNodeClick(event) {
      this.$emit('node-click', event);
    },

    onTouchEnd() {
      this.nodeTouched = true;
    },

    onKeyDown(event) {
      const nodeElement = event.target.parentElement;

      switch (event.code) {
        case 'ArrowDown':
          var listElement = nodeElement.children[1];

          if (listElement) {
            this.focusNode(listElement.children[0]);
          } else {
            const nextNodeElement = nodeElement.nextElementSibling;

            if (nextNodeElement) {
              this.focusNode(nextNodeElement);
            } else {
              let nextSiblingAncestor = this.findNextSiblingOfAncestor(nodeElement);

              if (nextSiblingAncestor) {
                this.focusNode(nextSiblingAncestor);
              }
            }
          }

          break;

        case 'ArrowUp':
          if (nodeElement.previousElementSibling) {
            this.focusNode(this.findLastVisibleDescendant(nodeElement.previousElementSibling));
          } else {
            let parentNodeElement = this.getParentNodeElement(nodeElement);

            if (parentNodeElement) {
              this.focusNode(parentNodeElement);
            }
          }

          break;

        case 'ArrowRight':
        case 'ArrowLeft':
          this.$emit('node-toggle', this.node);
          break;

        case 'Enter':
        case 'Space':
          this.onClick(event);
          break;
      }

      event.preventDefault();
    },

    toggleCheckbox() {
      let _selectionKeys = this.selectionKeys ? { ...this.selectionKeys
      } : {};

      const _check = !this.checked;

      this.propagateDown(this.node, _check, _selectionKeys);
      this.$emit('checkbox-change', {
        node: this.node,
        check: _check,
        selectionKeys: _selectionKeys
      });
    },

    propagateDown(node, check, selectionKeys) {
      if (check) selectionKeys[node.key] = {
        checked: true,
        partialChecked: false
      };else delete selectionKeys[node.key];

      if (node.children && node.children.length) {
        for (let child of node.children) {
          this.propagateDown(child, check, selectionKeys);
        }
      }
    },

    propagateUp(event) {
      let check = event.check;
      let _selectionKeys = { ...event.selectionKeys
      };
      let checkedChildCount = 0;
      let childPartialSelected = false;

      for (let child of this.node.children) {
        if (_selectionKeys[child.key] && _selectionKeys[child.key].checked) checkedChildCount++;else if (_selectionKeys[child.key] && _selectionKeys[child.key].partialChecked) childPartialSelected = true;
      }

      if (check && checkedChildCount === this.node.children.length) {
        _selectionKeys[this.node.key] = {
          checked: true,
          partialChecked: false
        };
      } else {
        if (!check) {
          delete _selectionKeys[this.node.key];
        }

        if (childPartialSelected || checkedChildCount > 0 && checkedChildCount !== this.node.children.length) _selectionKeys[this.node.key] = {
          checked: false,
          partialChecked: true
        };else delete _selectionKeys[this.node.key];
      }

      this.$emit('checkbox-change', {
        node: event.node,
        check: event.check,
        selectionKeys: _selectionKeys
      });
    },

    onChildCheckboxChange(event) {
      this.$emit('checkbox-change', event);
    },

    findNextSiblingOfAncestor(nodeElement) {
      let parentNodeElement = this.getParentNodeElement(nodeElement);

      if (parentNodeElement) {
        if (parentNodeElement.nextElementSibling) return parentNodeElement.nextElementSibling;else return this.findNextSiblingOfAncestor(parentNodeElement);
      } else {
        return null;
      }
    },

    findLastVisibleDescendant(nodeElement) {
      const childrenListElement = nodeElement.children[1];

      if (childrenListElement) {
        const lastChildElement = childrenListElement.children[childrenListElement.children.length - 1];
        return this.findLastVisibleDescendant(lastChildElement);
      } else {
        return nodeElement;
      }
    },

    getParentNodeElement(nodeElement) {
      const parentNodeElement = nodeElement.parentElement.parentElement;
      return DomHandler.hasClass(parentNodeElement, 'p-treenode') ? parentNodeElement : null;
    },

    focusNode(element) {
      element.children[0].focus();
    },

    isCheckboxSelectionMode() {
      return this.selectionMode === 'checkbox';
    }

  },
  computed: {
    hasChildren() {
      return this.node.children && this.node.children.length > 0;
    },

    expanded() {
      return this.expandedKeys && this.expandedKeys[this.node.key] === true;
    },

    leaf() {
      return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
    },

    selectable() {
      return this.node.selectable === false ? false : this.selectionMode != null;
    },

    selected() {
      return this.selectionMode && this.selectionKeys ? this.selectionKeys[this.node.key] === true : false;
    },

    containerClass() {
      return ['p-treenode', {
        'p-treenode-leaf': this.leaf
      }];
    },

    contentClass() {
      return ['p-treenode-content', this.node.styleClass, {
        'p-treenode-selectable': this.selectable,
        'p-highlight': this.checkboxMode ? this.checked : this.selected
      }];
    },

    icon() {
      return ['p-treenode-icon', this.node.icon];
    },

    toggleIcon() {
      return ['p-tree-toggler-icon pi pi-fw', this.expanded ? this.node.expandedIcon || 'pi-chevron-down' : this.node.collapsedIcon || 'pi-chevron-right'];
    },

    checkboxClass() {
      return ['p-checkbox-box', {
        'p-highlight': this.checked,
        'p-indeterminate': this.partialChecked
      }];
    },

    checkboxIcon() {
      return ['p-checkbox-icon', {
        'pi pi-check': this.checked,
        'pi pi-minus': this.partialChecked
      }];
    },

    checkboxMode() {
      return this.selectionMode === 'checkbox' && this.node.selectable !== false;
    },

    checked() {
      return this.selectionKeys ? this.selectionKeys[this.node.key] && this.selectionKeys[this.node.key].checked : false;
    },

    partialChecked() {
      return this.selectionKeys ? this.selectionKeys[this.node.key] && this.selectionKeys[this.node.key].partialChecked : false;
    }

  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$1$2 = ["aria-label", "aria-selected", "aria-expanded", "aria-setsize", "aria-posinset", "aria-level"];
const _hoisted_2$1$2 = ["aria-expanded"];
const _hoisted_3$1$2 = {
  key: 0,
  class: "p-checkbox p-component"
};
const _hoisted_4$1$2 = ["aria-checked"];
const _hoisted_5$1$1 = {
  class: "p-treenode-label"
};
const _hoisted_6$3 = {
  key: 0,
  class: "p-treenode-children",
  role: "group"
};

function render$1$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TreeNode = resolveComponent("TreeNode", true);

  const _directive_ripple = resolveDirective("ripple");

  return openBlock(), createElementBlock("li", {
    class: normalizeClass($options.containerClass),
    role: "treeitem",
    "aria-label": $options.label($props.node),
    "aria-selected": $options.selected,
    "aria-expanded": $options.expanded,
    "aria-setsize": $props.node.children ? $props.node.children.length : 0,
    "aria-posinset": $props.index + 1,
    "aria-level": $props.level
  }, [createElementVNode("div", {
    class: normalizeClass($options.contentClass),
    tabindex: "0",
    role: "treeitem",
    "aria-expanded": $options.expanded,
    onClick: _cache[1] || (_cache[1] = (...args) => $options.onClick && $options.onClick(...args)),
    onKeydown: _cache[2] || (_cache[2] = (...args) => $options.onKeyDown && $options.onKeyDown(...args)),
    onTouchend: _cache[3] || (_cache[3] = (...args) => $options.onTouchEnd && $options.onTouchEnd(...args)),
    style: normalizeStyle($props.node.style)
  }, [withDirectives((openBlock(), createElementBlock("button", {
    type: "button",
    class: "p-tree-toggler p-link",
    onClick: _cache[0] || (_cache[0] = (...args) => $options.toggle && $options.toggle(...args)),
    tabindex: "-1"
  }, [createElementVNode("span", {
    class: normalizeClass($options.toggleIcon)
  }, null, 2)])), [[_directive_ripple]]), $options.checkboxMode ? (openBlock(), createElementBlock("div", _hoisted_3$1$2, [createElementVNode("div", {
    class: normalizeClass($options.checkboxClass),
    role: "checkbox",
    "aria-checked": $options.checked
  }, [createElementVNode("span", {
    class: normalizeClass($options.checkboxIcon)
  }, null, 2)], 10, _hoisted_4$1$2)])) : createCommentVNode("", true), createElementVNode("span", {
    class: normalizeClass($options.icon)
  }, null, 2), createElementVNode("span", _hoisted_5$1$1, [$props.templates[$props.node.type] || $props.templates['default'] ? (openBlock(), createBlock(resolveDynamicComponent($props.templates[$props.node.type] || $props.templates['default']), {
    key: 0,
    node: $props.node
  }, null, 8, ["node"])) : (openBlock(), createElementBlock(Fragment, {
    key: 1
  }, [createTextVNode(toDisplayString$1($options.label($props.node)), 1)], 64))])], 46, _hoisted_2$1$2), $options.hasChildren && $options.expanded ? (openBlock(), createElementBlock("ul", _hoisted_6$3, [(openBlock(true), createElementBlock(Fragment, null, renderList($props.node.children, childNode => {
    return openBlock(), createBlock(_component_TreeNode, {
      key: childNode.key,
      node: childNode,
      templates: $props.templates,
      level: $props.level + 1,
      expandedKeys: $props.expandedKeys,
      onNodeToggle: $options.onChildNodeToggle,
      onNodeClick: $options.onChildNodeClick,
      selectionMode: $props.selectionMode,
      selectionKeys: $props.selectionKeys,
      onCheckboxChange: $options.propagateUp
    }, null, 8, ["node", "templates", "level", "expandedKeys", "onNodeToggle", "onNodeClick", "selectionMode", "selectionKeys", "onCheckboxChange"]);
  }), 128))])) : createCommentVNode("", true)], 10, _hoisted_1$1$2);
}

script$1$2.render = render$1$1;
var script$l = {
  name: 'Tree',
  emits: ['node-expand', 'node-collapse', 'update:expandedKeys', 'update:selectionKeys', 'node-select', 'node-unselect'],
  props: {
    value: {
      type: null,
      default: null
    },
    expandedKeys: {
      type: null,
      default: null
    },
    selectionKeys: {
      type: null,
      default: null
    },
    selectionMode: {
      type: String,
      default: null
    },
    metaKeySelection: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingIcon: {
      type: String,
      default: 'pi pi-spinner'
    },
    filter: {
      type: Boolean,
      default: false
    },
    filterBy: {
      type: String,
      default: 'label'
    },
    filterMode: {
      type: String,
      default: 'lenient'
    },
    filterPlaceholder: {
      type: String,
      default: null
    },
    filterLocale: {
      type: String,
      default: undefined
    },
    scrollHeight: {
      type: String,
      default: null
    },
    level: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      d_expandedKeys: this.expandedKeys || {},
      filterValue: null
    };
  },

  watch: {
    expandedKeys(newValue) {
      this.d_expandedKeys = newValue;
    }

  },
  methods: {
    onNodeToggle(node) {
      const key = node.key;

      if (this.d_expandedKeys[key]) {
        delete this.d_expandedKeys[key];
        this.$emit('node-collapse', node);
      } else {
        this.d_expandedKeys[key] = true;
        this.$emit('node-expand', node);
      }

      this.d_expandedKeys = { ...this.d_expandedKeys
      };
      this.$emit('update:expandedKeys', this.d_expandedKeys);
    },

    onNodeClick(event) {
      if (this.selectionMode != null && event.node.selectable !== false) {
        const metaSelection = event.nodeTouched ? false : this.metaKeySelection;

        const _selectionKeys = metaSelection ? this.handleSelectionWithMetaKey(event) : this.handleSelectionWithoutMetaKey(event);

        this.$emit('update:selectionKeys', _selectionKeys);
      }
    },

    onCheckboxChange(event) {
      this.$emit('update:selectionKeys', event.selectionKeys);
      if (event.check) this.$emit('node-select', event.node);else this.$emit('node-unselect', event.node);
    },

    handleSelectionWithMetaKey(event) {
      const originalEvent = event.originalEvent;
      const node = event.node;
      const metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
      const selected = this.isNodeSelected(node);

      let _selectionKeys;

      if (selected && metaKey) {
        if (this.isSingleSelectionMode()) {
          _selectionKeys = {};
        } else {
          _selectionKeys = { ...this.selectionKeys
          };
          delete _selectionKeys[node.key];
        }

        this.$emit('node-unselect', node);
      } else {
        if (this.isSingleSelectionMode()) {
          _selectionKeys = {};
        } else if (this.isMultipleSelectionMode()) {
          _selectionKeys = !metaKey ? {} : this.selectionKeys ? { ...this.selectionKeys
          } : {};
        }

        _selectionKeys[node.key] = true;
        this.$emit('node-select', node);
      }

      return _selectionKeys;
    },

    handleSelectionWithoutMetaKey(event) {
      const node = event.node;
      const selected = this.isNodeSelected(node);

      let _selectionKeys;

      if (this.isSingleSelectionMode()) {
        if (selected) {
          _selectionKeys = {};
          this.$emit('node-unselect', node);
        } else {
          _selectionKeys = {};
          _selectionKeys[node.key] = true;
          this.$emit('node-select', node);
        }
      } else {
        if (selected) {
          _selectionKeys = { ...this.selectionKeys
          };
          delete _selectionKeys[node.key];
          this.$emit('node-unselect', node);
        } else {
          _selectionKeys = this.selectionKeys ? { ...this.selectionKeys
          } : {};
          _selectionKeys[node.key] = true;
          this.$emit('node-select', node);
        }
      }

      return _selectionKeys;
    },

    isSingleSelectionMode() {
      return this.selectionMode === 'single';
    },

    isMultipleSelectionMode() {
      return this.selectionMode === 'multiple';
    },

    isNodeSelected(node) {
      return this.selectionMode && this.selectionKeys ? this.selectionKeys[node.key] === true : false;
    },

    isChecked(node) {
      return this.selectionKeys ? this.selectionKeys[node.key] && this.selectionKeys[node.key].checked : false;
    },

    isNodeLeaf(node) {
      return node.leaf === false ? false : !(node.children && node.children.length);
    },

    onFilterKeydown(event) {
      if (event.which === 13) {
        event.preventDefault();
      }
    },

    findFilteredNodes(node, paramsWithoutNode) {
      if (node) {
        let matched = false;

        if (node.children) {
          let childNodes = [...node.children];
          node.children = [];

          for (let childNode of childNodes) {
            let copyChildNode = { ...childNode
            };

            if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
              matched = true;
              node.children.push(copyChildNode);
            }
          }
        }

        if (matched) {
          return true;
        }
      }
    },

    isFilterMatched(node, {
      searchFields,
      filterText,
      strict
    }) {
      let matched = false;

      for (let field of searchFields) {
        let fieldValue = String(ObjectUtils.resolveFieldData(node, field)).toLocaleLowerCase(this.filterLocale);

        if (fieldValue.indexOf(filterText) > -1) {
          matched = true;
        }
      }

      if (!matched || strict && !this.isNodeLeaf(node)) {
        matched = this.findFilteredNodes(node, {
          searchFields,
          filterText,
          strict
        }) || matched;
      }

      return matched;
    }

  },
  computed: {
    containerClass() {
      return ['p-tree p-component', {
        'p-tree-selectable': this.selectionMode != null,
        'p-tree-loading': this.loading,
        'p-tree-flex-scrollable': this.scrollHeight === 'flex'
      }];
    },

    loadingIconClass() {
      return ['p-tree-loading-icon pi-spin', this.loadingIcon];
    },

    filteredValue() {
      let filteredNodes = [];
      const searchFields = this.filterBy.split(',');
      const filterText = this.filterValue.trim().toLocaleLowerCase(this.filterLocale);
      const strict = this.filterMode === 'strict';

      for (let node of this.value) {
        let _node = { ...node
        };
        let paramsWithoutNode = {
          searchFields,
          filterText,
          strict
        };

        if (strict && (this.findFilteredNodes(_node, paramsWithoutNode) || this.isFilterMatched(_node, paramsWithoutNode)) || !strict && (this.isFilterMatched(_node, paramsWithoutNode) || this.findFilteredNodes(_node, paramsWithoutNode))) {
          filteredNodes.push(_node);
        }
      }

      return filteredNodes;
    },

    valueToRender() {
      if (this.filterValue && this.filterValue.trim().length > 0) return this.filteredValue;else return this.value;
    }

  },
  components: {
    TreeNode: script$1$2
  }
};
const _hoisted_1$d = {
  key: 0,
  class: "p-tree-loading-overlay p-component-overlay"
};
const _hoisted_2$9 = {
  key: 1,
  class: "p-tree-filter-container"
};
const _hoisted_3$7 = ["placeholder"];

const _hoisted_4$7 = /*#__PURE__*/createElementVNode("span", {
  class: "p-tree-filter-icon pi pi-search"
}, null, -1);

const _hoisted_5$6 = {
  class: "p-tree-container",
  role: "tree"
};

function render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TreeNode = resolveComponent("TreeNode");

  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.containerClass)
  }, [$props.loading ? (openBlock(), createElementBlock("div", _hoisted_1$d, [createElementVNode("i", {
    class: normalizeClass($options.loadingIconClass)
  }, null, 2)])) : createCommentVNode("", true), $props.filter ? (openBlock(), createElementBlock("div", _hoisted_2$9, [withDirectives(createElementVNode("input", {
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $data.filterValue = $event),
    type: "text",
    autocomplete: "off",
    class: "p-tree-filter p-inputtext p-component",
    placeholder: $props.filterPlaceholder,
    onKeydown: _cache[1] || (_cache[1] = (...args) => $options.onFilterKeydown && $options.onFilterKeydown(...args))
  }, null, 40, _hoisted_3$7), [[vModelText, $data.filterValue]]), _hoisted_4$7])) : createCommentVNode("", true), createElementVNode("div", {
    class: "p-tree-wrapper",
    style: normalizeStyle({
      maxHeight: $props.scrollHeight
    })
  }, [createElementVNode("ul", _hoisted_5$6, [(openBlock(true), createElementBlock(Fragment, null, renderList($options.valueToRender, (node, index) => {
    return openBlock(), createBlock(_component_TreeNode, {
      key: node.key,
      node: node,
      templates: _ctx.$slots,
      level: $props.level + 1,
      index: index,
      expandedKeys: $data.d_expandedKeys,
      onNodeToggle: $options.onNodeToggle,
      onNodeClick: $options.onNodeClick,
      selectionMode: $props.selectionMode,
      selectionKeys: $props.selectionKeys,
      onCheckboxChange: $options.onCheckboxChange
    }, null, 8, ["node", "templates", "level", "index", "expandedKeys", "onNodeToggle", "onNodeClick", "selectionMode", "selectionKeys", "onCheckboxChange"]);
  }), 128))])], 4)], 2);
}

function styleInject$7(css, ref) {
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

var css_248z$7 = "\n.p-tree-container {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n    overflow: auto;\n}\n.p-treenode-children {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n.p-tree-wrapper {\n    overflow: auto;\n}\n.p-treenode-selectable {\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n}\n.p-tree-toggler {\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    overflow: hidden;\n    position: relative;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n}\n.p-treenode-leaf > .p-treenode-content .p-tree-toggler {\n    visibility: hidden;\n}\n.p-treenode-content {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n.p-tree-filter {\n    width: 100%;\n}\n.p-tree-filter-container {\n    position: relative;\n    display: block;\n    width: 100%;\n}\n.p-tree-filter-icon {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5rem;\n}\n.p-tree-loading {\n    position: relative;\n    min-height: 4rem;\n}\n.p-tree .p-tree-loading-overlay {\n    position: absolute;\n    z-index: 1;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n}\n.p-tree-flex-scrollable {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-flex: 1;\n        -ms-flex: 1;\n            flex: 1;\n    height: 100%;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n}\n.p-tree-flex-scrollable .p-tree-wrapper {\n    -webkit-box-flex: 1;\n        -ms-flex: 1;\n            flex: 1;\n}\n";
styleInject$7(css_248z$7);
script$l.render = render$a;

var script$k = {
  name: 'Dialog',
  inheritAttrs: false,
  emits: ['update:visible', 'show', 'hide', 'after-hide', 'maximize', 'unmaximize', 'dragend'],
  props: {
    header: {
      type: null,
      default: null
    },
    footer: {
      type: null,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: null
    },
    contentStyle: {
      type: null,
      default: null
    },
    contentClass: {
      type: String,
      default: null
    },
    contentProps: {
      type: null,
      default: null
    },
    rtl: {
      type: Boolean,
      default: null
    },
    maximizable: {
      type: Boolean,
      default: false
    },
    dismissableMask: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    baseZIndex: {
      type: Number,
      default: 0
    },
    autoZIndex: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: 'center'
    },
    breakpoints: {
      type: Object,
      default: null
    },
    draggable: {
      type: Boolean,
      default: true
    },
    keepInViewport: {
      type: Boolean,
      default: true
    },
    minX: {
      type: Number,
      default: 0
    },
    minY: {
      type: Number,
      default: 0
    },
    appendTo: {
      type: String,
      default: 'body'
    },
    closeIcon: {
      type: String,
      default: 'pi pi-times'
    },
    maximizeIcon: {
      type: String,
      default: 'pi pi-window-maximize'
    },
    minimizeIcon: {
      type: String,
      default: 'pi pi-window-minimize'
    },
    closeButtonProps: {
      type: null,
      default: null
    },
    _instance: null
  },

  provide() {
    return {
      dialogRef: computed(() => this._instance)
    };
  },

  data() {
    return {
      containerVisible: this.visible,
      maximized: false
    };
  },

  documentKeydownListener: null,
  container: null,
  mask: null,
  content: null,
  headerContainer: null,
  footerContainer: null,
  maximizableButton: null,
  closeButton: null,
  styleElement: null,
  dragging: null,
  documentDragListener: null,
  documentDragEndListener: null,
  lastPageX: null,
  lastPageY: null,

  updated() {
    if (this.visible) {
      this.containerVisible = this.visible;
    }
  },

  beforeUnmount() {
    this.unbindDocumentState();
    this.unbindGlobalListeners();
    this.destroyStyle();

    if (this.mask && this.autoZIndex) {
      ZIndexUtils.clear(this.mask);
    }

    this.container = null;
    this.mask = null;
  },

  mounted() {
    if (this.breakpoints) {
      this.createStyle();
    }
  },

  methods: {
    close() {
      this.$emit('update:visible', false);
    },

    onBeforeEnter(el) {
      el.setAttribute(this.attributeSelector, '');
    },

    onEnter() {
      this.$emit('show');
      this.focus();
      this.enableDocumentSettings();
      this.bindGlobalListeners();

      if (this.autoZIndex) {
        ZIndexUtils.set('modal', this.mask, this.baseZIndex + this.$primevue.config.zIndex.modal);
      }
    },

    onBeforeLeave() {
      if (this.modal) {
        DomHandler.addClass(this.mask, 'p-component-overlay-leave');
      }
    },

    onLeave() {
      this.$emit('hide');
    },

    onAfterLeave() {
      if (this.autoZIndex) {
        ZIndexUtils.clear(this.mask);
      }

      this.containerVisible = false;
      this.unbindDocumentState();
      this.unbindGlobalListeners();
      this.$emit('after-hide');
    },

    onMaskClick(event) {
      if (this.dismissableMask && this.closable && this.modal && this.mask === event.target) {
        this.close();
      }
    },

    focus() {
      const findFocusableElement = container => {
        return container.querySelector('[autofocus]');
      };

      let focusTarget = this.$slots.default && findFocusableElement(this.content);

      if (!focusTarget) {
        focusTarget = this.$slots.header && findFocusableElement(this.headerContainer);

        if (!focusTarget) {
          focusTarget = this.$slots.footer && findFocusableElement(this.footerContainer);

          if (!focusTarget) {
            focusTarget = findFocusableElement(this.container);
          }
        }
      }

      focusTarget && focusTarget.focus();
    },

    maximize(event) {
      if (this.maximized) {
        this.maximized = false;
        this.$emit('unmaximize', event);
      } else {
        this.maximized = true;
        this.$emit('maximize', event);
      }

      if (!this.modal) {
        if (this.maximized) DomHandler.addClass(document.body, 'p-overflow-hidden');else DomHandler.removeClass(document.body, 'p-overflow-hidden');
      }
    },

    enableDocumentSettings() {
      if (this.modal || this.maximizable && this.maximized) {
        DomHandler.addClass(document.body, 'p-overflow-hidden');
      }
    },

    unbindDocumentState() {
      if (this.modal || this.maximizable && this.maximized) {
        DomHandler.removeClass(document.body, 'p-overflow-hidden');
      }
    },

    onKeyDown(event) {
      if (event.code === 'Escape' && this.closeOnEscape) {
        this.close();
      }
    },

    bindDocumentKeyDownListener() {
      if (!this.documentKeydownListener) {
        this.documentKeydownListener = this.onKeyDown.bind(this);
        window.document.addEventListener('keydown', this.documentKeydownListener);
      }
    },

    unbindDocumentKeyDownListener() {
      if (this.documentKeydownListener) {
        window.document.removeEventListener('keydown', this.documentKeydownListener);
        this.documentKeydownListener = null;
      }
    },

    getPositionClass() {
      const positions = ['left', 'right', 'top', 'topleft', 'topright', 'bottom', 'bottomleft', 'bottomright'];
      const pos = positions.find(item => item === this.position);
      return pos ? `p-dialog-${pos}` : '';
    },

    containerRef(el) {
      this.container = el;
    },

    maskRef(el) {
      this.mask = el;
    },

    contentRef(el) {
      this.content = el;
    },

    headerContainerRef(el) {
      this.headerContainer = el;
    },

    footerContainerRef(el) {
      this.footerContainer = el;
    },

    maximizableRef(el) {
      this.maximizableButton = el;
    },

    closeButtonRef(el) {
      this.closeButton = el;
    },

    createStyle() {
      if (!this.styleElement) {
        this.styleElement = document.createElement('style');
        this.styleElement.type = 'text/css';
        document.head.appendChild(this.styleElement);
        let innerHTML = '';

        for (let breakpoint in this.breakpoints) {
          innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .p-dialog[${this.attributeSelector}] {
                                width: ${this.breakpoints[breakpoint]} !important;
                            }
                        }
                    `;
        }

        this.styleElement.innerHTML = innerHTML;
      }
    },

    destroyStyle() {
      if (this.styleElement) {
        document.head.removeChild(this.styleElement);
        this.styleElement = null;
      }
    },

    initDrag(event) {
      if (DomHandler.hasClass(event.target, 'p-dialog-header-icon') || DomHandler.hasClass(event.target.parentElement, 'p-dialog-header-icon')) {
        return;
      }

      if (this.draggable) {
        this.dragging = true;
        this.lastPageX = event.pageX;
        this.lastPageY = event.pageY;
        this.container.style.margin = '0';
        DomHandler.addClass(document.body, 'p-unselectable-text');
      }
    },

    bindGlobalListeners() {
      if (this.draggable) {
        this.bindDocumentDragListener();
        this.bindDocumentDragEndListener();
      }

      if (this.closeOnEscape && this.closable) {
        this.bindDocumentKeyDownListener();
      }
    },

    unbindGlobalListeners() {
      this.unbindDocumentDragListener();
      this.unbindDocumentDragEndListener();
      this.unbindDocumentKeyDownListener();
    },

    bindDocumentDragListener() {
      this.documentDragListener = event => {
        if (this.dragging) {
          let width = DomHandler.getOuterWidth(this.container);
          let height = DomHandler.getOuterHeight(this.container);
          let deltaX = event.pageX - this.lastPageX;
          let deltaY = event.pageY - this.lastPageY;
          let offset = this.container.getBoundingClientRect();
          let leftPos = offset.left + deltaX;
          let topPos = offset.top + deltaY;
          let viewport = DomHandler.getViewport();
          this.container.style.position = 'fixed';

          if (this.keepInViewport) {
            if (leftPos >= this.minX && leftPos + width < viewport.width) {
              this.lastPageX = event.pageX;
              this.container.style.left = leftPos + 'px';
            }

            if (topPos >= this.minY && topPos + height < viewport.height) {
              this.lastPageY = event.pageY;
              this.container.style.top = topPos + 'px';
            }
          } else {
            this.lastPageX = event.pageX;
            this.container.style.left = leftPos + 'px';
            this.lastPageY = event.pageY;
            this.container.style.top = topPos + 'px';
          }
        }
      };

      window.document.addEventListener('mousemove', this.documentDragListener);
    },

    unbindDocumentDragListener() {
      if (this.documentDragListener) {
        window.document.removeEventListener('mousemove', this.documentDragListener);
        this.documentDragListener = null;
      }
    },

    bindDocumentDragEndListener() {
      this.documentDragEndListener = event => {
        if (this.dragging) {
          this.dragging = false;
          DomHandler.removeClass(document.body, 'p-unselectable-text');
          this.$emit('dragend', event);
        }
      };

      window.document.addEventListener('mouseup', this.documentDragEndListener);
    },

    unbindDocumentDragEndListener() {
      if (this.documentDragEndListener) {
        window.document.removeEventListener('mouseup', this.documentDragEndListener);
        this.documentDragEndListener = null;
      }
    }

  },
  computed: {
    maskClass() {
      return ['p-dialog-mask', {
        'p-component-overlay p-component-overlay-enter': this.modal
      }, this.getPositionClass()];
    },

    dialogClass() {
      return ['p-dialog p-component', {
        'p-dialog-rtl': this.rtl,
        'p-dialog-maximized': this.maximizable && this.maximized,
        'p-input-filled': this.$primevue.config.inputStyle === 'filled',
        'p-ripple-disabled': this.$primevue.config.ripple === false
      }];
    },

    maximizeIconClass() {
      return ['p-dialog-header-maximize-icon', {
        [this.maximizeIcon]: !this.maximized,
        [this.minimizeIcon]: this.maximized
      }];
    },

    ariaId() {
      return UniqueComponentId();
    },

    ariaLabelledById() {
      return this.header != null || this.$attrs['aria-labelledby'] !== null ? this.ariaId + '_header' : null;
    },

    closeAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : undefined;
    },

    attributeSelector() {
      return UniqueComponentId();
    },

    contentStyleClass() {
      return ['p-dialog-content', this.contentClass];
    }

  },
  directives: {
    ripple: Ripple,
    focustrap: FocusTrap
  },
  components: {
    Portal: script$m
  }
};
const _hoisted_1$c = ["aria-labelledby", "aria-modal"];
const _hoisted_2$8 = ["id"];
const _hoisted_3$6 = {
  class: "p-dialog-header-icons"
};
const _hoisted_4$6 = ["tabindex"];
const _hoisted_5$5 = ["aria-label"];

function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Portal = resolveComponent("Portal");

  const _directive_ripple = resolveDirective("ripple");

  const _directive_focustrap = resolveDirective("focustrap");

  return openBlock(), createBlock(_component_Portal, {
    appendTo: $props.appendTo
  }, {
    default: withCtx(() => [$data.containerVisible ? (openBlock(), createElementBlock("div", {
      key: 0,
      ref: $options.maskRef,
      class: normalizeClass($options.maskClass),
      onClick: _cache[3] || (_cache[3] = (...args) => $options.onMaskClick && $options.onMaskClick(...args))
    }, [createVNode(Transition, {
      name: "p-dialog",
      onBeforeEnter: $options.onBeforeEnter,
      onEnter: $options.onEnter,
      onBeforeLeave: $options.onBeforeLeave,
      onLeave: $options.onLeave,
      onAfterLeave: $options.onAfterLeave,
      appear: ""
    }, {
      default: withCtx(() => [$props.visible ? withDirectives((openBlock(), createElementBlock("div", mergeProps({
        key: 0,
        ref: $options.containerRef,
        class: $options.dialogClass,
        role: "dialog",
        "aria-labelledby": $options.ariaLabelledById,
        "aria-modal": $props.modal
      }, _ctx.$attrs), [$props.showHeader ? (openBlock(), createElementBlock("div", {
        key: 0,
        ref: $options.headerContainerRef,
        class: "p-dialog-header",
        onMousedown: _cache[2] || (_cache[2] = (...args) => $options.initDrag && $options.initDrag(...args))
      }, [renderSlot(_ctx.$slots, "header", {}, () => [$props.header ? (openBlock(), createElementBlock("span", {
        key: 0,
        id: $options.ariaLabelledById,
        class: "p-dialog-title"
      }, toDisplayString$1($props.header), 9, _hoisted_2$8)) : createCommentVNode("", true)]), createElementVNode("div", _hoisted_3$6, [$props.maximizable ? withDirectives((openBlock(), createElementBlock("button", {
        key: 0,
        ref: $options.maximizableRef,
        autofocus: "",
        class: "p-dialog-header-icon p-dialog-header-maximize p-link",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.maximize && $options.maximize(...args)),
        type: "button",
        tabindex: $props.maximizable ? '0' : '-1'
      }, [createElementVNode("span", {
        class: normalizeClass($options.maximizeIconClass)
      }, null, 2)], 8, _hoisted_4$6)), [[_directive_ripple]]) : createCommentVNode("", true), $props.closable ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
        key: 1,
        ref: $options.closeButtonRef,
        autofocus: "",
        class: "p-dialog-header-icon p-dialog-header-close p-link",
        onClick: _cache[1] || (_cache[1] = (...args) => $options.close && $options.close(...args)),
        "aria-label": $options.closeAriaLabel,
        type: "button"
      }, $props.closeButtonProps), [createElementVNode("span", {
        class: normalizeClass(['p-dialog-header-close-icon', $props.closeIcon])
      }, null, 2)], 16, _hoisted_5$5)), [[_directive_ripple]]) : createCommentVNode("", true)])], 544)) : createCommentVNode("", true), createElementVNode("div", mergeProps({
        ref: $options.contentRef,
        class: $options.contentStyleClass,
        style: $props.contentStyle
      }, $props.contentProps), [renderSlot(_ctx.$slots, "default")], 16), $props.footer || _ctx.$slots.footer ? (openBlock(), createElementBlock("div", {
        key: 1,
        ref: $options.footerContainerRef,
        class: "p-dialog-footer"
      }, [renderSlot(_ctx.$slots, "footer", {}, () => [createTextVNode(toDisplayString$1($props.footer), 1)])], 512)) : createCommentVNode("", true)], 16, _hoisted_1$c)), [[_directive_focustrap, {
        focusTrapDisabled: !$props.modal
      }]]) : createCommentVNode("", true)]),
      _: 3
    }, 8, ["onBeforeEnter", "onEnter", "onBeforeLeave", "onLeave", "onAfterLeave"])], 2)) : createCommentVNode("", true)]),
    _: 3
  }, 8, ["appendTo"]);
}

function styleInject$6(css, ref) {
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

var css_248z$6 = "\n.p-dialog-mask {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    pointer-events: none;\n}\n.p-dialog-mask.p-component-overlay {\n    pointer-events: auto;\n}\n.p-dialog {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    pointer-events: auto;\n    max-height: 90%;\n    -webkit-transform: scale(1);\n            transform: scale(1);\n}\n.p-dialog-content {\n    overflow-y: auto;\n}\n.p-dialog-header {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n}\n.p-dialog-footer {\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n}\n.p-dialog .p-dialog-header-icons {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n.p-dialog .p-dialog-header-icon {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    overflow: hidden;\n    position: relative;\n}\n\n/* Fluid */\n.p-fluid .p-dialog-footer .p-button {\n    width: auto;\n}\n\n/* Animation */\n/* Center */\n.p-dialog-enter-active {\n    -webkit-transition: all 150ms cubic-bezier(0, 0, 0.2, 1);\n    transition: all 150ms cubic-bezier(0, 0, 0.2, 1);\n}\n.p-dialog-leave-active {\n    -webkit-transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);\n    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.p-dialog-enter-from,\n.p-dialog-leave-to {\n    opacity: 0;\n    -webkit-transform: scale(0.7);\n            transform: scale(0.7);\n}\n\n/* Top, Bottom, Left, Right, Top* and Bottom* */\n.p-dialog-top .p-dialog,\n.p-dialog-bottom .p-dialog,\n.p-dialog-left .p-dialog,\n.p-dialog-right .p-dialog,\n.p-dialog-topleft .p-dialog,\n.p-dialog-topright .p-dialog,\n.p-dialog-bottomleft .p-dialog,\n.p-dialog-bottomright .p-dialog {\n    margin: 0.75rem;\n    -webkit-transform: translate3d(0px, 0px, 0px);\n            transform: translate3d(0px, 0px, 0px);\n}\n.p-dialog-top .p-dialog-enter-active,\n.p-dialog-top .p-dialog-leave-active,\n.p-dialog-bottom .p-dialog-enter-active,\n.p-dialog-bottom .p-dialog-leave-active,\n.p-dialog-left .p-dialog-enter-active,\n.p-dialog-left .p-dialog-leave-active,\n.p-dialog-right .p-dialog-enter-active,\n.p-dialog-right .p-dialog-leave-active,\n.p-dialog-topleft .p-dialog-enter-active,\n.p-dialog-topleft .p-dialog-leave-active,\n.p-dialog-topright .p-dialog-enter-active,\n.p-dialog-topright .p-dialog-leave-active,\n.p-dialog-bottomleft .p-dialog-enter-active,\n.p-dialog-bottomleft .p-dialog-leave-active,\n.p-dialog-bottomright .p-dialog-enter-active,\n.p-dialog-bottomright .p-dialog-leave-active {\n    -webkit-transition: all 0.3s ease-out;\n    transition: all 0.3s ease-out;\n}\n.p-dialog-top .p-dialog-enter-from,\n.p-dialog-top .p-dialog-leave-to {\n    -webkit-transform: translate3d(0px, -100%, 0px);\n            transform: translate3d(0px, -100%, 0px);\n}\n.p-dialog-bottom .p-dialog-enter-from,\n.p-dialog-bottom .p-dialog-leave-to {\n    -webkit-transform: translate3d(0px, 100%, 0px);\n            transform: translate3d(0px, 100%, 0px);\n}\n.p-dialog-left .p-dialog-enter-from,\n.p-dialog-left .p-dialog-leave-to,\n.p-dialog-topleft .p-dialog-enter-from,\n.p-dialog-topleft .p-dialog-leave-to,\n.p-dialog-bottomleft .p-dialog-enter-from,\n.p-dialog-bottomleft .p-dialog-leave-to {\n    -webkit-transform: translate3d(-100%, 0px, 0px);\n            transform: translate3d(-100%, 0px, 0px);\n}\n.p-dialog-right .p-dialog-enter-from,\n.p-dialog-right .p-dialog-leave-to,\n.p-dialog-topright .p-dialog-enter-from,\n.p-dialog-topright .p-dialog-leave-to,\n.p-dialog-bottomright .p-dialog-enter-from,\n.p-dialog-bottomright .p-dialog-leave-to {\n    -webkit-transform: translate3d(100%, 0px, 0px);\n            transform: translate3d(100%, 0px, 0px);\n}\n\n/* Maximize */\n.p-dialog-maximized {\n    -webkit-transition: none;\n    transition: none;\n    -webkit-transform: none;\n            transform: none;\n    width: 100vw !important;\n    height: 100vh !important;\n    top: 0px !important;\n    left: 0px !important;\n    max-height: 100%;\n    height: 100%;\n}\n.p-dialog-maximized .p-dialog-content {\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n}\n\n/* Position */\n.p-dialog-left {\n    -webkit-box-pack: start;\n        -ms-flex-pack: start;\n            justify-content: flex-start;\n}\n.p-dialog-right {\n    -webkit-box-pack: end;\n        -ms-flex-pack: end;\n            justify-content: flex-end;\n}\n.p-dialog-top {\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n}\n.p-dialog-topleft {\n    -webkit-box-pack: start;\n        -ms-flex-pack: start;\n            justify-content: flex-start;\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n}\n.p-dialog-topright {\n    -webkit-box-pack: end;\n        -ms-flex-pack: end;\n            justify-content: flex-end;\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n}\n.p-dialog-bottom {\n    -webkit-box-align: end;\n        -ms-flex-align: end;\n            align-items: flex-end;\n}\n.p-dialog-bottomleft {\n    -webkit-box-pack: start;\n        -ms-flex-pack: start;\n            justify-content: flex-start;\n    -webkit-box-align: end;\n        -ms-flex-align: end;\n            align-items: flex-end;\n}\n.p-dialog-bottomright {\n    -webkit-box-pack: end;\n        -ms-flex-pack: end;\n            justify-content: flex-end;\n    -webkit-box-align: end;\n        -ms-flex-align: end;\n            align-items: flex-end;\n}\n.p-confirm-dialog .p-dialog-content {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n";
styleInject$6(css_248z$6);
script$k.render = render$9;

var script$j = {
  props: {
    bind : {
        type : Object,
        required : true
    }
},
  setup(__props) {

const props = __props;




const value = computed({
    get() {
        return props.bind.value.value;
    },
    set(val) {
        props.bind.setValue(val);
    }
});



const cell = props.bind.cell;
const atts = {};
if (cell.round) {
    let step = "0.";
    for(let i=0; i<cell.round - 1; ++i) {
        step += "0";
    }
    step += "1";
    atts["step"]  = parseInt(step);
}

return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$n), mergeProps({
    class: "focus:border-primary",
    name: __props.bind.cell.name,
    modelValue: unref(value),
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(value) ? (value).value = $event : null))
  }, atts, {
    onBlur: _cache[1] || (_cache[1] = $event => (__props.bind.active_validation.value = true))
  }), null, 16 /* FULL_PROPS */, ["name", "modelValue"]))
}
}

};

script$j.__file = "presstojam/src/components/form/number-edit.vue";

var script$i = {
  name: 'Checkbox',
  emits: ['click', 'update:modelValue', 'change', 'input', 'focus', 'blur'],
  props: {
    value: null,
    modelValue: null,
    binary: Boolean,
    name: {
      type: String,
      default: null
    },
    trueValue: {
      type: null,
      default: true
    },
    falseValue: {
      type: null,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: Number,
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
      focused: false
    };
  },

  methods: {
    onClick(event) {
      if (!this.disabled) {
        let newModelValue;

        if (this.binary) {
          newModelValue = this.checked ? this.falseValue : this.trueValue;
        } else {
          if (this.checked) newModelValue = this.modelValue.filter(val => !ObjectUtils.equals(val, this.value));else newModelValue = this.modelValue ? [...this.modelValue, this.value] : [this.value];
        }

        this.$emit('click', event);
        this.$emit('update:modelValue', newModelValue);
        this.$emit('change', event);
        this.$emit('input', newModelValue);
        this.$refs.input.focus();
      }
    },

    onFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },

    onBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
    }

  },
  computed: {
    checked() {
      return this.binary ? this.modelValue === this.trueValue : ObjectUtils.contains(this.value, this.modelValue);
    },

    containerClass() {
      return ['p-checkbox p-component', {
        'p-checkbox-checked': this.checked,
        'p-checkbox-disabled': this.disabled,
        'p-checkbox-focused': this.focused
      }];
    }

  }
};
const _hoisted_1$b = {
  class: "p-hidden-accessible"
};
const _hoisted_2$7 = ["id", "value", "name", "checked", "tabindex", "disabled", "readonly", "required", "aria-labelledby", "aria-label"];

function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.containerClass),
    onClick: _cache[2] || (_cache[2] = $event => $options.onClick($event))
  }, [createElementVNode("div", _hoisted_1$b, [createElementVNode("input", mergeProps({
    ref: "input",
    id: $props.inputId,
    type: "checkbox",
    value: $props.value,
    class: $props.inputClass,
    style: $props.inputStyle,
    name: $props.name,
    checked: $options.checked,
    tabindex: $props.tabindex,
    disabled: $props.disabled,
    readonly: $props.readonly,
    required: $props.required,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-label": _ctx.ariaLabel,
    onFocus: _cache[0] || (_cache[0] = $event => $options.onFocus($event)),
    onBlur: _cache[1] || (_cache[1] = $event => $options.onBlur($event))
  }, $props.inputProps), null, 16, _hoisted_2$7)]), createElementVNode("div", {
    ref: "box",
    class: normalizeClass(['p-checkbox-box', {
      'p-highlight': $options.checked,
      'p-disabled': $props.disabled,
      'p-focus': $data.focused
    }])
  }, [createElementVNode("span", {
    class: normalizeClass(['p-checkbox-icon', {
      'pi pi-check': $options.checked
    }])
  }, null, 2)], 2)], 2);
}

script$i.render = render$8;

var script$h = {
  props: {
    bind : {
        type : Object,
        required : true
    }
},
  setup(__props) {

const props = __props;




const value = computed({
    get() {
        return (props.bind.value.value) ? true : false;
    },
    set(val) {
        props.bind.setValue(val);
    }
});


return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$i), {
    modelValue: unref(value),
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(value) ? (value).value = $event : null)),
    binary: true,
    onBlur: _cache[1] || (_cache[1] = $event => (__props.bind.active_validation.value = true))
  }, null, 8 /* PROPS */, ["modelValue"]))
}
}

};

script$h.__file = "presstojam/src/components/form/flag-edit.vue";

var script$g = {
  name: 'TreeSelect',
  emits: ['update:modelValue', 'before-show', 'before-hide', 'change', 'show', 'hide', 'node-select', 'node-unselect', 'node-expand', 'node-collapse', 'focus', 'blur'],
  props: {
    modelValue: null,
    options: Array,
    scrollHeight: {
      type: String,
      default: '400px'
    },
    placeholder: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: Number,
      default: null
    },
    selectionMode: {
      type: String,
      default: 'single'
    },
    appendTo: {
      type: String,
      default: 'body'
    },
    emptyMessage: {
      type: String,
      default: null
    },
    display: {
      type: String,
      default: 'comma'
    },
    metaKeySelection: {
      type: Boolean,
      default: true
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
    panelProps: {
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

  data() {
    return {
      focused: false,
      overlayVisible: false,
      expandedKeys: {}
    };
  },

  watch: {
    modelValue: {
      handler: function () {
        if (!this.selfChange) {
          this.updateTreeState();
        }

        this.selfChange = false;
      },
      immediate: true
    },

    options() {
      this.updateTreeState();
    }

  },
  outsideClickListener: null,
  resizeListener: null,
  scrollHandler: null,
  overlay: null,
  selfChange: false,

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

  mounted() {
    this.updateTreeState();
  },

  methods: {
    show() {
      this.$emit('before-show');
      this.overlayVisible = true;
    },

    hide() {
      this.$emit('before-hide');
      this.overlayVisible = false;
      this.$refs.focusInput.focus();
    },

    onFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },

    onBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
    },

    onClick(event) {
      if (!this.disabled && (!this.overlay || !this.overlay.contains(event.target)) && !DomHandler.hasClass(event.target, 'p-treeselect-close')) {
        if (this.overlayVisible) this.hide();else this.show();
        this.$refs.focusInput.focus();
      }
    },

    onSelectionChange(keys) {
      this.selfChange = true;
      this.$emit('update:modelValue', keys);
      this.$emit('change', keys);
    },

    onNodeSelect(node) {
      this.$emit('node-select', node);

      if (this.selectionMode === 'single') {
        this.hide();
      }
    },

    onNodeUnselect(node) {
      this.$emit('node-unselect', node);
    },

    onNodeToggle(keys) {
      this.expandedKeys = keys;
    },

    onKeyDown(event) {
      switch (event.code) {
        case 'Down':
        case 'ArrowDown':
          if (this.overlayVisible) {
            if (DomHandler.findSingle(this.overlay, '.p-highlight')) {
              DomHandler.findSingle(this.overlay, '.p-highlight').focus();
            } else DomHandler.findSingle(this.overlay, '.p-treenode').children[0].focus();
          } else {
            this.show();
          }

          event.preventDefault();
          break;

        case 'Space':
        case 'Enter':
          if (this.overlayVisible) {
            this.hide();
          } else {
            this.show();
          }

          event.preventDefault();
          break;

        case 'Escape':
        case 'Tab':
          if (this.overlayVisible) {
            this.hide();
            event.preventDefault();
          }

          break;
      }
    },

    onOverlayEnter(el) {
      ZIndexUtils.set('overlay', el, this.$primevue.config.zIndex.overlay);
      this.alignOverlay();
      this.bindOutsideClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
      this.scrollValueInView();
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

    overlayRef(el) {
      this.overlay = el;
    },

    onOverlayClick(event) {
      OverlayEventBus.emit('overlay-click', {
        originalEvent: event,
        target: this.$el
      });
    },

    findSelectedNodes(node, keys, selectedNodes) {
      if (node) {
        if (this.isSelected(node, keys)) {
          selectedNodes.push(node);
          delete keys[node.key];
        }

        if (Object.keys(keys).length && node.children) {
          for (let childNode of node.children) {
            this.findSelectedNodes(childNode, keys, selectedNodes);
          }
        }
      } else {
        for (let childNode of this.options) {
          this.findSelectedNodes(childNode, keys, selectedNodes);
        }
      }
    },

    isSelected(node, keys) {
      return this.selectionMode === 'checkbox' ? keys[node.key] && keys[node.key].checked : keys[node.key];
    },

    updateTreeState() {
      let keys = { ...this.modelValue
      };
      this.expandedKeys = {};

      if (keys && this.options) {
        this.updateTreeBranchState(null, null, keys);
      }
    },

    updateTreeBranchState(node, path, keys) {
      if (node) {
        if (this.isSelected(node, keys)) {
          this.expandPath(path);
          delete keys[node.key];
        }

        if (Object.keys(keys).length && node.children) {
          for (let childNode of node.children) {
            path.push(node.key);
            this.updateTreeBranchState(childNode, path, keys);
          }
        }
      } else {
        for (let childNode of this.options) {
          this.updateTreeBranchState(childNode, [], keys);
        }
      }
    },

    expandPath(path) {
      if (path.length > 0) {
        for (let key of path) {
          this.expandedKeys[key] = true;
        }
      }
    },

    scrollValueInView() {
      if (this.overlay) {
        let selectedItem = DomHandler.findSingle(this.overlay, 'li.p-highlight');

        if (selectedItem) {
          selectedItem.scrollIntoView({
            block: 'nearest',
            inline: 'start'
          });
        }
      }
    }

  },
  computed: {
    containerClass() {
      return ['p-treeselect p-component p-inputwrapper', {
        'p-treeselect-chip': this.display === 'chip',
        'p-disabled': this.disabled,
        'p-focus': this.focused,
        'p-inputwrapper-filled': !this.emptyValue,
        'p-inputwrapper-focus': this.focused || this.overlayVisible
      }];
    },

    labelClass() {
      return ['p-treeselect-label', {
        'p-placeholder': this.label === this.placeholder,
        'p-treeselect-label-empty': !this.placeholder && this.emptyValue
      }];
    },

    panelStyleClass() {
      return ['p-treeselect-panel p-component', this.panelClass, {
        'p-input-filled': this.$primevue.config.inputStyle === 'filled',
        'p-ripple-disabled': this.$primevue.config.ripple === false
      }];
    },

    selectedNodes() {
      let selectedNodes = [];

      if (this.modelValue && this.options) {
        let keys = { ...this.modelValue
        };
        this.findSelectedNodes(null, keys, selectedNodes);
      }

      return selectedNodes;
    },

    label() {
      let value = this.selectedNodes;
      return value.length ? value.map(node => node.label).join(', ') : this.placeholder;
    },

    emptyMessageText() {
      return this.emptyMessage || this.$primevue.config.locale.emptyMessage;
    },

    emptyValue() {
      return !this.modelValue || Object.keys(this.modelValue).length === 0;
    },

    emptyOptions() {
      return !this.options || this.options.length === 0;
    },

    listId() {
      return UniqueComponentId() + '_list';
    }

  },
  components: {
    TSTree: script$l,
    Portal: script$m
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$a = {
  class: "p-hidden-accessible"
};
const _hoisted_2$6 = ["id", "disabled", "tabindex", "aria-labelledby", "aria-label", "aria-expanded", "aria-controls"];
const _hoisted_3$5 = {
  class: "p-treeselect-label-container"
};
const _hoisted_4$5 = {
  class: "p-treeselect-token-label"
};
const _hoisted_5$4 = ["aria-expanded"];

const _hoisted_6$2 = /*#__PURE__*/createElementVNode("span", {
  class: "p-treeselect-trigger-icon pi pi-chevron-down"
}, null, -1);

const _hoisted_7$1 = {
  key: 0,
  class: "p-treeselect-empty-message"
};

function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TSTree = resolveComponent("TSTree");

  const _component_Portal = resolveComponent("Portal");

  return openBlock(), createElementBlock("div", {
    ref: "container",
    class: normalizeClass($options.containerClass),
    onClick: _cache[6] || (_cache[6] = (...args) => $options.onClick && $options.onClick(...args))
  }, [createElementVNode("div", _hoisted_1$a, [createElementVNode("input", mergeProps({
    ref: "focusInput",
    id: $props.inputId,
    type: "text",
    role: "combobox",
    class: $props.inputClass,
    style: $props.inputStyle,
    readonly: "",
    disabled: $props.disabled,
    tabindex: !$props.disabled ? $props.tabindex : -1,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-label": _ctx.ariaLabel,
    "aria-haspopup": "tree",
    "aria-expanded": $data.overlayVisible,
    "aria-controls": $options.listId,
    onFocus: _cache[0] || (_cache[0] = $event => $options.onFocus($event)),
    onBlur: _cache[1] || (_cache[1] = $event => $options.onBlur($event)),
    onKeydown: _cache[2] || (_cache[2] = $event => $options.onKeyDown($event))
  }, $props.inputProps), null, 16, _hoisted_2$6)]), createElementVNode("div", _hoisted_3$5, [createElementVNode("div", {
    class: normalizeClass($options.labelClass)
  }, [renderSlot(_ctx.$slots, "value", {
    value: $options.selectedNodes,
    placeholder: $props.placeholder
  }, () => [$props.display === 'comma' ? (openBlock(), createElementBlock(Fragment, {
    key: 0
  }, [createTextVNode(toDisplayString$1($options.label || 'empty'), 1)], 64)) : $props.display === 'chip' ? (openBlock(), createElementBlock(Fragment, {
    key: 1
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($options.selectedNodes, node => {
    return openBlock(), createElementBlock("div", {
      key: node.key,
      class: "p-treeselect-token"
    }, [createElementVNode("span", _hoisted_4$5, toDisplayString$1(node.label), 1)]);
  }), 128)), $options.emptyValue ? (openBlock(), createElementBlock(Fragment, {
    key: 0
  }, [createTextVNode(toDisplayString$1($props.placeholder || 'empty'), 1)], 64)) : createCommentVNode("", true)], 64)) : createCommentVNode("", true)])], 2)]), createElementVNode("div", {
    class: "p-treeselect-trigger",
    role: "button",
    "aria-haspopup": "tree",
    "aria-expanded": $data.overlayVisible
  }, [renderSlot(_ctx.$slots, "indicator", {}, () => [_hoisted_6$2])], 8, _hoisted_5$4), createVNode(_component_Portal, {
    appendTo: $props.appendTo
  }, {
    default: withCtx(() => [createVNode(Transition, {
      name: "p-connected-overlay",
      onEnter: $options.onOverlayEnter,
      onLeave: $options.onOverlayLeave,
      onAfterLeave: $options.onOverlayAfterLeave
    }, {
      default: withCtx(() => [$data.overlayVisible ? (openBlock(), createElementBlock("div", mergeProps({
        key: 0,
        ref: $options.overlayRef,
        onClick: _cache[5] || (_cache[5] = (...args) => $options.onOverlayClick && $options.onOverlayClick(...args)),
        class: $options.panelStyleClass
      }, $props.panelProps), [renderSlot(_ctx.$slots, "header", {
        value: $props.modelValue,
        options: $props.options
      }), createElementVNode("div", {
        class: "p-treeselect-items-wrapper",
        style: normalizeStyle({
          'max-height': $props.scrollHeight
        })
      }, [createVNode(_component_TSTree, {
        id: $options.listId,
        value: $props.options,
        selectionMode: $props.selectionMode,
        "onUpdate:selectionKeys": $options.onSelectionChange,
        selectionKeys: $props.modelValue,
        expandedKeys: $data.expandedKeys,
        "onUpdate:expandedKeys": $options.onNodeToggle,
        metaKeySelection: $props.metaKeySelection,
        onNodeExpand: _cache[3] || (_cache[3] = $event => _ctx.$emit('node-expand', $event)),
        onNodeCollapse: _cache[4] || (_cache[4] = $event => _ctx.$emit('node-collapse', $event)),
        onNodeSelect: $options.onNodeSelect,
        onNodeUnselect: $options.onNodeUnselect,
        level: 0
      }, null, 8, ["id", "value", "selectionMode", "onUpdate:selectionKeys", "selectionKeys", "expandedKeys", "onUpdate:expandedKeys", "metaKeySelection", "onNodeSelect", "onNodeUnselect"]), $options.emptyOptions ? (openBlock(), createElementBlock("div", _hoisted_7$1, [renderSlot(_ctx.$slots, "empty", {}, () => [createTextVNode(toDisplayString$1($options.emptyMessageText), 1)])])) : createCommentVNode("", true)], 4), renderSlot(_ctx.$slots, "footer", {
        value: $props.modelValue,
        options: $props.options
      })], 16)) : createCommentVNode("", true)]),
      _: 3
    }, 8, ["onEnter", "onLeave", "onAfterLeave"])]),
    _: 3
  }, 8, ["appendTo"])], 2);
}

function styleInject$5(css, ref) {
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

var css_248z$5 = "\n.p-treeselect {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    cursor: pointer;\n    position: relative;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n}\n.p-treeselect-trigger {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n}\n.p-treeselect-label-container {\n    overflow: hidden;\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n    cursor: pointer;\n}\n.p-treeselect-label {\n    display: block;\n    white-space: nowrap;\n    cursor: pointer;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n.p-treeselect-label-empty {\n    overflow: hidden;\n    visibility: hidden;\n}\n.p-treeselect-token {\n    cursor: default;\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n}\n.p-treeselect .p-treeselect-panel {\n    min-width: 100%;\n}\n.p-treeselect-panel {\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.p-treeselect-items-wrapper {\n    overflow: auto;\n}\n.p-fluid .p-treeselect {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n";
styleInject$5(css_248z$5);
script$g.render = render$7;

var script$f = {
  props: {
         cell : Object,
         store : Object
     },
  emits: ['onCreate'],
  setup(__props, { emit: emits }) {

const props = __props;

    

   
     const client = inject("client");

     

     const dialog = ref(false);

    
    
    const referencestore = createTemporaryStore(client, props.cell.reference);
    let parent = false;
    let common_parent_id = 0;

  
    if  (props.cell.common && props.cell.reference_type != ReferenceTypes.CIRCULAR) {
        parent = true;
        props.cell.common;
        common_parent_id = props.store.slug_trail.value[props.cell.common]['--id'];
    }
 
    function createReference() {
        referencestore.active.value = {};
        if (!parent && referencestore.route.parent) {
            referencestore.active.value['--parent'] = common_parent_id;
        }
        dialog.value =true;
    }

    function onCreate() {
        dialog.value = false;
        emits('onCreate', referencestore.active.value['--id']);
    }
 
return (_ctx, _cache) => {
  return (openBlock(), createElementBlock(Fragment, null, [
    createVNode(unref(script$o), {
      icon: "pi pi-plus",
      class: "p-button-rounded p-button-success mr-2",
      onClick: createReference
    }),
    createVNode(unref(script$k), {
      visible: dialog.value,
      "onUpdate:visible": _cache[0] || (_cache[0] = $event => ((dialog).value = $event)),
      header: 'Create ' + _ctx.$t('models.' + __props.cell.reference + '.title', 1),
      modal: true,
      class: "p-fluid"
    }, {
      default: withCtx(() => [
        createVNode(script, {
          store: unref(referencestore),
          onSaved: onCreate,
          parent: unref(parent),
          common_parent: __props.cell.common,
          common_parent_id: unref(common_parent_id)
        }, null, 8 /* PROPS */, ["store", "parent", "common_parent", "common_parent_id"])
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["visible", "header"])
  ], 64 /* STABLE_FRAGMENT */))
}
}

};

script$f.__file = "presstojam/src/components/actions/reference-create.vue";

const _hoisted_1$9 = {
  key: 0,
  class: "p-component"
};



var script$e = {
  props: {
    bind : {
        type : Object,
        required : true
    }
},
  setup(__props) {

const props = __props;




const model = inject("model");
const store = getStoreById(model);
const client = inject("client");


const options = ref([]);
let value;
let id = 0;

if (store.active_id) {
    const repo = getStore(model);
    id = repo.data.value['--parent'];
} else {
    id = store.parent_id;
}

const cell = props.bind.cell;

if (cell.isReferenceType()) {
    onMounted(() => {
        cell.getOptions(client, model, id)
        .then(response => options.value =response)
        .catch(e => console.log(e));
    });  

    value = computed({
        get() {
            return props.bind.value.value;
        },
        set(val) {
            props.bind.setValue(val);
        }
    });

} else if (cell.recursive) {
    onMounted(() => {
       cell.getRecursiveOptions(client, model, id, store.route.schema)
       .then(response => {
        let arr = [...response];
        arr.unshift({key : 0, value : 'Root'});
        options.value =arr;
       })
       .catch(e => console.log(e));
    });  

    value = computed({
        get() {
            let obj = {};
            obj[props.bind.value.value] = true;
            return obj;
        },
        set(val) {
            const keys = Object.keys(val);
            props.bind.setValue(keys[0]);
        }
    });
} 


function onCreate(id) {
    value = id;
    if (cell.reference) {
        store.references[cell.name].reload()
        .then(() => {
            return getOptions(store, cell.name)
        }).then(response => {
            options.value =response;
        });
    }
}



return (_ctx, _cache) => {
  return (__props.bind.cell.isReferenceType())
    ? (openBlock(), createElementBlock("div", _hoisted_1$9, [
        createVNode(unref(script$p), {
          placeholder: "Please Select",
          field: __props.bind.cell,
          options: options.value,
          optionValue: "--key",
          optionLabel: "--value",
          modelValue: unref(value),
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(value) ? (value).value = $event : value = $event))
        }, null, 8 /* PROPS */, ["field", "options", "modelValue"]),
        createVNode(script$f, {
          cell: __props.bind.cell,
          store: unref(store),
          onOnCreate: onCreate
        }, null, 8 /* PROPS */, ["cell", "store"])
      ]))
    : (__props.bind.cell.recursive)
      ? (openBlock(), createBlock(unref(script$g), {
          key: 1,
          modelValue: unref(value),
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (isRef(value) ? (value).value = $event : value = $event)),
          options: options.value,
          placeholder: "Select Item"
        }, null, 8 /* PROPS */, ["modelValue", "options"]))
      : (openBlock(), createBlock(unref(script$n), {
          key: 2,
          name: __props.bind.cell.name,
          modelValue: unref(value),
          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => (isRef(value) ? (value).value = $event : value = $event)),
          disabled: true
        }, null, 8 /* PROPS */, ["name", "modelValue"]))
}
}

};

script$e.__file = "presstojam/src/components/form/id-edit.vue";

const _hoisted_1$8 = { key: 1 };


var script$d = {
  props: {
    bind : {
        type : Object,
        required : true
    }
},
  setup(__props) {

const props = __props;





const value = computed({
    get() {
        return props.bind.value.value;
    },
    set(val) {
        props.bind.setValue(val);
    }
});

const disabled = (props.bind.cell.system) ? true : false;


return (_ctx, _cache) => {
  return (unref(disabled)==false)
    ? (openBlock(), createBlock(unref(script$q), {
        key: 0,
        id: "range",
        modelValue: unref(value),
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(value) ? (value).value = $event : null)),
        disabledDates: __props.bind.cell.invalid_dates,
        manualInput: false,
        class: "focus:border-primary",
        dateFormat: "dd/mm/yy"
      }, null, 8 /* PROPS */, ["modelValue", "disabledDates"]))
    : (openBlock(), createElementBlock("span", _hoisted_1$8, toDisplayString$1(unref(value)), 1 /* TEXT */))
}
}

};

script$d.__file = "presstojam/src/components/form/time-edit.vue";

var script$c = {
  name: 'Password',
  emits: ['update:modelValue', 'change', 'focus', 'blur', 'invalid'],
  props: {
    modelValue: String,
    promptLabel: {
      type: String,
      default: null
    },
    mediumRegex: {
      type: String,
      default: '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})' // eslint-disable-line

    },
    strongRegex: {
      type: String,
      default: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})' // eslint-disable-line

    },
    weakLabel: {
      type: String,
      default: null
    },
    mediumLabel: {
      type: String,
      default: null
    },
    strongLabel: {
      type: String,
      default: null
    },
    feedback: {
      type: Boolean,
      default: true
    },
    appendTo: {
      type: String,
      default: 'body'
    },
    toggleMask: {
      type: Boolean,
      default: false
    },
    hideIcon: {
      type: String,
      default: 'pi pi-eye-slash'
    },
    showIcon: {
      type: String,
      default: 'pi pi-eye'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
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
    panelId: {
      type: String,
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
      overlayVisible: false,
      meter: null,
      infoText: null,
      focused: false,
      unmasked: false
    };
  },

  mediumCheckRegExp: null,
  strongCheckRegExp: null,
  resizeListener: null,
  scrollHandler: null,
  overlay: null,

  mounted() {
    this.infoText = this.promptText;
    this.mediumCheckRegExp = new RegExp(this.mediumRegex);
    this.strongCheckRegExp = new RegExp(this.strongRegex);
  },

  beforeUnmount() {
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
    onOverlayEnter(el) {
      ZIndexUtils.set('overlay', el, this.$primevue.config.zIndex.overlay);
      this.alignOverlay();
      this.bindScrollListener();
      this.bindResizeListener();
    },

    onOverlayLeave() {
      this.unbindScrollListener();
      this.unbindResizeListener();
      this.overlay = null;
    },

    onOverlayAfterLeave(el) {
      ZIndexUtils.clear(el);
    },

    alignOverlay() {
      if (this.appendTo === 'self') {
        DomHandler.relativePosition(this.overlay, this.$refs.input.$el);
      } else {
        this.overlay.style.minWidth = DomHandler.getOuterWidth(this.$refs.input.$el) + 'px';
        DomHandler.absolutePosition(this.overlay, this.$refs.input.$el);
      }
    },

    testStrength(str) {
      let level = 0;
      if (this.strongCheckRegExp.test(str)) level = 3;else if (this.mediumCheckRegExp.test(str)) level = 2;else if (str.length) level = 1;
      return level;
    },

    onInput(event) {
      this.$emit('update:modelValue', event.target.value);
    },

    onFocus(event) {
      this.focused = true;

      if (this.feedback) {
        this.setPasswordMeter(this.modelValue);
        this.overlayVisible = true;
      }

      this.$emit('focus', event);
    },

    onBlur(event) {
      this.focused = false;

      if (this.feedback) {
        this.overlayVisible = false;
      }

      this.$emit('blur', event);
    },

    onKeyUp(event) {
      if (this.feedback) {
        const value = event.target.value;
        const {
          meter,
          label
        } = this.checkPasswordStrength(value);
        this.meter = meter;
        this.infoText = label;

        if (event.code === 'Escape') {
          this.overlayVisible && (this.overlayVisible = false);
          return;
        }

        if (!this.overlayVisible) {
          this.overlayVisible = true;
        }
      }
    },

    setPasswordMeter() {
      if (!this.modelValue) return;
      const {
        meter,
        label
      } = this.checkPasswordStrength(this.modelValue);
      this.meter = meter;
      this.infoText = label;

      if (!this.overlayVisible) {
        this.overlayVisible = true;
      }
    },

    checkPasswordStrength(value) {
      let label = null;
      let meter = null;

      switch (this.testStrength(value)) {
        case 1:
          label = this.weakText;
          meter = {
            strength: 'weak',
            width: '33.33%'
          };
          break;

        case 2:
          label = this.mediumText;
          meter = {
            strength: 'medium',
            width: '66.66%'
          };
          break;

        case 3:
          label = this.strongText;
          meter = {
            strength: 'strong',
            width: '100%'
          };
          break;

        default:
          label = this.promptText;
          meter = null;
          break;
      }

      return {
        label,
        meter
      };
    },

    onInvalid(event) {
      this.$emit('invalid', event);
    },

    bindScrollListener() {
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.input.$el, () => {
          if (this.overlayVisible) {
            this.overlayVisible = false;
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
            this.overlayVisible = false;
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

    overlayRef(el) {
      this.overlay = el;
    },

    onMaskToggle() {
      this.unmasked = !this.unmasked;
    },

    onOverlayClick(event) {
      OverlayEventBus.emit('overlay-click', {
        originalEvent: event,
        target: this.$el
      });
    }

  },
  computed: {
    containerClass() {
      return ['p-password p-component p-inputwrapper', {
        'p-inputwrapper-filled': this.filled,
        'p-inputwrapper-focus': this.focused,
        'p-input-icon-right': this.toggleMask
      }];
    },

    inputFieldClass() {
      return ['p-password-input', this.inputClass, {
        'p-disabled': this.disabled
      }];
    },

    panelStyleClass() {
      return ['p-password-panel p-component', this.panelClass, {
        'p-input-filled': this.$primevue.config.inputStyle === 'filled',
        'p-ripple-disabled': this.$primevue.config.ripple === false
      }];
    },

    toggleIconClass() {
      return this.unmasked ? this.hideIcon : this.showIcon;
    },

    strengthClass() {
      return `p-password-strength ${this.meter ? this.meter.strength : ''}`;
    },

    inputType() {
      return this.unmasked ? 'text' : 'password';
    },

    filled() {
      return this.modelValue != null && this.modelValue.toString().length > 0;
    },

    weakText() {
      return this.weakLabel || this.$primevue.config.locale.weak;
    },

    mediumText() {
      return this.mediumLabel || this.$primevue.config.locale.medium;
    },

    strongText() {
      return this.strongLabel || this.$primevue.config.locale.strong;
    },

    promptText() {
      return this.promptLabel || this.$primevue.config.locale.passwordPrompt;
    },

    panelUniqueId() {
      return UniqueComponentId() + '_panel';
    }

  },
  components: {
    PInputText: script$r,
    Portal: script$m
  }
};
const _hoisted_1$7 = {
  class: "p-hidden-accessible",
  "aria-live": "polite"
};
const _hoisted_2$5 = ["id"];
const _hoisted_3$4 = {
  class: "p-password-meter"
};
const _hoisted_4$4 = {
  class: "p-password-info"
};

function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PInputText = resolveComponent("PInputText");

  const _component_Portal = resolveComponent("Portal");

  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.containerClass)
  }, [createVNode(_component_PInputText, mergeProps({
    ref: "input",
    id: $props.inputId,
    type: $options.inputType,
    class: $options.inputFieldClass,
    style: $props.inputStyle,
    value: $props.modelValue,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-label": _ctx.ariaLabel,
    "aria-controls": $props.panelProps && $props.panelProps.id || $props.panelId || $options.panelUniqueId,
    "aria-expanded": $data.overlayVisible,
    "aria-haspopup": true,
    placeholder: $props.placeholder,
    required: $props.required,
    onInput: $options.onInput,
    onFocus: $options.onFocus,
    onBlur: $options.onBlur,
    onKeyup: $options.onKeyUp,
    onInvalid: $options.onInvalid
  }, $props.inputProps), null, 16, ["id", "type", "class", "style", "value", "aria-labelledby", "aria-label", "aria-controls", "aria-expanded", "placeholder", "required", "onInput", "onFocus", "onBlur", "onKeyup", "onInvalid"]), $props.toggleMask ? (openBlock(), createElementBlock("i", {
    key: 0,
    class: normalizeClass($options.toggleIconClass),
    onClick: _cache[0] || (_cache[0] = (...args) => $options.onMaskToggle && $options.onMaskToggle(...args))
  }, null, 2)) : createCommentVNode("", true), createElementVNode("span", _hoisted_1$7, toDisplayString$1($data.infoText), 1), createVNode(_component_Portal, {
    appendTo: $props.appendTo
  }, {
    default: withCtx(() => [createVNode(Transition, {
      name: "p-connected-overlay",
      onEnter: $options.onOverlayEnter,
      onLeave: $options.onOverlayLeave,
      onAfterLeave: $options.onOverlayAfterLeave
    }, {
      default: withCtx(() => [$data.overlayVisible ? (openBlock(), createElementBlock("div", mergeProps({
        key: 0,
        ref: $options.overlayRef,
        id: $props.panelId || $options.panelUniqueId,
        class: $options.panelStyleClass,
        style: $props.panelStyle,
        onClick: _cache[1] || (_cache[1] = (...args) => $options.onOverlayClick && $options.onOverlayClick(...args))
      }, $props.panelProps), [renderSlot(_ctx.$slots, "header"), renderSlot(_ctx.$slots, "content", {}, () => [createElementVNode("div", _hoisted_3$4, [createElementVNode("div", {
        class: normalizeClass($options.strengthClass),
        style: normalizeStyle({
          width: $data.meter ? $data.meter.width : ''
        })
      }, null, 6)]), createElementVNode("div", _hoisted_4$4, toDisplayString$1($data.infoText), 1)]), renderSlot(_ctx.$slots, "footer")], 16, _hoisted_2$5)) : createCommentVNode("", true)]),
      _: 3
    }, 8, ["onEnter", "onLeave", "onAfterLeave"])]),
    _: 3
  }, 8, ["appendTo"])], 2);
}

function styleInject$4(css, ref) {
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

var css_248z$4 = "\n.p-password {\n    position: relative;\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n}\n.p-password-panel {\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.p-password .p-password-panel {\n    min-width: 100%;\n}\n.p-password-meter {\n    height: 10px;\n}\n.p-password-strength {\n    height: 100%;\n    width: 0;\n    -webkit-transition: width 1s ease-in-out;\n    transition: width 1s ease-in-out;\n}\n.p-fluid .p-password {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n";
styleInject$4(css_248z$4);
script$c.render = render$6;

var script$b = {
  name: 'Textarea',
  emits: ['update:modelValue'],
  props: {
    modelValue: null,
    autoResize: Boolean
  },

  mounted() {
    if (this.$el.offsetParent && this.autoResize) {
      this.resize();
    }
  },

  updated() {
    if (this.$el.offsetParent && this.autoResize) {
      this.resize();
    }
  },

  methods: {
    resize() {
      const style = window.getComputedStyle(this.$el);
      this.$el.style.height = 'auto';
      this.$el.style.height = `calc(${style.borderTopWidth} + ${style.borderBottomWidth} + ${this.$el.scrollHeight}px)`;

      if (parseFloat(this.$el.style.height) >= parseFloat(this.$el.style.maxHeight)) {
        this.$el.style.overflowY = 'scroll';
        this.$el.style.height = this.$el.style.maxHeight;
      } else {
        this.$el.style.overflow = 'hidden';
      }
    },

    onInput(event) {
      if (this.autoResize) {
        this.resize();
      }

      this.$emit('update:modelValue', event.target.value);
    }

  },
  computed: {
    filled() {
      return this.modelValue != null && this.modelValue.toString().length > 0;
    }

  }
};
const _hoisted_1$6 = ["value"];

function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("textarea", {
    class: normalizeClass(['p-inputtextarea p-inputtext p-component', {
      'p-filled': $options.filled,
      'p-inputtextarea-resizable ': $props.autoResize
    }]),
    value: $props.modelValue,
    onInput: _cache[0] || (_cache[0] = (...args) => $options.onInput && $options.onInput(...args))
  }, null, 42, _hoisted_1$6);
}

function styleInject$3(css, ref) {
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

var css_248z$3 = "\n.p-inputtextarea-resizable {\n    overflow: hidden;\n    resize: none;\n}\n.p-fluid .p-inputtextarea {\n    width: 100%;\n}\n";
styleInject$3(css_248z$3);
script$b.render = render$5;

var script$a = {
  props: {
    bind : {
        type : Object,
        required : true
    }
},
  setup(__props) {

const props = __props;




const value = computed({
    get() {
        return props.bind.value.value;
    },
    set(val) {
        props.bind.setValue(val);
    }
});

const cell = props.bind.cell;
const options = ref([]);
const { te, t } = useI18n();


const tag = computed(() => {
if (cell.isEnum()) {
    options.value = cell.getOptions();
    return "select";
} else if (cell.encrypted) {
    return "input";
} else if (cell.html || cell.max > 300) {
    return "textarea";
} else {
    return "input";
}
});



const atts = {};
if (cell.encrypted) {
    atts.type = "password";
}

if (cell.immutable) {
    atts.readonly = true;
}


let pholder = te("models." + cell.model + ".fields." + cell.name + ".placeholder");
if (pholder) {
    atts.placeholder = t("models." + cell.model + ".fields." + cell.name + ".placeholder");
}

if (cell.contains.includes("html")) {
    atts["data-html"] = 1;
}



return (_ctx, _cache) => {
  return (__props.bind.cell.encrypted)
    ? (openBlock(), createBlock(unref(script$c), {
        key: 0,
        modelValue: unref(value),
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(value) ? (value).value = $event : null)),
        class: "focus:border-primary"
      }, null, 8 /* PROPS */, ["modelValue"]))
    : (unref(tag)=='textarea')
      ? (openBlock(), createBlock(unref(script$b), {
          key: 1,
          modelValue: unref(value),
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (isRef(value) ? (value).value = $event : null)),
          rows: "5"
        }, null, 8 /* PROPS */, ["modelValue"]))
      : (unref(tag)=='select')
        ? (openBlock(), createBlock(unref(script$p), mergeProps({
            key: 2,
            modelValue: unref(value),
            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => (isRef(value) ? (value).value = $event : null)),
            name: __props.bind.cell.name
          }, atts, {
            optionLabel: "value",
            optionValue: "key",
            options: options.value,
            placeholder: "Please Select",
            class: "focus:border-primary",
            onBlur: _cache[3] || (_cache[3] = $event => (__props.bind.active_validation.value = true))
          }), null, 16 /* FULL_PROPS */, ["modelValue", "name", "options"]))
        : (openBlock(), createBlock(unref(script$r), mergeProps({ key: 3 }, atts, {
            name: __props.bind.cell.name,
            class: "focus:border-primary form-control",
            modelValue: unref(value),
            "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => (isRef(value) ? (value).value = $event : null)),
            onBlur: _cache[5] || (_cache[5] = $event => (__props.bind.active_validation.value = true))
          }), null, 16 /* FULL_PROPS */, ["name", "modelValue"]))
}
}

};

script$a.__file = "presstojam/src/components/form/string-edit.vue";

var script$9 = {
  name: 'Message',
  emits: ['close'],
  props: {
    severity: {
      type: String,
      default: 'info'
    },
    closable: {
      type: Boolean,
      default: true
    },
    sticky: {
      type: Boolean,
      default: true
    },
    life: {
      type: Number,
      default: 3000
    },
    icon: {
      type: String,
      default: null
    },
    closeIcon: {
      type: String,
      default: 'pi pi-times'
    }
  },
  timeout: null,

  data() {
    return {
      visible: true
    };
  },

  mounted() {
    if (!this.sticky) {
      setTimeout(() => {
        this.visible = false;
      }, this.life);
    }
  },

  methods: {
    close(event) {
      this.visible = false;
      this.$emit('close', event);
    }

  },
  computed: {
    containerClass() {
      return 'p-message p-component p-message-' + this.severity;
    },

    iconClass() {
      return ['p-message-icon pi', this.icon ? this.icon : {
        'pi-info-circle': this.severity === 'info',
        'pi-check': this.severity === 'success',
        'pi-exclamation-triangle': this.severity === 'warn',
        'pi-times-circle': this.severity === 'error'
      }];
    }

  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$5 = {
  class: "p-message-wrapper"
};
const _hoisted_2$4 = {
  class: "p-message-text"
};

function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");

  return openBlock(), createBlock(Transition, {
    name: "p-message",
    appear: ""
  }, {
    default: withCtx(() => [withDirectives(createElementVNode("div", {
      class: normalizeClass($options.containerClass),
      role: "alert"
    }, [createElementVNode("div", _hoisted_1$5, [createElementVNode("span", {
      class: normalizeClass($options.iconClass)
    }, null, 2), createElementVNode("div", _hoisted_2$4, [renderSlot(_ctx.$slots, "default")]), $props.closable ? withDirectives((openBlock(), createElementBlock("button", {
      key: 0,
      class: "p-message-close p-link",
      onClick: _cache[0] || (_cache[0] = $event => $options.close($event)),
      type: "button"
    }, [createElementVNode("i", {
      class: normalizeClass(['p-message-close-icon', $props.closeIcon])
    }, null, 2)])), [[_directive_ripple]]) : createCommentVNode("", true)])], 2), [[vShow, $data.visible]])]),
    _: 3
  });
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

var css_248z$2 = "\n.p-message-wrapper {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n.p-message-close {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n}\n.p-message-close.p-link {\n    margin-left: auto;\n    overflow: hidden;\n    position: relative;\n}\n.p-message-enter-from {\n    opacity: 0;\n}\n.p-message-enter-active {\n    -webkit-transition: opacity 0.3s;\n    transition: opacity 0.3s;\n}\n.p-message.p-message-leave-from {\n    max-height: 1000px;\n}\n.p-message.p-message-leave-to {\n    max-height: 0;\n    opacity: 0;\n    margin: 0 !important;\n}\n.p-message-leave-active {\n    overflow: hidden;\n    -webkit-transition: max-height 0.3s cubic-bezier(0, 1, 0, 1), opacity 0.3s, margin 0.15s;\n    transition: max-height 0.3s cubic-bezier(0, 1, 0, 1), opacity 0.3s, margin 0.15s;\n}\n.p-message-leave-active .p-message-close {\n    display: none;\n}\n";
styleInject$2(css_248z$2);
script$9.render = render$4;

var script$8 = {
  name: 'ProgressBar',
  props: {
    value: {
      type: Number,
      default: null
    },
    mode: {
      type: String,
      default: 'determinate'
    },
    showValue: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    containerClass() {
      return ['p-progressbar p-component', {
        'p-progressbar-determinate': this.determinate,
        'p-progressbar-indeterminate': this.indeterminate
      }];
    },

    progressStyle() {
      return {
        width: this.value + '%',
        display: 'flex'
      };
    },

    indeterminate() {
      return this.mode === 'indeterminate';
    },

    determinate() {
      return this.mode === 'determinate';
    }

  }
};
const _hoisted_1$4 = ["aria-valuenow"];
const _hoisted_2$3 = {
  key: 0,
  class: "p-progressbar-label"
};
const _hoisted_3$3 = {
  key: 1,
  class: "p-progressbar-indeterminate-container"
};

const _hoisted_4$3 = /*#__PURE__*/createElementVNode("div", {
  class: "p-progressbar-value p-progressbar-value-animate"
}, null, -1);

const _hoisted_5$3 = [_hoisted_4$3];

function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    role: "progressbar",
    class: normalizeClass($options.containerClass),
    "aria-valuemin": "0",
    "aria-valuenow": $props.value,
    "aria-valuemax": "100"
  }, [$options.determinate ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: "p-progressbar-value p-progressbar-value-animate",
    style: normalizeStyle($options.progressStyle)
  }, [$props.value != null && $props.value !== 0 && $props.showValue ? (openBlock(), createElementBlock("div", _hoisted_2$3, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString$1($props.value + '%'), 1)])])) : createCommentVNode("", true)], 4)) : createCommentVNode("", true), $options.indeterminate ? (openBlock(), createElementBlock("div", _hoisted_3$3, _hoisted_5$3)) : createCommentVNode("", true)], 10, _hoisted_1$4);
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

var css_248z$1 = "\n.p-progressbar {\n    position: relative;\n    overflow: hidden;\n}\n.p-progressbar-determinate .p-progressbar-value {\n    height: 100%;\n    width: 0%;\n    position: absolute;\n    display: none;\n    border: 0 none;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    overflow: hidden;\n}\n.p-progressbar-determinate .p-progressbar-label {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n}\n.p-progressbar-determinate .p-progressbar-value-animate {\n    -webkit-transition: width 1s ease-in-out;\n    transition: width 1s ease-in-out;\n}\n.p-progressbar-indeterminate .p-progressbar-value::before {\n    content: '';\n    position: absolute;\n    background-color: inherit;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    will-change: left, right;\n    -webkit-animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n    animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n}\n.p-progressbar-indeterminate .p-progressbar-value::after {\n    content: '';\n    position: absolute;\n    background-color: inherit;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    will-change: left, right;\n    -webkit-animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n    animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n    -webkit-animation-delay: 1.15s;\n    animation-delay: 1.15s;\n}\n@-webkit-keyframes p-progressbar-indeterminate-anim {\n0% {\n        left: -35%;\n        right: 100%;\n}\n60% {\n        left: 100%;\n        right: -90%;\n}\n100% {\n        left: 100%;\n        right: -90%;\n}\n}\n@keyframes p-progressbar-indeterminate-anim {\n0% {\n        left: -35%;\n        right: 100%;\n}\n60% {\n        left: 100%;\n        right: -90%;\n}\n100% {\n        left: 100%;\n        right: -90%;\n}\n}\n@-webkit-keyframes p-progressbar-indeterminate-anim-short {\n0% {\n        left: -200%;\n        right: 100%;\n}\n60% {\n        left: 107%;\n        right: -8%;\n}\n100% {\n        left: 107%;\n        right: -8%;\n}\n}\n@keyframes p-progressbar-indeterminate-anim-short {\n0% {\n        left: -200%;\n        right: 100%;\n}\n60% {\n        left: 107%;\n        right: -8%;\n}\n100% {\n        left: 107%;\n        right: -8%;\n}\n}\n";
styleInject$1(css_248z$1);
script$8.render = render$3;

var script$7 = {
  name: 'Badge',
  props: {
    value: null,
    severity: null,
    size: null
  },
  computed: {
    containerClass() {
      return this.$slots.default ? 'p-overlay-badge' : this.badgeClass;
    },

    badgeClass() {
      return ['p-badge p-component', {
        'p-badge-no-gutter': this.value && String(this.value).length === 1,
        'p-badge-dot': !this.value && !this.$slots.default,
        'p-badge-lg': this.size === 'large',
        'p-badge-xl': this.size === 'xlarge',
        'p-badge-info': this.severity === 'info',
        'p-badge-success': this.severity === 'success',
        'p-badge-warning': this.severity === 'warning',
        'p-badge-danger': this.severity === 'danger'
      }];
    }

  }
};

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", {
    class: normalizeClass($options.badgeClass)
  }, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString$1($props.value), 1)])], 2);
}

script$7.render = render$2;

var script$1$1 = {
  emits: ['remove'],
  props: {
    files: {
      type: Array,
      default: () => []
    },
    badgeSeverity: {
      type: String,
      default: 'warning'
    },
    badgeValue: {
      type: String,
      default: null
    },
    previewWidth: {
      type: Number,
      default: 50
    }
  },
  methods: {
    formatSize(bytes) {
      if (bytes === 0) {
        return '0 B';
      }

      let k = 1000,
          dm = 3,
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

  },
  components: {
    FileUploadButton: script$o,
    FileUploadBadge: script$7
  }
};
const _hoisted_1$1$1 = ["alt", "src", "width"];
const _hoisted_2$1$1 = {
  class: "p-fileupload-file-details"
};
const _hoisted_3$1$1 = {
  class: "p-fileupload-file-name"
};
const _hoisted_4$1$1 = {
  class: "p-fileupload-file-size"
};
const _hoisted_5$1 = {
  class: "p-fileupload-file-actions"
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FileUploadBadge = resolveComponent("FileUploadBadge");

  const _component_FileUploadButton = resolveComponent("FileUploadButton");

  return openBlock(true), createElementBlock(Fragment, null, renderList($props.files, (file, index) => {
    return openBlock(), createElementBlock("div", {
      key: file.name + file.type + file.size,
      class: "p-fileupload-file"
    }, [createElementVNode("img", {
      role: "presentation",
      class: "p-fileupload-file-thumbnail",
      alt: file.name,
      src: file.objectURL,
      width: $props.previewWidth
    }, null, 8, _hoisted_1$1$1), createElementVNode("div", _hoisted_2$1$1, [createElementVNode("div", _hoisted_3$1$1, toDisplayString$1(file.name), 1), createElementVNode("span", _hoisted_4$1$1, toDisplayString$1($options.formatSize(file.size)), 1), createVNode(_component_FileUploadBadge, {
      value: $props.badgeValue,
      class: "p-fileupload-file-badge",
      severity: $props.badgeSeverity
    }, null, 8, ["value", "severity"])]), createElementVNode("div", _hoisted_5$1, [createVNode(_component_FileUploadButton, {
      icon: "pi pi-times",
      onClick: $event => _ctx.$emit('remove', index),
      class: "p-fileupload-file-remove p-button-text p-button-danger p-button-rounded"
    }, null, 8, ["onClick"])])]);
  }), 128);
}

script$1$1.render = render$1;
var script$6 = {
  name: 'FileUpload',
  emits: ['select', 'uploader', 'before-upload', 'progress', 'upload', 'error', 'before-send', 'clear', 'remove', 'removeUploadedFile'],
  props: {
    name: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    mode: {
      type: String,
      default: 'advanced'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    auto: {
      type: Boolean,
      default: false
    },
    maxFileSize: {
      type: Number,
      default: null
    },
    invalidFileSizeMessage: {
      type: String,
      default: '{0}: Invalid file size, file size should be smaller than {1}.'
    },
    invalidFileTypeMessage: {
      type: String,
      default: '{0}: Invalid file type, allowed file types: {1}.'
    },
    fileLimit: {
      type: Number,
      default: null
    },
    invalidFileLimitMessage: {
      type: String,
      default: 'Maximum number of files exceeded, limit is {0} at most.'
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    previewWidth: {
      type: Number,
      default: 50
    },
    chooseLabel: {
      type: String,
      default: null
    },
    uploadLabel: {
      type: String,
      default: null
    },
    cancelLabel: {
      type: String,
      default: null
    },
    customUpload: {
      type: Boolean,
      default: false
    },
    showUploadButton: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    chooseIcon: {
      type: String,
      default: 'pi pi-plus'
    },
    uploadIcon: {
      type: String,
      default: 'pi pi-upload'
    },
    cancelIcon: {
      type: String,
      default: 'pi pi-times'
    },
    style: null,
    class: null
  },
  duplicateIEEvent: false,

  data() {
    return {
      uploadedFileCount: 0,
      files: [],
      messages: [],
      focused: false,
      progress: null,
      uploadedFiles: []
    };
  },

  methods: {
    onFileSelect(event) {
      if (event.type !== 'drop' && this.isIE11() && this.duplicateIEEvent) {
        this.duplicateIEEvent = false;
        return;
      }

      this.messages = [];
      this.files = this.files || [];
      let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

      for (let file of files) {
        if (!this.isFileSelected(file)) {
          if (this.validate(file)) {
            if (this.isImage(file)) {
              file.objectURL = window.URL.createObjectURL(file);
            }

            this.files.push(file);
          }
        }
      }

      this.$emit('select', {
        originalEvent: event,
        files: this.files
      });

      if (this.fileLimit) {
        this.checkFileLimit();
      }

      if (this.auto && this.hasFiles && !this.isFileLimitExceeded()) {
        this.upload();
      }

      if (event.type !== 'drop' && this.isIE11()) {
        this.clearIEInput();
      } else {
        this.clearInputElement();
      }
    },

    choose() {
      this.$refs.fileInput.click();
    },

    upload() {
      if (this.customUpload) {
        if (this.fileLimit) {
          this.uploadedFileCount += this.files.length;
        }

        this.$emit('uploader', {
          files: this.files
        });
        this.clear();
      } else {
        let xhr = new XMLHttpRequest();
        let formData = new FormData();
        this.$emit('before-upload', {
          xhr: xhr,
          formData: formData
        });

        for (let file of this.files) {
          formData.append(this.name, file, file.name);
        }

        xhr.upload.addEventListener('progress', event => {
          if (event.lengthComputable) {
            this.progress = Math.round(event.loaded * 100 / event.total);
          }

          this.$emit('progress', {
            originalEvent: event,
            progress: this.progress
          });
        });

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            this.progress = 0;

            if (xhr.status >= 200 && xhr.status < 300) {
              if (this.fileLimit) {
                this.uploadedFileCount += this.files.length;
              }

              this.$emit('upload', {
                xhr: xhr,
                files: this.files
              });
            } else {
              this.$emit('error', {
                xhr: xhr,
                files: this.files
              });
            }

            this.uploadedFiles.push(...this.files);
            this.clear();
          }
        };

        xhr.open('POST', this.url, true);
        this.$emit('before-send', {
          xhr: xhr,
          formData: formData
        });
        xhr.withCredentials = this.withCredentials;
        xhr.send(formData);
      }
    },

    clear() {
      this.files = [];
      this.messages = null;
      this.$emit('clear');

      if (this.isAdvanced) {
        this.clearInputElement();
      }
    },

    onFocus() {
      this.focused = true;
    },

    onBlur() {
      this.focused = false;
    },

    isFileSelected(file) {
      if (this.files && this.files.length) {
        for (let sFile of this.files) {
          if (sFile.name + sFile.type + sFile.size === file.name + file.type + file.size) return true;
        }
      }

      return false;
    },

    isIE11() {
      return !!window['MSInputMethodContext'] && !!document['documentMode'];
    },

    validate(file) {
      if (this.accept && !this.isFileTypeValid(file)) {
        this.messages.push(this.invalidFileTypeMessage.replace('{0}', file.name).replace('{1}', this.accept));
        return false;
      }

      if (this.maxFileSize && file.size > this.maxFileSize) {
        this.messages.push(this.invalidFileSizeMessage.replace('{0}', file.name).replace('{1}', this.formatSize(this.maxFileSize)));
        return false;
      }

      return true;
    },

    isFileTypeValid(file) {
      let acceptableTypes = this.accept.split(',').map(type => type.trim());

      for (let type of acceptableTypes) {
        let acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type) : file.type == type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();

        if (acceptable) {
          return true;
        }
      }

      return false;
    },

    getTypeClass(fileType) {
      return fileType.substring(0, fileType.indexOf('/'));
    },

    isWildcard(fileType) {
      return fileType.indexOf('*') !== -1;
    },

    getFileExtension(file) {
      return '.' + file.name.split('.').pop();
    },

    isImage(file) {
      return /^image\//.test(file.type);
    },

    onDragEnter(event) {
      if (!this.disabled) {
        event.stopPropagation();
        event.preventDefault();
      }
    },

    onDragOver(event) {
      if (!this.disabled) {
        DomHandler.addClass(this.$refs.content, 'p-fileupload-highlight');
        event.stopPropagation();
        event.preventDefault();
      }
    },

    onDragLeave() {
      if (!this.disabled) {
        DomHandler.removeClass(this.$refs.content, 'p-fileupload-highlight');
      }
    },

    onDrop(event) {
      if (!this.disabled) {
        DomHandler.removeClass(this.$refs.content, 'p-fileupload-highlight');
        event.stopPropagation();
        event.preventDefault();
        const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        const allowDrop = this.multiple || files && files.length === 1;

        if (allowDrop) {
          this.onFileSelect(event);
        }
      }
    },

    onBasicUploaderClick() {
      if (this.hasFiles) this.upload();else this.$refs.fileInput.click();
    },

    remove(index) {
      this.clearInputElement();
      let removedFile = this.files.splice(index, 1)[0];
      this.files = [...this.files];
      this.$emit('remove', {
        file: removedFile,
        files: this.files
      });
    },

    removeUploadedFile(index) {
      let removedFile = this.uploadedFiles.splice(index, 1)[0];
      this.uploadedFiles = [...this.uploadedFiles];
      this.$emit('removeUploadedFile', {
        file: removedFile,
        files: this.uploadedFiles
      });
    },

    clearInputElement() {
      this.$refs.fileInput.value = '';
    },

    clearIEInput() {
      if (this.$refs.fileInput) {
        this.duplicateIEEvent = true; //IE11 fix to prevent onFileChange trigger again

        this.$refs.fileInput.value = '';
      }
    },

    formatSize(bytes) {
      if (bytes === 0) {
        return '0 B';
      }

      let k = 1000,
          dm = 3,
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    isFileLimitExceeded() {
      if (this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount && this.focused) {
        this.focused = false;
      }

      return this.fileLimit && this.fileLimit < this.files.length + this.uploadedFileCount;
    },

    checkFileLimit() {
      if (this.isFileLimitExceeded()) {
        this.messages.push(this.invalidFileLimitMessage.replace('{0}', this.fileLimit.toString()));
      }
    },

    onMessageClose() {
      this.messages = null;
    }

  },
  computed: {
    isAdvanced() {
      return this.mode === 'advanced';
    },

    isBasic() {
      return this.mode === 'basic';
    },

    advancedChooseButtonClass() {
      return ['p-button p-component p-fileupload-choose', this.class, {
        'p-disabled': this.disabled,
        'p-focus': this.focused
      }];
    },

    basicChooseButtonClass() {
      return ['p-button p-component p-fileupload-choose', this.class, {
        'p-fileupload-choose-selected': this.hasFiles,
        'p-disabled': this.disabled,
        'p-focus': this.focused
      }];
    },

    advancedChooseIconClass() {
      return ['p-button-icon p-button-icon-left pi-fw', this.chooseIcon];
    },

    basicChooseButtonIconClass() {
      return ['p-button-icon p-button-icon-left', !this.hasFiles || this.auto ? this.uploadIcon : this.chooseIcon];
    },

    basicChooseButtonLabel() {
      return this.auto ? this.chooseButtonLabel : this.hasFiles ? this.files.map(f => f.name).join(', ') : this.chooseButtonLabel;
    },

    hasFiles() {
      return this.files && this.files.length > 0;
    },

    hasUploadedFiles() {
      return this.uploadedFiles && this.uploadedFiles.length > 0;
    },

    chooseDisabled() {
      return this.disabled || this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount;
    },

    uploadDisabled() {
      return this.disabled || !this.hasFiles || this.fileLimit && this.fileLimit < this.files.length;
    },

    cancelDisabled() {
      return this.disabled || !this.hasFiles;
    },

    chooseButtonLabel() {
      return this.chooseLabel || this.$primevue.config.locale.choose;
    },

    uploadButtonLabel() {
      return this.uploadLabel || this.$primevue.config.locale.upload;
    },

    cancelButtonLabel() {
      return this.cancelLabel || this.$primevue.config.locale.cancel;
    },

    completedLabel() {
      return this.$primevue.config.locale.completed;
    },

    pendingLabel() {
      return this.$primevue.config.locale.pending;
    }

  },
  components: {
    FileUploadButton: script$o,
    FileUploadProgressBar: script$8,
    FileUploadMessage: script$9,
    FileContent: script$1$1
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$3 = {
  key: 0,
  class: "p-fileupload p-fileupload-advanced p-component"
};
const _hoisted_2$2 = ["multiple", "accept", "disabled"];
const _hoisted_3$2 = {
  class: "p-fileupload-buttonbar"
};
const _hoisted_4$2 = {
  class: "p-button-label"
};
const _hoisted_5$2 = {
  key: 0,
  class: "p-fileupload-empty"
};
const _hoisted_6$1 = {
  key: 1,
  class: "p-fileupload p-fileupload-basic p-component"
};
const _hoisted_7 = {
  class: "p-button-label"
};
const _hoisted_8 = ["accept", "disabled", "multiple"];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FileUploadButton = resolveComponent("FileUploadButton");

  const _component_FileUploadProgressBar = resolveComponent("FileUploadProgressBar");

  const _component_FileUploadMessage = resolveComponent("FileUploadMessage");

  const _component_FileContent = resolveComponent("FileContent");

  const _directive_ripple = resolveDirective("ripple");

  return $options.isAdvanced ? (openBlock(), createElementBlock("div", _hoisted_1$3, [createElementVNode("input", {
    ref: "fileInput",
    type: "file",
    onChange: _cache[0] || (_cache[0] = (...args) => $options.onFileSelect && $options.onFileSelect(...args)),
    multiple: $props.multiple,
    accept: $props.accept,
    disabled: $options.chooseDisabled
  }, null, 40, _hoisted_2$2), createElementVNode("div", _hoisted_3$2, [renderSlot(_ctx.$slots, "header", {
    files: $data.files,
    uploadedFiles: $data.uploadedFiles,
    chooseCallback: $options.choose,
    uploadCallback: $options.upload,
    clearCallback: $options.clear
  }, () => [withDirectives((openBlock(), createElementBlock("span", {
    class: normalizeClass($options.advancedChooseButtonClass),
    style: normalizeStyle($props.style),
    onClick: _cache[1] || (_cache[1] = (...args) => $options.choose && $options.choose(...args)),
    onKeydown: _cache[2] || (_cache[2] = withKeys((...args) => $options.choose && $options.choose(...args), ["enter"])),
    onFocus: _cache[3] || (_cache[3] = (...args) => $options.onFocus && $options.onFocus(...args)),
    onBlur: _cache[4] || (_cache[4] = (...args) => $options.onBlur && $options.onBlur(...args)),
    tabindex: "0"
  }, [createElementVNode("span", {
    class: normalizeClass($options.advancedChooseIconClass)
  }, null, 2), createElementVNode("span", _hoisted_4$2, toDisplayString$1($options.chooseButtonLabel), 1)], 38)), [[_directive_ripple]]), $props.showUploadButton ? (openBlock(), createBlock(_component_FileUploadButton, {
    key: 0,
    label: $options.uploadButtonLabel,
    icon: $props.uploadIcon,
    onClick: $options.upload,
    disabled: $options.uploadDisabled
  }, null, 8, ["label", "icon", "onClick", "disabled"])) : createCommentVNode("", true), $props.showCancelButton ? (openBlock(), createBlock(_component_FileUploadButton, {
    key: 1,
    label: $options.cancelButtonLabel,
    icon: $props.cancelIcon,
    onClick: $options.clear,
    disabled: $options.cancelDisabled
  }, null, 8, ["label", "icon", "onClick", "disabled"])) : createCommentVNode("", true)])]), createElementVNode("div", {
    ref: "content",
    class: "p-fileupload-content",
    onDragenter: _cache[5] || (_cache[5] = (...args) => $options.onDragEnter && $options.onDragEnter(...args)),
    onDragover: _cache[6] || (_cache[6] = (...args) => $options.onDragOver && $options.onDragOver(...args)),
    onDragleave: _cache[7] || (_cache[7] = (...args) => $options.onDragLeave && $options.onDragLeave(...args)),
    onDrop: _cache[8] || (_cache[8] = (...args) => $options.onDrop && $options.onDrop(...args))
  }, [renderSlot(_ctx.$slots, "content", {
    files: $data.files,
    uploadedFiles: $data.uploadedFiles,
    removeUploadedFileCallback: $options.removeUploadedFile,
    removeFileCallback: $options.remove,
    progress: $data.progress,
    messages: $data.messages
  }, () => [$options.hasFiles ? (openBlock(), createBlock(_component_FileUploadProgressBar, {
    key: 0,
    value: $data.progress,
    showValue: false
  }, null, 8, ["value"])) : createCommentVNode("", true), (openBlock(true), createElementBlock(Fragment, null, renderList($data.messages, msg => {
    return openBlock(), createBlock(_component_FileUploadMessage, {
      key: msg,
      severity: "error",
      onClose: $options.onMessageClose
    }, {
      default: withCtx(() => [createTextVNode(toDisplayString$1(msg), 1)]),
      _: 2
    }, 1032, ["onClose"]);
  }), 128)), $options.hasFiles ? (openBlock(), createBlock(_component_FileContent, {
    key: 1,
    files: $data.files,
    onRemove: $options.remove,
    badgeValue: $options.pendingLabel,
    previewWidth: $props.previewWidth
  }, null, 8, ["files", "onRemove", "badgeValue", "previewWidth"])) : createCommentVNode("", true), createVNode(_component_FileContent, {
    files: $data.uploadedFiles,
    onRemove: $options.removeUploadedFile,
    badgeValue: $options.completedLabel,
    badgeSeverity: "success",
    previewWidth: $props.previewWidth
  }, null, 8, ["files", "onRemove", "badgeValue", "previewWidth"])]), _ctx.$slots.empty && !$options.hasFiles && !$options.hasUploadedFiles ? (openBlock(), createElementBlock("div", _hoisted_5$2, [renderSlot(_ctx.$slots, "empty")])) : createCommentVNode("", true)], 544)])) : $options.isBasic ? (openBlock(), createElementBlock("div", _hoisted_6$1, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.messages, msg => {
    return openBlock(), createBlock(_component_FileUploadMessage, {
      key: msg,
      severity: "error",
      onClose: $options.onMessageClose
    }, {
      default: withCtx(() => [createTextVNode(toDisplayString$1(msg), 1)]),
      _: 2
    }, 1032, ["onClose"]);
  }), 128)), withDirectives((openBlock(), createElementBlock("span", {
    class: normalizeClass($options.basicChooseButtonClass),
    style: normalizeStyle($props.style),
    onMouseup: _cache[12] || (_cache[12] = (...args) => $options.onBasicUploaderClick && $options.onBasicUploaderClick(...args)),
    onKeydown: _cache[13] || (_cache[13] = withKeys((...args) => $options.choose && $options.choose(...args), ["enter"])),
    onFocus: _cache[14] || (_cache[14] = (...args) => $options.onFocus && $options.onFocus(...args)),
    onBlur: _cache[15] || (_cache[15] = (...args) => $options.onBlur && $options.onBlur(...args)),
    tabindex: "0"
  }, [createElementVNode("span", {
    class: normalizeClass($options.basicChooseButtonIconClass)
  }, null, 2), createElementVNode("span", _hoisted_7, toDisplayString$1($options.basicChooseButtonLabel), 1), !$options.hasFiles ? (openBlock(), createElementBlock("input", {
    key: 0,
    ref: "fileInput",
    type: "file",
    accept: $props.accept,
    disabled: $props.disabled,
    multiple: $props.multiple,
    onChange: _cache[9] || (_cache[9] = (...args) => $options.onFileSelect && $options.onFileSelect(...args)),
    onFocus: _cache[10] || (_cache[10] = (...args) => $options.onFocus && $options.onFocus(...args)),
    onBlur: _cache[11] || (_cache[11] = (...args) => $options.onBlur && $options.onBlur(...args))
  }, null, 40, _hoisted_8)) : createCommentVNode("", true)], 38)), [[_directive_ripple]])])) : createCommentVNode("", true);
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

var css_248z = "\n.p-fileupload-content {\n    position: relative;\n}\n.p-fileupload-content .p-progressbar {\n    width: 100%;\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.p-button.p-fileupload-choose {\n    position: relative;\n    overflow: hidden;\n}\n.p-fileupload-buttonbar {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n}\n.p-fileupload > input[type='file'],\n.p-fileupload-basic input[type='file'] {\n    display: none;\n}\n.p-fluid .p-fileupload .p-button {\n    width: auto;\n}\n.p-fileupload-file {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n.p-fileupload-file-thumbnail {\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n}\n.p-fileupload-file-actions {\n    margin-left: auto;\n}\n";
styleInject(css_248z);
script$6.render = render;

// accept="image/*" 



var script$5 = {
  props: {
    bind : {
        type : Object,
        required : true
    },
    id : Number
},
  setup(__props) {




const value = computed({
    get() {
        return bind.value.value;
    },
    set(val) {
        bind.setValue(val);
    }
});


function onUpload(e) {
    if (e.files.length == 0) {
        value.value = null;
    } else {
        value.value = e.files[0];
    }
}


return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$6), {
    mode: "basic",
    name: __props.bind.cell.name,
    customUpload: true,
    maxFileSize: 1000000,
    onSelect: onUpload
  }, null, 8 /* PROPS */, ["name"]))
}
}

};

script$5.__file = "presstojam/src/components/form/asset-edit.vue";

const _hoisted_1$2 = {
  key: 0,
  class: "p-error"
};
const _hoisted_2$1 = {
  key: 1,
  class: "p-error"
};
const _hoisted_3$1 = {
  key: 2,
  class: "p-error"
};
const _hoisted_4$1 = {
  key: 3,
  class: "p-error"
};
const _hoisted_5 = {
  key: 4,
  class: "p-error"
};
const _hoisted_6 = {
  key: 5,
  class: "p-error"
};


var script$4 = {
  props: {
  error : Number,
  field : Object
},
  setup(__props) {




/*
  const OK = 0;
    const OutOfRangeMin = 1;
    const OutOfRangeMax = 2;
    const Characters = 3;
    const CharactersNegative = 4;
    const Unique = 5;
    const NullViolation = 6;
*/


return (_ctx, _cache) => {
  return (__props.error == 1)
    ? (openBlock(), createElementBlock("small", _hoisted_1$2, toDisplayString$1(_ctx.$t("errors.min",  { min : __props.field.min })), 1 /* TEXT */))
    : (__props.error == 2)
      ? (openBlock(), createElementBlock("small", _hoisted_2$1, toDisplayString$1(_ctx.$t("errors.max", { max : __props.field.max })), 1 /* TEXT */))
      : (__props.error == 3)
        ? (openBlock(), createElementBlock("small", _hoisted_3$1, toDisplayString$1(_ctx.$t("errors.contains", { char : __props.field.contains })), 1 /* TEXT */))
        : (__props.error == 4)
          ? (openBlock(), createElementBlock("small", _hoisted_4$1, toDisplayString$1(_ctx.$t("errors.notcontains",  { char : __props.field.notcontains })), 1 /* TEXT */))
          : (__props.error == 5)
            ? (openBlock(), createElementBlock("small", _hoisted_5, toDisplayString$1(_ctx.$t("errors.unique")), 1 /* TEXT */))
            : (__props.error == 6)
              ? (openBlock(), createElementBlock("small", _hoisted_6, toDisplayString$1(_ctx.$t("errors.null")), 1 /* TEXT */))
              : createCommentVNode("v-if", true)
}
}

};

script$4.__file = "presstojam/src/components/form/error.vue";

const _hoisted_1$1 = ["for"];



var script$3 = {
  props: {
    bind : {
        type : Object,
        required : true
    }
},
  setup(__props) {

const props = __props;




const binds = computed(() => {
    const arr = [];
    for(let i in props.bind.children.binds) {
        if (props.bind.children.binds[i].active.value) {
            arr.push(props.bind.children.binds[i]);
        } 
    }
    return arr;
});


return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$s), {
    legend: _ctx.$t('models.' + __props.bind.cell.model + '.fields.' + __props.bind.cell.name + '.label')
  }, {
    default: withCtx(() => [
      (openBlock(true), createElementBlock(Fragment, null, renderList(unref(binds), (jbind) => {
        return (openBlock(), createElementBlock("div", {
          class: "field form-group",
          key: jbind.cell.name
        }, [
          createElementVNode("label", {
            for: jbind.cell.name
          }, toDisplayString$1(_ctx.$t("models." + jbind.cell.model + ".fields." + jbind.cell.name + ".label")), 9 /* TEXT, PROPS */, _hoisted_1$1),
          createVNode(script$2, { bind: jbind }, null, 8 /* PROPS */, ["bind"]),
          (jbind.active_validation && jbind.error)
            ? (openBlock(), createBlock(script$4, {
                key: 0,
                field: jbind.cell,
                error: jbind.error
              }, null, 8 /* PROPS */, ["field", "error"]))
            : createCommentVNode("v-if", true)
        ]))
      }), 128 /* KEYED_FRAGMENT */))
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["legend"]))
}
}

};

script$3.__file = "presstojam/src/components/form/json-edit.vue";

var script$2 = {
  props: {
    bind : Object,
    active_validation : Boolean
},
  emits: [
    "update:modelValue"
],
  setup(__props, { emit: emits }) {

 




return (_ctx, _cache) => {
  return (__props.bind.cell.type=='number')
    ? (openBlock(), createBlock(script$j, {
        key: 0,
        bind: __props.bind
      }, null, 8 /* PROPS */, ["bind"]))
    : (__props.bind.cell.type=='flag')
      ? (openBlock(), createBlock(script$h, {
          key: 1,
          bind: __props.bind
        }, null, 8 /* PROPS */, ["bind"]))
      : (__props.bind.cell.type=='id')
        ? (openBlock(), createBlock(script$e, {
            key: 2,
            bind: __props.bind
          }, null, 8 /* PROPS */, ["bind"]))
        : (__props.bind.cell.type=='asset')
          ? (openBlock(), createBlock(script$5, {
              key: 3,
              bind: __props.bind
            }, null, 8 /* PROPS */, ["bind"]))
          : (__props.bind.cell.type=='time')
            ? (openBlock(), createBlock(script$d, {
                key: 4,
                bind: __props.bind
              }, null, 8 /* PROPS */, ["bind"]))
            : (__props.bind.cell.type=='json')
              ? (openBlock(), createBlock(script$3, {
                  key: 5,
                  bind: __props.bind,
                  active_validation: __props.active_validation
                }, null, 8 /* PROPS */, ["bind", "active_validation"]))
              : (openBlock(), createBlock(script$a, {
                  key: 6,
                  bind: __props.bind
                }, null, 8 /* PROPS */, ["bind"]))
}
}

};

script$2.__file = "presstojam/src/components/form/edit-field.vue";

var script$1 = {
  props: {
    modelValue : [Number, String, Boolean],
    model : String,
    common_parent : String,
    common_id : Number
},
  emits: [
    "update:modelValue"
],
  setup(__props, { emit: emits }) {

const props = __props;



const client = inject("client");



getRouteStructure(props.model);

const store = createTemporaryStore(client, props.model);
const params = { to : props.common_parent };
params[props.common_parent + "/--id"] = props.common_id; 
store.setParams({ to : props.common_parent });
store.load()
.then(() => {
    console.log(store.data.value);
});


const options = ref([]);
let value;



return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$g), {
    modelValue: unref(value),
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (isRef(value) ? (value).value = $event : value = $event)),
    options: options.value,
    placeholder: "Select Item"
  }, null, 8 /* PROPS */, ["modelValue", "options"]))
}
}

};

script$1.__file = "presstojam/src/components/form/parent-select.vue";

function createBind(cell, value) {
  value = cell.clean(value);
  const obj = {
    cell: cell,
    children: null,
    error: ref(cell.validate(value)),
    value: ref(value),
    is_dirty: false,
    active: ref(true),
    active_validation: ref(false),
    group: null,

    setError(error) {
      this.error.value = error;
    },

    setValue(val) {
      val = this.cell.clean(val);
      this.error.value = this.cell.validate(val);
      this.value.value = val;
      this.setDirty(true);
      if (this.group) this.group.setActiveBinds(this.cell.name, this.value.value);
    },

    setDirty(dirty) {
      if (dirty) {
        this.is_dirty = dirty;
        if (this.group) this.group.setDirty(dirty);
      }
    },

    activateValidation() {
      this.active_validation.value = true;
    }

  };

  if (cell.type == "json") {
    obj.children = createBindGroup(obj);

    for (let field in cell.fields) {
      let cvalue = value ? value[field] : null;
      obj.children.addBind(field, createBind(cell.fields[field], cvalue));
    }
  }

  return obj;
}
function createBindGroup(parent = null) {
  return {
    binds: {},
    parent_bind: parent,
    is_dirty: false,

    setActiveBinds(field, value) {
      for (let i in this.binds) {
        const cell = this.binds[i].cell; //only need to change active value if there is a where clause

        if (cell.where && cell.where.on == field) {
          this.binds[i].active.value = cell.where.is == value;
        }

        if (this.binds[i].children) {
          this.binds[i].children.setActiveBinds(field, value);
        }
      }
    },

    setInitActive() {
      for (let i in this.binds) {
        this.setActiveBinds(i, this.binds[i].value.value);

        if (this.binds[i].children) {
          this.binds[i].children.setInitActive();
        }
      }
    },

    addBind(field, bind) {
      this.binds[field] = bind;
      bind.group = this;
    },

    setDirty(dirty) {
      this.is_dirty = dirty;
      if (this.parent_bind) this.parent_bind.setDirty(dirty);
    },

    hasErrors() {
      for (let i in this.binds) {
        if (this.binds[i].error.value) {
          console.log("Error for ", i, this.binds[i].error.value);
          return true;
        }

        if (this.binds[i].children) {
          if (this.binds[i].children.hasErrors()) return true;
        }
      }
    },

    activateValidation() {
      for (let i in this.binds) {
        this.binds[i].activateValidation();
      }
    }

  };
}

const _hoisted_1 = ["onSubmit"];
const _hoisted_2 = /*#__PURE__*/createTextVNode("Saved");
const _hoisted_3 = {
  key: 1,
  class: "form-group"
};
const _hoisted_4 = ["for"];



var script = {
  props: {
    schema : Object,
    data : Object,
    model : String,
    parent : Boolean,
    method : {
        type : String,
        default : 'post'
    }
},
  emits: [
    "saved", "dataChanged"
],
  setup(__props, { emit: emits }) {

const props = __props;


const Client = inject("client");





const saved = ref(false);
const global_error = ref("");
const dispatch = ref(false);
const dispatchid=ref(0);

provide("model", props.model);


let cells;
if (props.stype == 'put') cells = getMutableCells(props.schema);
else cells = getImmutableCells(props.schema);


const bindGroup = createBindGroup();


if (props.parent) {
    bindGroup.addBind("--parent", createBind(props.schema["--parent"], props.data["--parent"]));
}


for(const field in cells) {
    bindGroup.addBind(field, createBind(props.schema[field], props.data[field]));
}


bindGroup.setInitActive();

const binds = computed(() => {
    const arr = [];
    for(let i in bindGroup.binds) {
        if (bindGroup.binds[i].active.value) {
            arr.push(bindGroup.binds[i]);
        } 
    }
    return arr;
});

function setErrors(err) {
    if (typeof err == "string") {
        global_error.value = err;
    } else {
        return err.json()
        .then(response => {
            const msg = response.exception[0];
            if (msg.type == "PressToJamCore\\Exceptions\\ValidationException") {
                for(let i in err) {
                    if (i.indexOf("__") !== 0) bindGroup.binds[i].setError(err[i]);
                }
            }
        });
    }
}

function serializeData() {
    const formData = new FormData();
    for(const i in bindGroup.binds) {
        const bind = bindGroup.binds[i];
        if (bind.is_dirty ) {
            const field = bind.cell;
            if (field.type == "time") formData.append(i, bind.cell.buildString(bind.value.value));
            else if (field.type == "json") formData.append(i, JSON.stringify(bind.cell.buildJSON(bind)));
            else formData.append(i, bind.value.value);
        }
    } 
    return formData;
}


function submit() {
    saved.value = false;
    bindGroup.activateValidation();
    if (bindGroup.hasErrors()) return;

    const data = serializeData();
    if (props.method == "put") {
        data.append("--id", props.data['--id']);
    } else if (props.method == "post" && props.data['--parent']) {
        data.append("--parent", props.data['--parent']);
    }
         

    return Client[props.method]("/data/" + props.model, data)
    .then(response => {
        if (props.method == 'post') {
            emits("dataChanged", response);
        } else if (props.method == "put") {
            response.data["--id"] = props.data["--id"];
            emits("dataChanged", response.data);
        }
        return response;
    })
    .then(response => {
        if (response['--dispatchid']) {
            dispatchid.value = response['--dispatchid'];
            dispatch.value = true;
        } else {
            saved.value = true;
            emits("saved");
        }
    })
    .catch(err => {
        if (err.response) setErrors(err.response);
        else console.log(err);
    });
    
}

function dispatchFailed(response) {
    setErrors(err.response);
    dispatch.value = false;
}

function dispatchComplete() {
    dispatch.value = false;
    saved.value = true;
    emits("saved");
}





return (_ctx, _cache) => {
  return (openBlock(), createElementBlock(Fragment, null, [
    createElementVNode("form", {
      onSubmit: withModifiers(submit, ["prevent"]),
      class: "card"
    }, [
      (saved.value)
        ? (openBlock(), createBlock(unref(script$9), {
            key: 0,
            severity: "success"
          }, {
            default: withCtx(() => [
              _hoisted_2
            ]),
            _: 1 /* STABLE */
          }))
        : createCommentVNode("v-if", true),
      withDirectives(createVNode(unref(script$9), { severity: "error" }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString$1(global_error.value), 1 /* TEXT */)
        ]),
        _: 1 /* STABLE */
      }, 512 /* NEED_PATCH */), [
        [vShow, global_error.value]
      ]),
      (__props.parent)
        ? (openBlock(), createElementBlock("div", _hoisted_3, [
            createElementVNode("label", null, toDisplayString$1(_ctx.$t("models." + _ctx.store.route.parent + ".title")), 1 /* TEXT */),
            createVNode(script$1, {
              modelValue: _ctx.proxy_values['--parent'],
              "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.proxy_values['--parent']) = $event)),
              model: _ctx.store.route.parent,
              common_parent: _ctx.common_parent,
              common_parent_id: _ctx.common_parent_id
            }, null, 8 /* PROPS */, ["modelValue", "model", "common_parent", "common_parent_id"])
          ]))
        : createCommentVNode("v-if", true),
      (openBlock(true), createElementBlock(Fragment, null, renderList(unref(binds), (bind) => {
        return (openBlock(), createElementBlock("div", {
          class: "field form-group",
          key: bind.cell.name
        }, [
          (bind.cell.type!='json')
            ? (openBlock(), createElementBlock("label", {
                key: 0,
                for: bind.cell.name
              }, toDisplayString$1(_ctx.$t("models." + bind.cell.model + ".fields." + bind.cell.name + ".label")), 9 /* TEXT, PROPS */, _hoisted_4))
            : createCommentVNode("v-if", true),
          createVNode(script$2, { bind: bind }, null, 8 /* PROPS */, ["bind"]),
          (bind.active_validation.value && bind.error.value && bind.cell.type!='json')
            ? (openBlock(), createBlock(script$4, {
                key: 1,
                field: bind.cell,
                error: bind.error.value
              }, null, 8 /* PROPS */, ["field", "error"]))
            : createCommentVNode("v-if", true)
        ]))
      }), 128 /* KEYED_FRAGMENT */)),
      createVNode(unref(script$o), {
        label: _ctx.$t('btns.save'),
        onClick: submit
      }, null, 8 /* PROPS */, ["label"])
    ], 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_1),
    createVNode(unref(script$k), {
      visible: dispatch.value,
      "onUpdate:visible": _cache[1] || (_cache[1] = $event => ((dispatch).value = $event)),
      modal: true,
      class: "p-fluid"
    }, {
      default: withCtx(() => [
        (dispatchid.value != 0)
          ? (openBlock(), createBlock(script$t, {
              key: 0,
              onComplete: dispatchComplete,
              onFailed: dispatchFailed,
              id: dispatchid.value
            }, null, 8 /* PROPS */, ["id"]))
          : createCommentVNode("v-if", true)
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["visible"])
  ], 64 /* STABLE_FRAGMENT */))
}
}

};

script.__file = "presstojam/src/components/form/form.vue";

export { script as a, script$l as b, createI18n as c, script$9 as d, script$k as e, createBind as f, script$e as g, script$6 as h, script$f as i, script$2 as j, setupDevtoolsPlugin as s, useI18n as u };
