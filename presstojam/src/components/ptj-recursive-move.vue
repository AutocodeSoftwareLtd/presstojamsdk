<template>
    <div>
        <ptj-id-edit :field="props.store.route.schema['--recursive-id']" v-model="value" />
    </div>
    <Button :label="$t('btns.save')" @click="submit" />
</template>

<script setup>

import client from "./../js/client.js"
import { computed, provide } from "vue";
import Button from "primevue/Button"
import PtjIdEdit from "./fields/ptj-id-edit.vue"



const props = defineProps({
    store : Object,
    model : String
});

const emits = defineEmits(['onMove']);

provide("model", props.store.model);
const value = computed({
    get() {
        return props.store.active.value['--recursive-id'];
    },
    set(val) {
        props.store.active.value['--recursive-id'] = val;
    }
});



function submit() {
    let promise = [];
    for(const i in props.store.selected.value) {
        promise.push(client.put("/data/" + props.store.model, {"--id" : props.store.selected.value[i].key, "--recursive-id" : value.value }));
    }
    return Promise.all(promise)
    .then(() => {
        emits("onMove");
    })
    .catch(e => console.log(e));
}
    
</script>
