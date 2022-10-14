<template>
    <div v-if="bind">
        <ptj-id-edit :bind="bind" />
    </div>
    <Button :label="$t('btns.save')" @click="submit" />
</template>
<script setup>
    import { provide, computed } from "vue"
    import Button from "primevue/Button"
    import { createBind } from "./../../js/binds.js"
    import PtjIdEdit from "./../fields/ptj-id-edit.vue"
    import {getStore } from "./../../js/reactivestores.js"

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

   
    const bind = computed(() => {
        return createBind(store.route.schema['--recursive'], repo.active.value['--recursive']);
    });


    function submit() {
        let promise = [];
        for(const i in store.selected.value) {
            promise.push(client.put("/data/" + store.model, {"--id" : store.selected.value[i].key, "--recursive" : bind.value.value }));
        }
        return Promise.all(promise)
        .then(() => {
            emits("onMove");
        })
        .catch(e => console.log(e));
    }


</script>