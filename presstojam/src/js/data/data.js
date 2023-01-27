import { ref } from "vue"

export class Data {

    constructor(model) {
        this._model = model;
        this._is_loading = ref(false);
        this._load_promise = null;
        this._key = new Date().getTime();
        this._active = ref({});
        this._selected = ref([]);
        this._data = ref(null);
    }


    get selected() {
        return this._selected;
    }

    get store() {
        return this._model;
    }

    get model() {
        return this._model;
    }

    get active() {
        return this._active;
    }

    get fields() {
        return this._model.fields;
    }

    get is_loading() {
        return this._is_loading;
    }

    get data() {
        return this._data;
    }

    trigger(key) {
        this._model.trigger(key, this);
    }
}