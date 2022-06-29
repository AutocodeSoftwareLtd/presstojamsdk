<template>
    <form @submit.prevent="submit" v-show="fstate==0" class="ptj-form" :class="Map.model + ' ' + Map.state">
        <ptj-form-row :field="field">
           <input type="password"
                :name="field.name"
                v-model="field.change" 
                @blur="field.validateon = true" />
        </ptj-form-row>
        <ptj-form-row :field="field">
          <ptj-confirm :field="field" />
        </ptj-form-row>
        <input type="submit" :value="getDictionary('ptj-reset-form-btn')" class="ptj-form-submit">
  </form>
</template>

<script setup>

import { ref } from "vue"
import { getDictionary } from "./../js/dictionary.js"
import PtjFormRow from "./ptj-form-row.vue"
import PtjConfirm from "./ptj-form-confirm.vue"
import { Map } from "./../js/map.js"

const props = defineProps({
    field : Object
});

const fstate = ref(0);

const emit = defineEmits(['close']);

function submit() {

    fstate.value = 1;
    let key = 0;
    let ndata = {};
    ndata["--id"] = Map.key; //only called from primary field
    ndata[field.name] = field.change;
    return client.put("/data/" +  Map.model, ndata)
    .then(() => {
        emit("close");
    })
    .catch(err => {
            //show error fields, mark fields as invalidated
        fstate.value = 0;
        if (typeof err == "string") {
            globalerror = err;
        } else {
            cdata.setErrors(err);
        }
    });
}

</script>