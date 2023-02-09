<template>
   <p>Are you sure you want to delete:</p>
        <ul>
            <li v-for="item in data">{{ getLabel(store.model.fields, item) }}</li>
        </ul>
        <p>Type <i>{{ check_str }}</i> in the box below</p>
        <div class="p-inputgroup">
            <InputText :placeholder="check_str" v-model="delval"/>
            <Button label="Delete" :disabled="disabled" icon="pi pi-trash" @click="del" class="p-button-danger">Delete</Button>
        </div>
</template>
<script setup>
    import { ref, computed, inject } from "vue"
    import Button from "primevue/button"
    import InputText from 'primevue/inputtext';
    import { getLabel } from "../../js/helperfunctions.js"
    import { trigger } from "../../js/bus/bus.js"
 
    const client = inject("client");

    const props = defineProps({
        name : String,
        data : Array,
        store : Object
    });


    const check_str = "delete";

    let delval = ref("");

    const disabled = computed(() => {
        return (delval.value == check_str) ? false : true;
    });

   
    function del() {
        let params = {};
        const keys = [];
     
        for(const row of props.data) {
            keys.push(row['--id']);
        }
        params["--id"] = keys;

        client.delete("/data/" +props.store.store.name, params)
        .then(() => {
            props.store.remove(keys);
            trigger("effect_deleted", props.name);
        })
        .catch(e => console.log(e));
    }
    

</script>