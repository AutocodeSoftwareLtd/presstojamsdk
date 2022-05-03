import { DataCell } from "./datacell.js"


export class DataRow {

    constructor(metarow) {
        this._cells = {};
        this._children = {};
        this._parent = null;
        this._primary = null;

        if (metarow) {
            this.applyMetaRow(metarow);
        }

        const keys = Object.keys(this);

        keys.forEach(property => {
          if (property[0] == "_") {
            Object.defineProperty(this, property.substring(1), {
                get: function() { 
                    return this[property];
                },
                set: function(newValue) {
                    this[property] = newValue;
                }
            });
          } 
        });
        
    }

    clone() {
        const data = new DataRow();
        let cells = {};
        for(let i in this._cells) {
            cells[i] = this._cells[i].clone();
        }
        data.cells = cells;
        let children = {};
        for(let i in data.children) {
            children[i] = data.children[i].clone();
        }
        data.children = children;
        if (this._parent) data.parent = this._parent.clone();
        if (this._primary) data.primary = this._primary.clone();
        return data;
    }

    
    applyMetaRow(metarow) {
        if (metarow.primary) this._primary = new DataCell(metarow.primary);
        if (metarow.parent) this._parent = new DataCell(metarow.parent);

        for(const i in metarow.cells) {
            const field = metarow.cells[i];
            this._cells[field.name] = new DataCell(field);
        }

        for(const i in metarow.references) {
            this._references[i] = new DataRow(metarow.references[i]);
        }

        for(const i in metarow.children) {
            this._children[i] = metarow.children[i];
        }
    }


    appendPrimary(field) {
        this._primary = new DataCell(field);
    }



    addChild(name, child) {
        if (!this._children[name]) {
            this._children[name] = [];
        }
        this._children[name].push(child);
    }

    set row(row) {
        if (!row) return;

      
        if (this._primary && row[this._primary.name]) this._primary.setVal(row[this._primary.name]);
        if (this._parent && row[this._parent.name]) this._parent.setVal(row[this._parent.name]);
        
        for(let field in this._cells) {
            this._cells[field].setVal(row[field]);
        }

        for(let child in this._children) {
            this._children[child].row = row[child];
        }


        for(let cell in this._cells) {
            let field = this._cells[cell].meta;
            if (field.reference && this._references[field.reference]) {
                this._cells[cell].display = this._references[field.reference].getSummary();
            }
        }

    }


    getCell(name) {
        if (this._primary && this._primary.name == name) return this._primary;
        else if (this._parent && this._parent.name == name) return this._parent;
        else return this._cells[name];
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


    serialize(state) {
        let data = {};
        if (state == "post") {
            if (this._parent) data[this._parent.name] = this._parent.toVal();
        } else if (state == "put" || state == "delete") {
            data[this._primary.name] = this._primary.toVal();
        }
        for(let i in this._cells) {
            data[i] = this._cells[i].toVal();
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
}