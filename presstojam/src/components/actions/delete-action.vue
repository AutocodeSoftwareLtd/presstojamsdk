<template>
    <Button label="Delete" icon="pi pi-trash" class="p-button-danger"
                        :disabled="disabled" @click="delRow" />

</template>
<script setup>
    import Button from "primevue/button"
    import DeleteEffect from "../effects/delete-effect.vue"
    import { toggleDialog } from "./../../js/bus/dialog.js"
    import { computed } from "vue"
  
 
    const props = defineProps({
        name : String,
        data : [Object, Array]
    });


    function delRow() {
        toggleDialog(DeleteEffect, {
            name : props.name,
            data : props.data
        }, "Delete");
    }

    const disabled = computed(() => {
        return (!props.data) ? true : false;
    });


</script>