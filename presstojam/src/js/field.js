import { Validator } from "./validator.js"
import Errors from "./error.js"
import { reactive, computed, ref } from "vue"
import Client from "./client.js"

export class Field  {

    constructor(name, obj = null) {
        this._name = name;
        this._type;
        this._is_primary = false;
        this._is_parent = false;
        this._valid = 1;
        this._atts={}
        this._confirm = false;
        this._readonly = false;
        this._placeholder = "";
        this._conditions;
        this._link;
        this._reference;
        this._error = 0;
        this._label = "";
        this.on = ref(true);
        this._summary = false;
        this._default = null;
        this._validator = new Validator();
        this._value = ref(null);
        this._multiple;
        this._is_validate_on = false;
        this._options = reactive([]);
        this._asset = null;

        this.val = computed({ 
            get : () =>  {
                return this._value.value;
            },
            set : (val) => {
                this._value.value = (this._type == "checkbox") ? (val) ? 1 : 0 : val;
                this._error = this.validate(val);
            }     
        });

       
        if (obj) {
            for (let x in obj) {
                if (x == "field" || x == "validator") continue;
                this[x] = obj[x];
            }

            if (obj.field) {
                for(let x in obj.field) {
                    this[x] = obj.field[x];
                }
            }

            if (obj.validation) {
                for(let x in obj.validation) {
                    this._validator[x] = obj.validation[x];
                }
            }
        }
    }

    set confirm(confirm) {
        this._confirm = confirm;
    }

    set readonly(readonly) {
        this._readonly = readonly;
    }

    set placeholder(placeholder) {
        this._placeholder = placeholder;
    }

    set atts(atts) {
        this._atts = atts;
    }

    set default(def) {
        this._default = def;
    }

    set asset(asset) {
        this._asset = asset;
    }


    set conditions(conditions) {
        this._conditions = conditions;
    }

    set link(link) {
        this._link = link;
    }

    set name(name) {
        this._name = name;
    }

    set type(type) {
        this._type = type;
    }

    set multiple(mult) {
        this._multiple = mult;
    }

    set is_primary(val) {
        this._is_primary = val;
    }

    set is_parent(val) {
        this._is_parent = val;
    }

    set reference(ref) {
        this._reference = ref;
    }

    set error(err) {
        this._error = err;
    }

    set label(label) {
        this._label = label;
    }

    set summary(summary) {
        this._summary = summary;
    }

    set validateon(on) {
        this._is_validate_on = on;
    }


    get name() {
        return this._name;
    }

    get type() {
        return this._type;
    }

    get options() {
        return this._options;
    }

    get isprimary() {
        return this._is_primary;
    }

    get required() {
        return (this._min > 0) ? true : false;
    }

    get summary() {
        return this._summary;
    }

    get readonly() {
        return this._readonly;
    }

    get placeholder() {
        return this._placeholder;
    }

    get default() {
        return this._default;
    }

    get atts() {
        return this._atts;
    }

    get conditions() {
        return this._conditions;
    }

    get link() {
        return this._link;
    }

    get isparent() {
        return this._is_parent
    }

    get multiple() {
        return this._multiple;
    }
    
    get confirm() {
        return this._confirm;
    }

    get reference() {
        return this._reference;
    }

    get error() {
        if (!this._error) return "";
        else if (isNaN(this._error)) return this._error;
        else return Errors.getError(this._error);
    }

    get showError() {
        return (this._is_validate_on && this._error) ? true : false;
    }

    get label() {
        return this._label;
    }


    saveAsset(id) {
        if (this._asset) {
            let file = this.val;
            if (file) return this._asset.saveFile(this.val, id);
        } 
        return Promise.resolve();
    }


    setOptions(params) {
        this._options.length = 0;
        if (this._reference) {
            Client.get(this._reference, params)
                .then(response => {
                    for (let i in response.__data) {
                        if (i.indexOf("__") === 0) continue;
                        this._options.push({ key: response.__data[i].id, value: response.__data[i].value });
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        } else {
            try {
                for (let opt of this._atts.options) {
                    this._options.push({ key: opt, value: opt });
                }
            } catch (e) {
                console.log("options not set for ", this._name);
            }
        }
    }

    clean(val) {
        return (this._type == "checkbox") ? Boolean(val) : val;
    }

    validate(value) {
        return this._validator.validate(value);
    }

    exp() {
        return {
            name : this._name,
            type : this._type,
            atts : this._atts
        }
    }

    calcValue(value) {
        if (!value) return "";
        else return value;
    }


}


