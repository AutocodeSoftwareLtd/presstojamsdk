import 'vue';
import { c as configs } from './configs-be955862.mjs';

class Client {
  constructor(url, headers = null) {
    this._main_url = url;
    this._custom_headers = {};

    if (headers) {
      for (let name in headers) {
        this._custom_headers[name] = headers[name];
      }
    }
  }

  createClientException(type, detail, response) {
    return {
      "origin": "client",
      type,
      detail,
      "status": response.status,
      response
    };
  }

  createHeaders(dynamic_headers = null) {
    const headers = new Headers();

    for (let i in this._custom_headers) {
      headers.set(i, this._custom_headers[i]);
    }

    if (dynamic_headers) {
      for (let i in dynamic_headers) {
        headers.set(i, dynamic_headers[i]);
      }
    }

    return headers;
  }

  createParams(data) {
    const params = new URLSearchParams();

    for (let i in data) {
      if (Array.isArray(data[i]) || typeof data[i] == 'object' && data[i] !== null) {
        params.append(i, JSON.stringify(data[i]));
      } else params.append(i, data[i]);
    }

    return params;
  }

  createOptions(method, headers, body = null) {
    return {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: headers,
      body: body
    };
  }

  switchTokens() {
    const options = this.createOptions("PUT", this.createHeaders({
      "x-force-auth-cookies": 1
    }));
    return fetch(this._main_url + "/user/switch-tokens", options);
  }

  call(url, options) {
    return fetch(this._main_url + url, options).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw this.createClientException("error", "apierror", response);
      }
    });
  }

  get(url, data) {
    if (data) {
      const params = this.createParams(data);
      if (url.indexOf("?") == -1) url += "?";else url += "&";
      url += params.toString();
    }

    return this.call(url, this.createOptions('GET', this.createHeaders()));
  }

  getprimary(url, data) {
    return this.get(url, data);
  }

  save(url, method, data, dynamic_headers = null) {
    const headers = this.createHeaders(dynamic_headers);
    let body = null;

    if (data) {
      body = data;
    }

    const options = this.createOptions(method, headers, body); //call our fetch response and return

    return this.call(url, options);
  }

  post(url, data, headers = null) {
    if (!(data instanceof FormData)) {
      data = JSON.stringify(data);
      if (!headers) headers = {};
      headers["Content-Type"] = "application/json";
    }

    return this.save(url, "POST", data, headers);
  }

  put(url, data, headers = null) {
    if (data instanceof FormData) {
      data = Object.fromEntries(data.entries());
    }

    data = JSON.stringify(data);
    if (!headers) headers = {};
    headers["Content-Type"] = "application/json";
    return this.save(url, 'PUT', data, headers);
  }

  delete(url, data) {
    const headers = {
      "Content-Type": "application/json"
    };
    return this.save(url, 'DELETE', JSON.stringify(data), headers);
  }

  getAsset(url) {
    const options = this.createOptions("GET", {
      mode: 'no-cors'
    });
    return fetch(this._main_url + url, options).then(response => {
      if (response.ok) {
        return response.blob();
      } else {
        throw response;
      }
    });
  }

}
let client$1;
function createClient() {
  client$1 = new Client(configs.get("url"), configs.get("client.custom_headers", {}));
  return client$1;
}
function getClient() {
  return client$1;
}

const Errors = {
  OK: 0,
  MIN_VALUE: 1,
  MAX_VALUE: 2,
  HAS: 3,
  HAS_NOT: 4
};

class Field {
  constructor(name) {
    this._name = name;
    this._default_val = null;
    this._immutable = false;
    this._min = null;
    this._max = null;
    this._contains = [];
    this._notcontains = [];
    this._model = "";
    this._background = false;
    this._system = false;
    this._summary = false;
    this._where = null;
  }

  buildGetterSetters() {
    const keys = Object.keys(this);
    keys.forEach(property => {
      if (property[0] == "_") {
        Object.defineProperty(this, property.substring(1), {
          get: function () {
            return this[property];
          },
          set: function (newValue) {
            this[property] = newValue;
          }
        });
      }
    });
  }

  apply(obj) {
    for (let x in obj) {
      if (x == "type") this._type = obj[x].toLowerCase();else if (x == "contains" || x == "notcontains") {
        if (obj[x]) this["_" + x] = obj[x].split("|");
      } else this["_" + x] = obj[x];
    }
  }

  clean(val) {
    return val;
  }

  calcValue(value) {
    if (!value) return "";else return value;
  }

  validateSize(val) {
    if (this._min !== null && val < this._min) return Errors.MIN_VALUE;else if (this._max !== null && val > this._max) return Errors.MAX_VALUE;else return Errors.OK;
  }

  validate(val) {
    if (val === undefined || val === null) return;
    let err;

    if (isNaN(val)) {
      const length = val ? val.length : 0;
      err = this.validateSize(length);
    } else {
      err = this.validateSize(val);
    }

    if (err != Errors.OK) return err;

    for (let nhas of this._notcontains) {
      if (val.match(nhas)) return Errors.HAS_NOT;
    }

    if (this._contains.length == 0) return Errors.OK;

    for (let has of this._contains) {
      if (val.match(has)) return Errors.OK;
    }

    return Errors.HAS;
  }

  getErrorVal(error) {
    if (error == Errors.MIN_VALUE) return this.min;else if (error == Errors.MAX_VALUE) return this._max;else if (error == Errors.HAS) return this._contains.join(" | ");else if (error == Errors.HAS_NOT) return this._notcontains;
  }

  display(val) {
    return val;
  }

}

class Aggregate extends Field {
  constructor(name, obj) {
    super(name);
    this._ws;
    this._fields = fields;
    if (obj) this.apply(obj);
    this.buildGetterSetters();
  }

  get type() {
    return "asset";
  }

}

const client = getClient();
function toTree(arr, schema, parent_id = 0) {
  const nodes = [];
  const items = arr.filter(obj => obj['--recursive'] == parent_id);

  for (const item of items) {
    let label = getLabel(schema, item);
    const obj = {
      key: item['--id'],
      "label": label,
      data: item
    };
    obj.children = toTree(arr, schema, obj.key);
    nodes.push(obj);
  }

  return nodes;
}
function toReferenceTree(arr, schema, parent_id = 0) {
  const nodes = [];
  const items = arr.filter(obj => obj['--recursive'] == parent_id);

  for (const item of items) {
    const obj = {
      key: item['--key'],
      "label": item['--value'],
      data: item
    };
    obj.children = toReferenceTree(arr, schema, obj.key);
    nodes.push(obj);
  }

  return nodes;
}
function getLabel(schema, data) {
  let label = [];

  for (let i in schema) {
    if (schema[i].summary) {
      label.push(data[i]);
    }
  }

  return label.join(" ");
}
function getForegroundCells(schema) {
  let cells = {};

  for (let i in schema) {
    if (!schema[i].background) cells[i] = schema[i];
  }

  return cells;
}
function getMutableCells(schema) {
  let cells = {};

  for (let i in schema) {
    if (schema[i].type == "json") {
      schema[i].cells = getMutableCells(schema[i].fields);
      cells[i] = schema[i];
    } else {
      if (!schema[i].system && !schema[i].immutable) cells[i] = schema[i];
    }
  }

  return cells;
}
function getImmutableCells(schema) {
  let cells = {};

  for (let i in schema) {
    if (schema[i].type == "json") {
      schema[i].cells = getImmutableCells(schema[i].fields);
      cells[i] = schema[i];
    } else {
      if (!schema[i].system) cells[i] = schema[i];
    }
  }

  return cells;
}
function sortByDictionary(a, b) {
  if (a.value < b.value) {
    return -1;
  } else if (a.value > b.value) {
    return 1;
  } else {
    return 0;
  }
}
function rowToTree(obj, parent) {
  function walkObjTreeBuild(obj, links) {
    for (let i = 0; i < links.length; ++i) {
      if (!obj[links[i]]) obj[links[i]] = {};
      obj = obj[links[i]];
    }

    return obj;
  }

  let nobj = {};
  nobj[parent] = {};

  for (let i in obj) {
    if (i.indexOf("/") > -1) {
      const pts = i.split("/");
      const name = pts.pop();
      const cobj = walkObjTreeBuild(nobj, pts);
      cobj[name] = obj[i];
    } else {
      nobj[parent][i] = obj[i];
    }
  }

  return nobj;
}
function saveOrder(model, rows) {
  const vals = [];

  for (let i in rows) {
    vals.push({
      '--id': rows[i]['--id'],
      '--sort': i
    });
  }

  return client.put("/data/" + model + "/resort", {
    "_rows": vals
  });
}

const ReferenceTypes = {
  'PRIMARY': 0,
  'PARENT': 1,
  'OWNER': 2,
  'REFERENCE': 3,
  'RECURSIVE': 4,
  'CIRCULAR': 5
};
class ID extends Field {
  constructor(name, obj) {
    super(name);
    this._reference_type;
    this._reference;
    this._default_val = 0;
    this.reverse_references = [];
    this._common;
    this._cache_id;
    this._custom_fields = [];
    this._load_promise = null;
    this.buildGetterSetters();
    if (obj) this.apply(obj);
  }

  getOptions(client, model, id) {
    if (!this._load_promise || id != this._cache_id) {
      this._cache_id = id;
      this._load_promise = client.get("/reference/" + model + "/" + this._name + "/" + id).then(response => {
        response.sort(sortByDictionary);
        return response;
      });
    }

    return this._load_promise;
  }

  getRecursiveOptions(client, model, id, schema) {
    if (!this._load_promise) {
      this._cache_id = id;
      this._load_promise = client.get("/reference/" + model + "/" + this._name + "/" + id).then(response => {
        return toReferenceTree(response, schema);
      });
    }

    return this._load_promise;
  }

  get reference() {
    return this._reference;
  }

  isReferenceType() {
    return this._reference_type == ReferenceTypes.REFERENCE || this._reference_type == ReferenceTypes.CIRCULAR;
  }

  isCircular() {
    return this._reference_type == ReferenceTypes.CIRCULAR;
  }

  get recursive() {
    return this._reference_type == ReferenceTypes.RECURSIVE;
  }

  get reference_type() {
    return this._reference_type;
  }

  get type() {
    return "id";
  }

}

class Flag extends Field {
  constructor(name, obj) {
    super(name);
    if (obj) this.apply(obj);
    this.buildGetterSetters();
  }

  clean(val) {
    return val ? 1 : 0;
  }

  display(val) {
    if (this._contains.length > 0) return this._contains[val];else return '';
  }

  useIcons() {
    return !this._contains.length ? true : false;
  }

  get type() {
    return "flag";
  }

}

class Asset extends Field {
  constructor(name, obj) {
    super(name);
    this._type;
    if (obj) this.apply(obj);
    this.buildGetterSetters();
  }

  get type() {
    return "asset";
  }

}

class Time extends Field {
  constructor(name, obj) {
    super(name);
    this._format = {
      date: true,
      time: false
    };
    this._invalid_dates = [];
    this.buildGetterSetters();
    if (obj) this.apply(obj);

    if (!this._contains.length) {
      this._contains.push('Y-m-d H:i:s');
    }
  }

  convertMysqlToUTC(val) {
    if (val.indexOf(" ") == -1) {
      if (val.indexOf(":") > 0) {
        val = "0000-00-00T" + val;
      } else {
        //date only
        val += "T12:00:00";
      }
    } else {
      val.replace(" ", "T");
    }

    val += ".00Z";
    return val;
  }

  buildString(date_obj) {
    if (!date_obj) return null;

    if (!this._format.time && date_obj) {
      if (date_obj.getHours() == 0) date_obj.setUTCHours(date_obj.getUTCHours() + 12);
    }

    let str = date_obj.toISOString();
    str = str.split(".")[0];
    str = str.replace("T", " ");
    return str;
  }

  validate(val) {
    return 0;
  }

  clean(val) {
    if (typeof val === 'string') {
      const date = new Date(this.convertMysqlToUTC(val));
      return date;
    } else {
      return val;
    }
  }

  get type() {
    return "time";
  }

}

class Number extends Field {
  constructor(name, obj) {
    super(name);
    this._round = 0;
    this.buildGetterSetters();
    if (obj) this.apply(obj);
  }

  clean(val) {
    if (this._round) return parseFloat(val);else if (val !== null && typeof val !== 'undefined') return parseInt(val);else return val;
  }

  get round() {
    return this._round;
  }

  set round(round) {
    this._round = round;
  }

  get type() {
    return "number";
  }

}

class String extends Field {
  constructor(name, obj) {
    super(name);
    this._encrypted = false;
    this._list;
    this.buildGetterSetters();
    if (obj) this.apply(obj);
  }

  getOptions() {
    let opts = [];

    if (Array.isArray(this._list)) {
      for (const item of this._list) {
        opts.push({
          key: item,
          value: item
        });
      }
    } else {
      for (const key in this._list) {
        opts.push({
          key: key,
          value: this._list[key]
        });
      }
    }

    return opts;
  }

  clean(val) {
    if (this._list) {
      if (Array.isArray(this._list)) {
        if (this._list.includes(val)) return val;
      } else if (this._list[val]) {
        return val;
      } else {
        return null;
      }
    } else {
      return val ? val.trim() : val;
    }
  }

  isEnum() {
    return this._list ? true : false;
  }

  get type() {
    return "string";
  }

}

class JsonGroup extends Field {
  constructor(name, obj) {
    super(name);
    this._fields = {};
    this.buildGetterSetters();
    if (obj) this.apply(obj);
  }

  buildJSONFromGroup(bindGroup) {
    let obj = {};

    for (let i in bindGroup.binds) {
      const cbind = bindGroup.binds[i];
      if (!cbind.active.value) continue;

      if (cbind.children) {
        obj[i] = this.buildJSONFromGroup(cbind.children);
      } else {
        obj[i] = cbind.value.value;
      }
    }

    return obj;
  }

  buildJSON(bind) {
    return this.buildJSONFromGroup(bind.children);
  }

  clean(val) {
    if (typeof val === 'string') {
      return JSON.parse(val);
    } else {
      return val;
    }
  }

  get type() {
    return "json";
  }

}

function createField(field, obj, schema_model) {
  let cell;
  if (obj.type == "id") cell = new ID(field, obj);else if (obj.type == "number") cell = new Number(field, obj);else if (obj.type == "asset") cell = new Asset(field, obj);else if (obj.type == "flag") cell = new Flag(field, obj);else if (obj.type == "time") cell = new Time(field, obj);else if (obj.type == "json") cell = new JsonGroup(field, obj);else cell = new String(field, obj);
  cell.model = schema_model;

  if (obj.type == "json") {
    for (const field in cell.fields) {
      cell.fields[field] = createField(field, cell.fields[field]);
      cell.fields[field].model = schema_model;
    }
  }

  return cell;
}

let routes = {};

function setFieldSettings(field, settings) {
  for (let i in settings) {
    field[i] = settings[i];
  }
}

function loadSiteMap(response) {
  const settings = configs.get("models");

  for (let i in response) {
    response[i].name = i;
    const schema = response[i].schema; //set up some shortcuts

    if (schema['--parent']) {
      response[i].parent = schema['--parent'].reference;
    }

    response[i].children = schema["--id"].reference;
    response[i].sort = schema["--sort"] ? true : false;

    for (let x in schema) {
      const field = schema[x];

      if (settings[i] && settings[i][x]) {
        setFieldSettings(field, settings[i][x]);
      }

      response[i].schema[x] = createField(x, field, i);
    }

    response[i].settings = settings[i] ? settings[i] : {};
  }

  routes = response;
  return routes;
}
function getRoute(model) {
  if (!routes[model]) throw "Trying to find model " + model + " in routes that doesn't exists";
  return routes[model];
}
function getDefaultRoute() {
  for (let i in routes) {
    return i;
  }
}
function getRouteStructure(model) {
  let items = [];

  while (model) {
    const route = getRoute(model);
    items.push(route);
    model = route.parent;
  }

  return items.reverse();
}
function getRoutes() {
  return routes;
}
function hasRoute(model) {
  return routes[model] ? true : false;
}
function getField(name, schema) {
  let pts = name.split("/");
  let cell;

  for (let x = 0, n = pts.length; x < n; ++x) {
    cell = schema[pts[x]];

    if (n > 1 && x < n - 1) {
      schema = routes[cell.reference].schema;
    }
  }

  return cell;
}
function getSchema(name, schema) {
  let pts = name.split("/");
  let cell;

  for (let x = 0, n = pts.length; x < n; ++x) {
    if (pts[x].indexOf("..") === 0) {
      //this is a reverse index
      const schema_name = pts[x].substring(2);

      if (!schema["--id"].reverse_references.includes(schema_name)) {
        throw schema_name + " does not exist as a reverse reference for: " + schema["--id"].model;
      }

      schema = routes[schema_name];
      ++x;
      cell = schema[pts[x]];
    } else {
      cell = schema[pts[x]];
    }

    if (n > 1 && x < n - 1) {
      schema = routes[cell.reference].schema;
    }
  }

  return schema;
}
function getRoutesByProfile(profile) {
  let croutes = {};

  for (let route in routes) {
    if (routes[route].schema['--owner'] && routes[route].schema['--owner'].reference == profile) {
      croutes[route] = routes[route];
    }
  }

  return croutes;
}
function createView(model) {
  function getFields(fields, schema) {
    let obj = {};

    for (let field of fields) {
      if (typeof field === 'object') {
        if (field.path) {
          const nschema = getSchema(field.path, schema);
          let cobj = getFields(fields, nschema);

          for (let i in cobj) {
            obj[field.path + "/" + i] = cobj[i];
          }
        } else if (field.type == "aggregate") {
          obj[field.name] = new Aggregate(field);
        }
      } else {
        obj[field] = getField(field, route.schema);
      }
    }

    return obj;
  }

  let route = getRoute(model);

  if (route.settings.fields) {
    //this is a custom view,
    const croute = { ...route
    };
    croute.perms = ["get"]; //if custom route, can only view
    croute.schema = getFields(route.settings.fields, route.schema);
    return croute;
  } else {
    return route;
  }
}
/*
setStates(fields) {
        for(let i in fields) {
            let groups = {};
            if (fields[i].states) {
                for(const state of fields[i].states) {
                    if (!groups[state.depends_on]) groups[state.depends_on] = [];
                    groups[state.depends_on].push(state); 
                }
            }
            this._state_groups[i] = groups;
        }
    }
*/

export { ReferenceTypes as R, getDefaultRoute as a, getRouteStructure as b, createClient as c, getMutableCells as d, getImmutableCells as e, getRoutes as f, getRoutesByProfile as g, createView as h, getLabel as i, getForegroundCells as j, hasRoute as k, loadSiteMap as l, getRoute as m, rowToTree as r, saveOrder as s, toTree as t };
