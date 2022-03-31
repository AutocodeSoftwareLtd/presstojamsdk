import { DataCell } from "./datacell.js"


export class DataRow {

    constructor(metarow) {
        this._cells = {};
        this._references = {};
        this._children = {};
        this._parent;
        this._primary;

        if (metarow) this.applyMetaRow(metarow);
        
    }

    
    applyMetaRow(metarow) {
        if (metarow.primary) this._primary = new DataCell(metarow.primary);
        if (metarow.parent) this._parent = new DataCell(metarow.parent);

        for(const i in metarow.fields) {
            const field = metarow.fields[i];
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

        if (this._primary && row[this._primary.meta.name]) this._primary.setVal(row[this._primary.meta.name]);
        if (this._parent && row[this._parent.meta.name]) this._parent.setVal(row[this._parent.meta.name]);
        
        for(let field in this._cells) {
            if (!row[field]) continue;
            this._cells[field].setVal(row[field]);
        }

        for(let ref in this._references) {
            this._references[ref].row = row[ref];
        }

        for(let child in this._children) {
            this._children[child].row = row[child];
        }


        if (this._parent && this._references[this._parent.meta.reference]) {
            this._parent.display = this._references[this._parent.meta.reference].getSummary();
        }
        for(let cell in this._cells) {
            let field = this._cells[cell].meta;
            if (field.reference && this._references[field.reference]) {
                this._cells[cell].display = this._references[field.reference].getSummary();
            }
        }

    }

    get cells() {
        return this._cells;
    }


    get parent() {
        return this._parent;
    }


    get primary() {
        return this._primary;
    }

    get children() {
        return this._children;
    }

    getCell(name) {
        if (this._primary && this._primary.meta.name == name) return this._primary;
        else if (this._parent && this._parent.meta.name == name) return this._parent;
        else return this._cells[name];
    }


    getSummary() {
        let str = [];
        for(let i in this._cells) {
            const cell = this._cells[i];
            if (cell.meta.isSummary()) {
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
            if (this._parent) data[this._parent.meta.name] = this._parent.toVal();
        } else if (state == "put" || state == "delete") {
            data[this._primary.meta.name] = this._primary.toVal();
        }
        for(let i in this._cells) {
            data[i] = this._cells[i].toVal();
        }
        return data;
    }


    getCellByType(type) {
        let cells = {};
        for(let i in this._cells) {
            if (this._cells[i].meta.type == type) cells[i] = this._cells[i];
        }
        return cells;
    }
}