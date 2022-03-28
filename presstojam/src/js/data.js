import { computed, ref } from "vue"


export class DataCell {

    constructor(val = null, display = null) {
        this._value = ref(null);
        this._display = ref(null);

        if (val !== null) {
            this._value.value = val;
        }

        if (display !== null) {
            this._display.value = display;
        }

        this.val = computed(() =>  {
            return this._value.value;  
        });

        this.display = computed(() => {
            if (this._display.value) return this._display;
            else return this._value.value;
        });
    }

    toString() {
        return this.display;
    }


}