<template>
    <div v-if="bind">
        <ptj-id-edit :bind="bind" />
    </div>
    <Button :label="$t('btns.save')" @click="submit" />
</template>
<script setup>
    import { provide, inject } from "vue"
    import Button from "primevue/button"
    import { createBind } from "./../../js/binds.js"
    import PtjIdEdit from "./../fields/ptj-id-edit.vue"
    import {getStore } from "./../../js/reactivestores.js"
    
    const client = inject("client");

    const props = defineProps({
        name : {
            type : String,
            required : true
        }
    });

    const emits = defineEmits(['onMove']);

    const repo = getStore(props.name);
    const store = repo.store;
    
    provide("model", store.model);

   
    const bind = createBind(store.route.schema['--recursive'], 0);


    function submit() {
        let promise = [];
        for(const row of repo.selected.value) {
            const obj = {"--id" : row['--id'], "--recursive" : bind.value.value };
            promise.push(client.put("/data/" + store.model, obj));
        }
        return Promise.all(promise)
        .then(() => {
            emits("onMove");
        })
        .catch(e => console.log(e));
    }


</script>