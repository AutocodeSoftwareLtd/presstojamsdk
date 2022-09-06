import { defineAsyncComponent } from "vue"
import client from "./client.js"

export function toTree(arr, schema, parent_id = 0) {
    const nodes = [];
    const items = arr.filter(obj => obj['--recursive-id'] == parent_id);
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
        if (!schema[i].system && !schema[i].immutable) cells[i] = schema[i];
    }
    return cells;
}

export function getImmutableCells(schema) {
    let cells = {};
    for(let i in schema) {
        if (!schema[i].system) cells[i] = schema[i];
    }
    return cells;
}

export async function getCellComponent(name, type = null) {
    if (type) type = "-" + type;
    return defineAsyncComponent(import('./../components/fields/ptj-' + name + type + ".vue"));
}

function sortByDictionary(a, b) {
    if (a.value < b.value ) {
        return -1;
    } else if (a.value > b.value) {
        return 1;
    } else {
        return 0;
    }
} 

export function getOptions(store, field) {
    if (!store.references[field]) {
        throw "Error, can't access reference that doesn't exist, helper functions, line 59";
    }
    const ref = store.references[field];
    return ref.load()
    .then(response => {
        response.sort(sortByDictionary);
        return response;
    });
}

export function getRecursiveOptions(store) {
    return store.load()
    .then(() => {
        return toTree(store.data.value, store.route.schema);
    });
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

export function commonParent(store, store1) {
        async function getStructures(store, store1) {
            let struc = await getRouteStructure(store);
            let struc1 = await getRouteStrcutre(store1);
            return [struc, struc1];
        }

        getStructures(store,store1)
        .then((struc, struc1) => {
            
        }) 
}


export function saveOrder(model, rows) {
    const vals = [];
    for(let i in rows) {
        vals.push({'--id' : rows[i]['--id'], '--sort' : i});
    }
    return client.put("/data/" + model + "/resort", { "_rows" : vals});
}