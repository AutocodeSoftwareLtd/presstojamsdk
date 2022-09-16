import { Field } from "./field.js"

export class Time extends Field {

    constructor(name, obj) {
        super(name);
        if (obj) this.apply(obj);
        if (!this._contains.length) {
            this._contains.push('Y-m-d H:i:s');
        } 
    }


    buildDate(date_string) {
        const date = new Date();
    
        const isTime = function(val) {
            return (val.indexOf(":") > -1) ? true : false;
        }

        const isDate = function(val) {
            return (val.indexOf("-") > -1) ? true : false;
        }

        const makeDate = function(val) {
            const pts = val.split("-");
            date.setYear(pts[0]);
            date.setMonth(pts[1]);
            date.setDate(pts[2]);
        }

        const makeTime = function(time) {
            let pts = time.split(":");  
            for(let i in pts) {
                if (i == 0) date.setHours(pts[i]);
                else if (i == 1) date.setMinutes(pts[i]);
                else if (i == 2) date.setSeconds(pts[i]);
            }
        }

        let pts = date_string.split(" ");
        for(const pt of pts) {
            if (isDate(pt)) makeDate(pt);
            else if (isTime(pt)) makeTime(pt);
        }
        return date;
    }

    buildString(date_obj) {
        let tZero = function(val, num) {
            return String(val).padStart(num, '0');
        }

        return date_obj.getFullYear() 
            + "-" + tZero(date_obj.getMonth(), 2) 
            + "-" + tZero(date_obj.getDate(), 2) 
            + " " 
            + tZero(date_obj.getHours(), 2) 
            + ":" 
            + tZero(date_obj.getMinutes(), 2) 
            + ":" 
            + tZero(date_obj.getSeconds(), 2);
    }


    get type() {
        return "time";
    }

}