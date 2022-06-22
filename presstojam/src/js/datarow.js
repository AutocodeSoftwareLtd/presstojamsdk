import { DataCell } from "./datacell.js"
import { reactive, computed } from "vue"
import { createStateTrigger } from "./states.js"


export class DataRow {

    constructor(metarow) {
        this._metarow = metarow;
        this._cells = reactive({});
        this._children = {};
        this._ids = reactive({});
        
        


        if (metarow) {
            this.applyMetaRow(metarow);
        }

        this.cells = computed(() => {
            return this._cells;
        });
        
    }

    

    set children(children) {
        this._children = children;
    }

    get children() {
        return this._children;
    }

    get primary() {
        return this._ids["--id"];
    }

    get parent() {
        return this._ids["--parentid"];
    }


    clone() {
        const data = new DataRow(this._metarow);
        let cells = {};
        for(let i in this._cells) {
            cells[i].val = this._cells[i].val;
        }
    
        let children = {};
        for(let i in data.children) {
            children[i] = data.children[i].clone();
        }
        data.children = children;
        return data;
    }

    
    applyMetaRow(metarow) {
        for(const i in metarow.cells) {
            const field = metarow.cells[i];
            this._cells[field.name] = new DataCell(field);
        }

        for(const i in metarow.children) {
            this._children[i] = metarow.children[i];
        }

        let groups = metarow.state_groups;


        for(let i in groups) {
            for(let x in groups[i]) {
                const _self = this;
                let state = createStateTrigger(i, groups[i][x], field => {
                    _self._cells[i].resetMeta(field);
                });
                this._cells[x].listeners.push(state);
            }
        }
    }


    addChild(name, child) {
        if (!this._children[name]) {
            this._children[name] = [];
        }
        this._children[name].push(child);
    }

    set row(row) {
        if (!row) return;

        if (row["--id"]) this._ids["--id"] = row["--id"];
        if (row["--parentid"]) this._ids["--parentid"] = row["--parentid"];

        for(let field in this._cells) {
            if (row.hasOwnProperty(field)) {
                this._cells[field].val = row[field];
                this._cells[field].display = row;
            }
        }

        for(let child in this._children) {
            this._children[child].row = row[child];
        }
    }


    set filter(row) {
        if (!row) return;

        for(let field in this._cells) {
            if (row.hasOwnProperty(field)) this._cells[field].filter = row[field];
        }
    }


    getSummary() {
        let str = [];
        for(let i in this._cells) {
            const cell = this._cells[i];
            if (cell.isSummary()) {
                const display = cell.display;
                str.push(display);
            }
        }
        return str.join(" ");
    }

    toString() {
        let str = [];
        for(let i in this._cells) {
            str.push(this._cells[i].display);
        }   
        return str.join(" ");
    }


    serialize(changes_only = false) {
        let data = {};
        for(let i in this._cells) {
            if (changes_only) {
                if (this._cells[i].change != this._cells[i].val) {
                    data[i] = this._cells[i].change;
                }
            } else {
                if (this._cells[i].change != null) data[i] = this._cells[i].change;
            }
        }
        return data;
    }


    getCellByType(type) {
        let cells = {};
        for(let i in this._cells) {
            if (this._cells[i].type == type) cells[i] = this._cells[i];
        }
        return cells;
    }

    clearErrors() {
        for(let i in this._cells) {
            this._cells[i].error = 0;
        }
    }


    reset() {
        for(let i in this._cells) {
            this._cells[i].error = 0;
            this._cells[i].change = null;
        }
    }

    setErrors(err) {
        for(let i in err) {
            if (i.indexOf("__") === 0) continue;
            if (this._cells[i]) {
                this._cells[i].error = err[i];
            }
        }
    }

    convertToParams() {
        let obj = {};
        for(let i in this._cells) {
            this._cells[i].addParam(obj);
        }
        return obj;
    }

    convertToAPIParams() {
        let obj = {};
        for(let i in this._cells) {
            if (this._cells[i].type == "asset") continue;
            this._cells[i].addAPIParam(obj);
        }
        return obj;
    }

    applyChangeData() {
        for(let i in this._cells) {
            this._cells[i].val = this._cells[i].change;
        }
    }

}