import { DataCell } from "./datacell.js"
import { computed } from "vue"

class DataTemplateCell extends DataCell {
    
    constructor(meta) {

        super(meta);
    
        if (this._meta.atts.type == "datetime") {
            this._store.value = {min : null, max : null };

            this.val = computed({
                get : () =>  {
                    return this._store.value;
                },
                set : (val) => {
                    if (val.min) this._store.value.min = this._meta.clean(val.min);
                    if (val.max) this._store.value.max = this._meta.clean(val.max);
                    this._store.error = this._meta.validate(val);
                }  
            });

            this.val1 = computed({
                get : () =>  {
                    return this._store.value.min;
                },
                set : (val) => {
                    this._store.value.min = this._meta.clean(val);
                    this._store.error = this._meta.validate(val);
                }     
            });

            this.val2 = computed({
                get : () =>  {
                    return this._store.value.max;
                },
                set : (val) => {
                    this._store.value.max = this._meta.clean(val);
                    this._store.error = this._meta.validate(val);
                }     
            });

            this.addParam = obj => {
                let cobj = {};
                if (this._store.value.min) cobj.min = this._store.value.min;
                if (this._store.value.max) cobj.max = this._store.value.max;
                if (Object.keys(cobj).length > 0) obj[this._meta.name] = cobj;
            };


        } else if (this._meta.type == "checkbox") {
            this._store.value = 0;

            this.addParam = (obj) => {
                if (this._store.value == 1) {
                    obj[this._meta.name] = 1;
                } else if (this._store.value == 2) {
                    obj[this._meta.name] = 0;
                }
            }

        } else if (this._meta.type == "select") {
            this._store.value = [];

            this.addParam = obj => {
                if (this._store.value.length > 0) obj[this._meta.name] = this._store.value;
            }

        } else {

            this.addParam = obj => {
                if (this._store.value) obj[this._meta.name] = ["%" + this._store.value + "%"];
            }

        }
    }
};

export class DataTemplate  {

    constructor(metarow) {
        this._cells = {};
        this._primary;
        this._parent;
        this._limit = 0;
        this._page = 0;
        this._fields = [];
        this._sort = {};
        this._groups = [];
        this._children = [];
        this._active;
        this._max_pages = 0;
        this._count = 0;

        if (metarow) this.applyMetaRow(metarow);
    }
    

    applyMetaRow(metarow) {
        if (metarow.primary) this._primary = new DataCell(metarow.primary);
        if (metarow.parent) this._parent = new DataCell(metarow.parent);

        for(const i in metarow.fields) {
            const field = metarow.fields[i];
            this._cells[field.name] = new DataTemplateCell(field);
        }

    }

    get cells() {
        return this._cells;
    }


    initField(field) {
        this._data.initField(field);
    }

    set fields(fields) {
        this._fields = fields;
    }

    get fields() {
        return this._fields;
    }

    set limit(limit) {
        this._limit = limit;
    }

    get limit() {
        return this._limit;
    }

    set sort(sort) {
        this._sort = sort;
    }

    get sort() {
        return this._sort;
    }

    set page(page) {
        this._page = page;
    }

    get page() {
        return this._page;
    }

    set groups(groups) {
        this._groups = groups;
    }

    get groups() {
        return this._groups;
    }

    set children(children) {
        this._children = children;
    }

    get children() {
        return this._children;
    }

    get primary() {
        return this._primary;
    }

    get parent() {
        return this._parent;
    }

    get active() {
        return this._active;
    }

    set active(active) {
        this._active = active;
    }

    get max_pages() {
        return this._max_pages;
    }

    set max_pages(pages) {
        this._max_pages = pages;
    }

    get count() {
        return this._count;
    }

    set count(count) {
        this._count = count;
    }

    convertToParams() {
        let obj = {};
        if (this._limit) obj._limit = this._limit;
        if (this._page) obj._page = this._page;
        if (this._fields.length > 0) obj._fields = this._fields;
        if (Object.keys(this._sort).length > 0) obj._sort = this._sort;
        for(let i in this._cells) {
            let param = this._cells[i].toVal();
            if (param) obj[i] = param;
        }
        return JSON.stringify(obj);
    }

    convertDataToParams() {
        let obj = {};
        for(let i in this._cells) {
            obj[i] = this._cells[i].toVal();
        }
        return (Object.keys(obj).length > 0) ? JSON.stringify(obj) : null;
    }


    convertFromParams(str) {
        const obj = JSON.parse(str);
        if (obj._limit) this._limit = obj._limit;
        if (obj._fields) this._fields = obj._fields;
        if (obj.hasOwnProperty("_page")) this._page = obj._page;
        if (obj.hasOwnProperty("_sort")) this._sort = obj._sort;
        for(const i in this._cells) {
            if (obj.hasOwnProperty(i)) this._cells[i].setVal(obj[i]);
        }
    }

    convertToAPIParams(state) {
        let obj = {};
        if (this._limit) obj.__limit = this._limit;
        if (this._page) obj.__page = (this._page * this._limit);
        if (this._fields.length > 0) obj.__fields = this._fields;
        if (Object.keys(this._sort).length > 0) obj.__sort = this._sort;
        for(let i in this._cells) {
            this._cells[i].addParam(obj);
        }

        if (state == "get" || state == "post") {
            if (this._parent && this._parent.toVal()) obj[this._parent.meta.name] = this._parent.toVal();
        } else if (state != "login") {
            obj[this._primary.meta.name] = this._primary.toVal();
        }
        return (Object.keys(obj).length) ? obj : null;
    }
}