<template>
    <button @click="toggleState" :disabled="editable_ready?false:true">{{ next_state }}</button>
    <button @click="toggleDel">Delete</button>
    <ptj-modal :active="show_del" @close="toggleDel()">
    <ptj-delete  />
    </ptj-modal>
    <div class="ptj-primary" :class="map.model" v-show="editable == false">
        <div v-for="(field, index) in data.cells" :key="index" :field="field">  
          <span>{{ field.meta.label }}</span>&nbsp;
          <ptj-asset v-if="field.meta.type=='asset'" :field="field" />
          <ptj-number v-else-if="field.meta.type=='number'" :field="field" />
          <ptj-flag v-else-if="field.meta.type=='flag'" :field="field" />
          <ptj-id v-else-if="field.meta.type=='id'" :field="field"  />
          <ptj-time v-else-if="field.meta.type=='time'" :field="field" />
          <ptj-string v-else-if="field.meta.type=='string'" :field="field"  />
        </div>
    </div>
    <ptj-form v-if="editable_ready" state="put" v-show="editable == true" :data="data" />
    
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
import Settings from "./../js/settings.js"
import { inject, reactive, ref, computed } from "vue"
import PtjDelete from "./ptj-delete.vue"
import PtjModal from "./ptj-modal.vue"
import PtjForm from "./ptj-form.vue"
  
const map = inject("map");
const meta = inject("meta");
const data = reactive(new DataRow(meta));
const settings = Settings.getModelSettings(map.model, map.state);
const show_del = ref(false);
const editable = ref(false);
let editable_ready = ref(false);

function toggleState() {
    if (editable_ready.value) {
        editable.value = (editable.value) ? false : true;
    }
}

let next_state = computed(() => {
    return (editable.value) ? "view" : "edit";
});

function toggleDel() {
    show_del.value = (show_del.value) ? false : true;
}


const load = async() => {
    let params = {};
    if (map.to) params.__to = map.to;
    if (map.key) params.__key = map.key;
    if (settings.fields) params.__fields = settings.fields;
    return client.get("/" + map.model + "-primary", params)
    .then(response => {
        if (response.__status != "SUCCESS") throw new Error(response);
        data.row = response;
        editable_ready.value = true;
        return response;
    })
    .catch(e => {
        console.log(e);
    });
}

load();

</script>