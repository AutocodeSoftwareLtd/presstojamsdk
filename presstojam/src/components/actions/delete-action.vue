<template>
    <Button label="Delete" icon="pi pi-trash" class="p-button-danger"
                        :disabled="disabled" @click="delRow" />

</template>
<script setup>
    import Button from "primevue/button"
    import DeleteEffect from "../effects/delete-effect.vue"
    import { trigger } from "./../../js/bus/bus.js"
    import { computed } from "vue"
  
 
    const props = defineProps({
        name : String,
        data : [Object, Array]
    });


    function delRow() {

        const arg_data = (Array.isArray(props.data)) ? props.data : [props.data];
        trigger(
            "dialog_open",
            DeleteEffect, 
            {
                name : props.name,
                data : arg_data
            }, 
            "Delete");
    }

    const disabled = computed(() => {
        return (!props.data) ? true : false;
    });


</script>