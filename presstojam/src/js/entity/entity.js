export class Entity {

    constructor() {
        this._name = "";
        this._cells = {};
        this._min_rows = null;
        this._max_rows = null;
        this._parent = null;
        this._children = null;
        this._sort = null;


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
            })
          }
        });
    }

    addCell(cell) {
        this._cells[cell.name] = cell;
        cell.entity = this;
    }

    getCell(name) {
        if (!this._cells[cell.name]) {
            console.warn("Cell name " + cell.name + "doesn't exist", "entity.js getCell");
        }

        return this._cells[cell.name];
    }
}