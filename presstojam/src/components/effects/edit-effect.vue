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
        data : Object
    });


    subscribe("form_saved", "update", (response, method, model) => {
        if (model.name == props.model.name && method == "put") {
            const repo = getStore(props.model.name);

            //build the full value
            const obj = response.original;
            for(const x in response.data) {
                obj[x] = response.data[x];
            }
            repo.overwrite(obj);
            trigger("effect_edited", props.model.name);
        }
    });

    onBeforeUnmount(() => {
        unsubscribe("form_saved", "update");
    });


</script>