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