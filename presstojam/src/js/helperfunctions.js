import { defineAsyncComponent } from "vue"
import { getClient } from "./client.js"

const client = getClient();


export function toTree(arr, schema, parent_id = 0) {
    const nodes = [];
    const items = arr.filter(obj => obj['--recursive'] == parent_id);
    for (const item of items) {
      let label = getLabel(schema, item);
      const obj = { key: item['--id'], "label":label, data : item};
      obj.children = toTree(arr, schema, obj.key);
      nodes.push(obj);
    }
    return nodes;
}


export function toReferenceTree(arr, schema, parent_id = 0) {
    const nodes = [];
    const items = arr.filter(obj => obj['--recursive'] == parent_id);
    for (const item of items) {
      const obj = { key: item.value, "label":item.label, data : item};
      obj.children = toReferenceTree(arr, schema, obj.key);
      nodes.push(obj);
    }
    return nodes;
}

export function toTreeChildren(arr, schema, parent_id = 0) {
    const nodes = [];
    const items = arr.filter(obj => obj['--recursive'] == parent_id);
    for (const item of items) {
      let label = getLabel(schema, item);
      const obj = { key: item['--id'], "label":label, data : item};
      obj.children = toTree(arr, schema, obj.key);
      nodes.push(obj);
    }
    return nodes;
}


export function getLabel(schema, data) {
    let label = [];
    for(let i in schema) {
        if (schema[i].summary) {
            label.push(data[i]);
        }
    }
    return label.join(" ");
};

export function getForegroundCells(schema) {
    let cells = {};
    for(let i in schema) {
        if (!schema[i].background) cells[i] = schema[i];
    }
    return cells;
}

export function getSummaryCells(schema) {
    let cells = {};
    for(let i in schema) {
        if (schema[i].summary) cells[i] = schema[i];
    }
    return cells;
}



export function getMutableCells(schema) {
    let cells = {};
    for(let i in schema) {
        if (schema[i].type == "json") {
            schema[i].cells = getMutableCells(schema[i].fields);
            cells[i] = schema[i];
        } else {
            if (!schema[i].system && !schema[i].immutable) cells[i] = schema[i];
        }
    }
    return cells;
}

export function getImmutableCells(schema) {
    let cells = {};
    for(let i in schema) {
        if (schema[i].type == "json") {
            schema[i].cells = getImmutableCells(schema[i].fields);
            cells[i] = schema[i];
        } else {
            if (!schema[i].system) cells[i] = schema[i];
        }
    }
    return cells;
}

export async function getCellComponent(name, type = null) {
    if (type) type = "-" + type;
    return defineAsyncComponent(import('./../components/fields/ptj-' + name + type + ".vue"));
}

export function sortByDictionary(a, b) {
    if (a.value < b.value ) {
        return -1;
    } else if (a.value > b.value) {
        return 1;
    } else {
        return 0;
    }
} 




export function rowToTree(obj, parent) {

    function walkObjTreeBuild(obj, links) {
        for(let i =0; i<links.length; ++i) {
            if (!obj[links[i]]) obj[links[i]] = {};
            obj = obj[links[i]];
        }
        return obj;
    }

    let nobj = {};
    nobj[parent] = {};
    for(let i in obj) {
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

export function commonParent(struc, struc1) {
   
    
    for(const route of struc) {
        for(const route1 of struc1) {
            if (route.name == route1.name) {
                return route.name;
            }
        }
    } 
}


export function saveOrder(model, rows, client) {
    const vals = [];
    for(let i in rows) {
        vals.push({'--id' : rows[i]['--id'], '--sort' : i});
    }
    return client.put("/data/" + model + "/resort", { "_rows" : vals});
}