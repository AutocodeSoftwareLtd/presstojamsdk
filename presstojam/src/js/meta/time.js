import { Field } from "./field.js"

export class Time extends Field {

    constructor(name, obj) {
        super(name);
        this._format = { date : true, time : false}
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