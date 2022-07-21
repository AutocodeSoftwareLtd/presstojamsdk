<template>
 <form @submit.prevent="submit" v-show="fstate==0" class="ptj-form" :class="Map.model + ' ' + Map.state">
    <div class="ptj-form-error" v-show="globalerror">{{ globalerror }}</div>
    <ptj-form-row v-for="field in cdata.cells" :key="field.name" :field="field">
          <ptj-asset v-if="field.type=='asset'" :field="field" />
          <ptj-number v-else-if="field.type=='number'" :field="field"/>
          <ptj-flag v-else-if="field.type=='flag'" :field="field" />
          <ptj-id v-else-if="field.type=='id'" :field="field"  :parent="Map.key" />
          <ptj-time v-else-if="field.type=='time'" :field="field" />
          <ptj-string v-else-if="field.type=='string'" :field="field" />
          <ptj-form-row :field="field" v-if="field.encrypted">
            <ptj-confirm :field="field" />
          </ptj-form-row>
    </ptj-form-row>
    <input type="submit" :value="getDictionary('ptj-create-form-btn')" class="ptj-form-submit">
    <ptj-progress-bar v-show="fstate == 1" :total="progress.total" :progress="progress.progress" />
  </form>
  
</template>

<script setup>

import {ref, reactive, onMounted } from "vue" 
import PtjFormRow from "./ptj-form-row.vue"
import PtjProgressBar from "./ptj-progress-bar.vue"
import PtjAsset from "./ptj-asset.vue"
import PtjNumber from "./ptj-number.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjId from "./ptj-id.vue"
import PtjTime from "./ptj-time.vue"
import PtjString from "./ptj-string.vue"
import PtjConfirm from "./ptj-form-confirm.vue"
import client from "./../js/client.js"
import { DataRow } from "./../js/datarow.js"
import { MetaRow } from "./../js/metarow.js"
import { Map } from "./../js/map.js"
import { loadRepo } from "./../js/repo.js"
import { getDictionary } from "./../js/dictionary.js"

const emit = defineEmits(['close']);
let globalerror = ref('');

const cdata = reactive(new DataRow());


const progress = reactive({ total : 0, progress : 0});

let fstate = 0;



const load = async() => {
    return client.post("/meta/" + Map.model)
    .then(response => {
        const meta = new MetaRow();
        meta.map(response.fields);
        cdata.applyMetaRow(meta);
        cdata.setMode('post');

        let promises = [];
        for(let i in meta.cells) {
            if (meta.cells[i].type == 'id' && meta.cells[i].reference) {
                let url = "/reference/" + Map.model + "/" + i;
                promises.push(meta.cells[i].setReferenceOptions(url, {"--parentid":Map.key}));
            }
        }
        return Promise.all(promises);
    }).catch(e => console.log(e));
}


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

onMounted(async () => {
    await load();
});

</script>
