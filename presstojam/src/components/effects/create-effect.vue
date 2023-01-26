<template>
    <ptj-form :model="model" :data="data" />
</template>
<script setup>
    import PtjForm from "../form/form.vue"
    import { subscribe, unsubscribe , trigger} from "../../js/bus/bus.js"
    import { onBeforeUnmount } from "vue"
  
  
    const props = defineProps({
       model : Object,
       data : Object,
       name : String
    });

      
    subscribe("form_saved", "create", (response, method, model) => {
        if (model.name == props.model.name && method == "post") {
            trigger("effect_created", props.name, response);
        }
    });

    onBeforeUnmount(() => {
        unsubscribe("form_saved", "create");
    });

</script>