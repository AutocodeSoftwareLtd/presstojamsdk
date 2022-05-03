<template>
 <form @submit.prevent="submit" v-show="fstate==0" class="ptj-form" :class="map.model + ' ' + map.state">
    <div class="ptj-form-error" v-show="globalerror">{{ globalerror }}</div>
    <ptj-form-row v-for="field in cdata.cells" :key="field.name" :field="field">
          <ptj-asset v-if="field.meta.type=='asset'" type="edit"  :field="field" />
          <ptj-number v-else-if="field.type=='number'" type="edit"  :field="field"/>
          <ptj-flag v-else-if="field.type=='flag'" type="edit"  :field="field" />
          <ptj-id v-else-if="field.type=='id'" type="edit"  :field="field" />
          <ptj-time v-else-if="field.type=='time'" type="edit"   :field="field" />
          <ptj-string v-else-if="field.type=='string'" type="edit"  :field="field" />
    </ptj-form-row>
    <input type="submit" value="Submit" class="ptj-form-submit">
    <ptj-progress-bar v-show="fstate == 1" :total="progress.total" :progress="progress.progress" />
  </form>
  
</template>

<script setup>

import { inject, ref, reactive } from "vue" 
import PtjFormRow from "./ptj-form-row.vue"
import PtjProgressBar from "./ptj-progress-bar.vue"
import PtjAsset from "./ptj-asset.vue"
import PtjNumber from "./ptj-number.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjId from "./ptj-id.vue"
import PtjTime from "./ptj-time.vue"
import PtjString from "./ptj-string.vue"
import Settings from "./../js/settings.js"
import client from "./../js/client.js"
import Errors from "./../js/error.js"

const props = defineProps({
    state : String,
    data : Object
});

const map = inject("map");
const meta = inject("meta");
let globalerror = ref('');
const settings = Settings.getModelSettings(map.model, map.state);

const cdata = reactive(props.data.clone());
const progress = { total : 0, progress : 0};

let fstate = 0;

function clearErrors() {
    globalerror.value = "";
    for(let i in cdata.cells) {
        cdata.cells[i].error = 0;
    }
};

function reset() {
    for(let i in props.data.cells) {
        cdata.cells[i].error = 0;
        cdata.cells[i].val = props.data.cells[i].val;
    }
}

function submit() {

    fstate = (progress.total > 0) ? 1 : 2;
    clearErrors();
    let key = 0;
    let ndata = cdata.serialize(props.state);
    if (map.key) ndata.__key = map.key;
    return client[props.state]("/" + map.model, ndata)
    .then(request=>{
        if (request.__status!= "SUCCESS") {
            throw { message : request.statusText }
        }

        for(let i in cdata.cells) {
            data.getCell(i).val = cdata.cells[i].val;
        }
        if (map.state == "post") {
            key = request.__key;
        }
    })
    .then(() => {
        let promises = [];
        let assets = cdata.getCellByType("asset");
        progress.total = 0;
        for(let i in assets) {
            const val = assets[i].toVal();
            if (!val) continue;
            ++progress.total;
            const asset = new Asset();
            asset.url = "/" + map.model + "-" + i;
            let promise = asset.saveFile(assets[i].toVal(), data.primary.toVal())
            .then(() => {
                ++progress.progress;
            });
            promises.push(promise);
        }
        return Promise.all(promises);
    })
    .then(() => {
        $emit("complete", key);
    })
    .catch(err => {
            //show error fields, mark fields as invalidated
        fstate = 0;
        if (typeof err == "string") {
            globalerror = err;
        } else {
            for(let i in err) {
                if (i.indexOf("__") === 0) continue;
                const cell = cdata.cells[i];
                if (cell) {
                    cell.error = Errors.getError(err[i]);
                }
            }
        }
    });
}


</script>
