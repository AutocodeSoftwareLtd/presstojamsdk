import { reactive, ref } from "vue"

export class Data {

    constructor(model) {
        this._parent_id = ref();
        this._model = model;
        this._is_loading = ref(false);
        this._load_promise = null;
        this._key = new Date().getTime();
        this._active = ref({});
    }
}