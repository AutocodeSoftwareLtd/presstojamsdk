<template>
    <button v-if="RouteStore.route.perms.includes('put')" @click="toggleState">{{ next_state }}</button>
    <button v-if="RouteStore.route.perms.includes('delete')" @click="toggleDel">Delete</button>
    <ptj-modal :active="show_del" @close="toggleDel()">
        <ptj-delete :parentid="store.data.parent" @close="toggleDel()" />
    </ptj-modal>
    <div class="ptj-primary" :class="Map.model">
        <ptj-form-row v-for="field in store.data.cells" :key="field.name" :field="field"> 
          <ptj-asset v-if="field.meta.type=='asset'" :type="store.type" :field="field" />
          <ptj-number v-else-if="field.meta.type=='number'" :type="store.type" :field="field" />
          <ptj-flag v-else-if="field.meta.type=='flag'" :type="store.type" :field="field" />
          <ptj-id v-else-if="field.meta.type=='id'" :type="store.type" :field="field"  />
          <ptj-time v-else-if="field.meta.type=='time'" :type="store.type" :field="field" />
          <ptj-string v-else-if="field.meta.type=='string'" :type="store.type" :field="field"  />
        </ptj-form-row>
        <input v-if="store.type =='edit'" type="submit" value="Submit" class="ptj-form-submit" @click="submit">
    </div>
    <div class="ptj-children">
        <ptj-button v-for="action in RouteStore.route.children" :key="action" :route="{ model : action, state : 'parent'}">
            {{ action }}
        </ptj-button>
    </div>
</template>

<script setup>
import client from "./../js/client.js"
import PtjNumber from "./ptj-number.vue"
import PtjAsset from "./ptj-asset.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjId from "./ptj-id.vue"
import PtjTime from "./ptj-time.vue"
import PtjString from "./ptj-string.vue"
import { DataRow } from "./../js/datarow.js"
import { reactive, ref, computed, onMounted } from "vue"
import PtjDelete from "./ptj-delete.vue"
import PtjModal from "./ptj-modal.vue"
import PtjForm from "./ptj-create-form.vue"
import PtjButton from "./ptj-button.vue"
import PtjFormRow from "./ptj-form-row.vue"
import { MetaRow } from "./../js/metarow.js"
import {RouteStore, getModelSettings } from "./../js/route.js"
import { Map } from "./../js/map.js"
  


const store = reactive({ data : new DataRow(), fstate : 0,  type : 'view', show_def : false, progress : { total : 0, progress : 0} });

let show_del = ref(false);



function toggleState() {
    store.type = (store.type == "view") ? "edit" : "view";
}

let next_state = computed(() => {
    return (store.type == "edit") ? "view" : "edit";
});

function toggleDel() {
    show_del.value = (show_del.value) ? false : true;
}


function buildParams(meta_settings) {
    let params = {};
    if (Map.to) params.__to = Map.to;
    if (Map.key) {
        if (Map.key == "first") params.__limit = 1;
        else params["--id"] = Map.key;
    }
    if (meta_settings.fields) params.__fields = meta_settings.fields;
    return params;
}


const load = async() => {
    let meta_settings = getModelSettings();
    let params = buildParams(meta_settings);
   
    return client.get("/route/" + Map.route + "/" + Map.model + "/primary", params)
    .then(response => {
        const meta = new MetaRow();
        meta.map(response.fields, meta_settings.fields ?? []);
        store.data.applyMetaRow(meta);
    }).then(() => {
        return client.get("/data/" + Map.route + "/" + Map.model + "/primary", params);
    }).then(response => {
        store.data.row = response;
        //set the change values as well for each row
        for(let i in store.data.cells) {
            store.data.cells[i].change = store.data.cells[i].val;
        }
    }).then(response => {
        for(let i in store.data.cells) {
            if (store.data.cells[i].type == "id" && store.data.cells[i].reference) {
                let url = "/reference/" + Map.model + "/" + i;
                store.data.cells[i].setReferenceOptions(url, {"--id" : Map.key});
            }
        }
    }).catch(e => console.log(e));

}


function submit() {

    store.fstate = (store.progress.total > 0) ? 1 : 2;
    store.data.clearErrors();
    let key = 0;
    let ndata = store.data.serialize(true);
    if (Object.keys(ndata).length == 0) {
        toggleState();
        return;
    }
    ndata["--id"] = Map.key;
    return client.put("/data/" + Map.route + "/" + Map.model, ndata)
    .then(response=>{
        let promises = [];
        let assets = store.data.getCellByType("asset");
        store.progress.total = 0;
        for(let i in assets) {
            const val = assets[i].val;
            if (!val) continue;
            ++store.progress.total;
            const asset = new Asset();
            asset.url = "/asset/" + Map.model + "/" + i + "/" + response["--id"];
            let promise = asset.saveFile(assets[i].val)
            .then(() => {
                ++store.progress.progress;
            });
            promises.push(promise);
        }
        return Promise.all(promises);
    })
    .then(() => {
        for(let i in store.data.cells) {
            store.data.cells[i].val = store.data.cells[i].change;
        }
    })
    .then(() => {
        toggleState();
    })
    .catch(err => {
            //show error fields, mark fields as invalidated
        store.fstate = 0;
        if (typeof err == "string") {
            globalerror = err;
        } else {
            store.data.setErrors(err);
        }
    });
}

onMounted(async () => {
 await load();
});

</script>