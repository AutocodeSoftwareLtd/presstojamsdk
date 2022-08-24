<template>

 <form @submit.prevent="submit" class="card" v-show="fstate==0">
    <small class="p-error" v-show="globalerror">{{ globalerror }}</small>
    <div class="field" v-for="field in fields" :key="field.name" :field="field">
        <label :for="field.name">{{ getDictionary("", { model : field.model, field : field.name, default : field.name }) }}</label>
        <ptj-edit-field :field="field" />
    </div>
    <Button :label="getDictionary('ptj-create-form-btn')" 
    icon="pi pi-check" iconPos="right" @click="$emit('save')" />
  </form>
  
</template>

<script setup>

import { inject, ref } from "vue" 
import PtjEditField from "./ptj-edit-field.vue"
import { getDictionary } from "./../js/dictionary.js"
import Button from 'primevue/Button';


const fields = inject("meta");


let globalerror = ref('');


let fstate = 0;


function submit() {

    fstate = (progress.total > 0) ? 1 : 2;
    cdata.clearErrors();
    let key = 0;
    let ndata = cdata.serialize();
    if (Map.key) ndata["--parentid"] = Map.key;
    return client.post("/data/" + Map.model, ndata)
    .then(response=>{
        key = response["--id"];
        let promises = [];
        let assets = cdata.getCellByType("asset");
        progress.total = 0;
        for(let i in assets) {
            const val = assets[i].val;
            if (!val) continue;
            ++progress.total;
            const asset = new Asset();
            asset.url = "/asset/" + Map.model + "/" + i + "/" + response["--id"];
            let promise = asset.saveFile(assets[i].val)
            .then(() => {
                ++progress.progress;
            });
            promises.push(promise);
        }
        return Promise.all(promises);
    })
    .then(() => {
        cdata.reset();
        loadRepo();
        emit("close");
    })
    .catch(err => {
            //show error fields, mark fields as invalidated
        fstate = 0;
        return err.json()
        .then(response => {
            const msg = response.exception[0];
            if (msg.type == "PressToJamCore\\Exceptions\\ValidationException") {
                cdata.setErrors(JSON.parse(msg.message));
            }
            console.log("Err response", response);
        });
        
    });
}


</script>
