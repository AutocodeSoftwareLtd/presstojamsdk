<template>
    <Button icon="pi pi-history" 
    class="mr-2" 
    :class="classes"
    :label="label"
    @click="showAudit()" />
</template>
<script setup>
    import Button from "primevue/button"
    import { toggleDialog } from "./../../js/bus/dialog.js"
    import AuditEffect from "./../effects/audit-effect.vue"
  
    const props = defineProps({
        model : Object,
        data : Object,
        long : false
    });

    function showAudit() {
        toggleDialog(AuditEffect, {model : props.model, id : props.data['--id']}, "Audit Log");
    }

    const label = (props.long) ? "Audit" : "";
    const classes = (props.long) ? "p-button-help" : "p-button-rounded p-button-success";

</script>