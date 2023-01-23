<template>
    <ptj-form :model="store" :data="data" />
</template>
<script setup>
    import { getStore } from "../../js/data/storemanager.js"
    import PtjForm from "../form/form.vue"
    import { subscribe, unsubscribe , trigger} from "../../js/bus/bus.js"
    import { onBeforeUnmount } from "vue"
  
  
    const props = defineProps({
       name : String
    });

    const repo = getStore(props.name);
    const store = repo.store;


    const data = {};
    if (store.parent_id) data["--parent"] = store.parent_id;

  
    subscribe("form_saved", "create", (response, method, model) => {
        if (model.name == store.name && method == "post") {
            repo.append(response);
            trigger("effect_created", props.name);
        }
    });

    onBeforeUnmount(() => {
        unsubscribe("form_saved", "create");
    });

</script>