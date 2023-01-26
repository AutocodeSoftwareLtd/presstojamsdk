<template>
    <ptj-form :model="model" :data="data" method="put" key="edit" />
  
</template>
<script setup>
    import { getStore } from "../../js/data/storemanager.js"
    import PtjForm from "../form/form.vue"
    import { subscribe, unsubscribe , trigger} from "../../js/bus/bus.js"
    import { onBeforeUnmount } from "vue"

    const props = defineProps({
        model : Object,
        data : Object,
        name : String
    });

 
    subscribe("form_saved", "update", (response, method, model) => {
        if (model.name == props.model.name && method == "put") {
            trigger("effect_edited", props.name, props.data);
        }
    });

    onBeforeUnmount(() => {
        unsubscribe("form_saved", "update");
    });


</script>