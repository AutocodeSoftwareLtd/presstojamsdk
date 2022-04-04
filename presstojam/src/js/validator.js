export class Validator {

    constructor() {
        this._min;
        this._max;
        this._has = [];
        this._has_not = [];
        this._errors = {
            'OK' : 0,
            'MIN_VALUE' : 1,
            'MAX_VALUE' : 2,
            'HAS' : 3,
            'HAS_NOT' : 4
        }
    }

    set min(min) {
        this._min = min;
    }

    set max(max) {
        this._max = max;
    }

    set has(has) {
        this._has.push(has);
    }

    set nothas(nhas) {
        this._has_not.push(nhas);
    }



    validateSize(val) {
        if (val < this._min) return this._errors.MIN_VALUE;
        else if (val > this._max) return this._errors.MAX_VALUE;
        else return this._errors.OK;
    }


    validate(val) {
        let err;
        if (isNaN(val)) {
            const length = (val) ? val.length : 0;
            err = this.validateSize(length);
        } else {
            err = this.validateSize(val);
        }
        if (err != this._errors.OK) return err;

        for(let nhas of this._has_not) {
            if (val.match(nhas)) return this._errors.HAS_NOT;
        }

        if (this._has.length == 0) return this._errors.OK;
        
        for(let has of this._has) {
            if (val.match(this._has)) return this._errors.OK;
        }
        return this._errors.HAS;
    }

}