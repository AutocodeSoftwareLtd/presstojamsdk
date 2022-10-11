<template>
    <div>
        <ptj-id-edit :bind="bind" />
    </div>
    <Button :label="$t('btns.save')" @click="submit" />
</template>

<script setup>

import client from "./../js/client.js"
import { provide } from "vue";
import Button from "primevue/Button"
import PtjIdEdit from "./fields/ptj-id-edit.vue"
import { createBind } from "./../js/binds.js"



const props = defineProps({
    store : Object,
    model : String
});

const emits = defineEmits(['onMove']);

provide("model", props.store.model);


const bind = createBind(props.store.route.schema['--recursive'], props.store.active.value['--recursive']);

function submit() {
    let promise = [];
    for(const i in props.store.selected.value) {
        promise.push(client.put("/data/" + props.store.model, {"--id" : props.store.selected.value[i].key, "--recursive" : bind.value.value }));
    }
    return Promise.all(promise)
    .then(() => {
        emits("onMove");
    })
    .catch(e => console.log(e));
}
    
</script>
