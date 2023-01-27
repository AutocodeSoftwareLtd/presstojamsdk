<template>
    <ptj-form :entity_name="name" :id="id" method="put" key="edit" />
  
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

 
    subscribe("form_saved", "update", (response, method, model) => {
        if (model.name == props.model.name && method == "put") {
            trigger("effect_edited", props.name, props.data);
        }
    });

    onBeforeUnmount(() => {
        unsubscribe("form_saved", "update");
    });


</script>