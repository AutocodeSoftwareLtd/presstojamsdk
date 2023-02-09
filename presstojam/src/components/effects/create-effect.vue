<template>
    <ptj-form :entity_name="name" :id="id" />
</template>
<script setup>
    import PtjForm from "../form/form.vue"
    import { subscribe, unsubscribe , trigger} from "../../js/bus/bus.js"
    import { onBeforeUnmount } from "vue"
  
  
    const props = defineProps({
        id : {
            type : Number,
            default : 0
        },
        name : String
    });


      
    subscribe("form_saved", "create", (response, method, model) => {
        if (model.name == props.name && method == "post") {
            trigger("effect_created", props.name, response);
        }
    });

    onBeforeUnmount(() => {
        unsubscribe("form_saved", "create");
    });

</script>