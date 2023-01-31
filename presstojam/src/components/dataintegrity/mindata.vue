<template>
    <data-display v-if="current_num.value" :repo="repo" />
    <Card v-if="current_model" >
        <template #header> 
            <h2>{{header}}</h2>
        </template>
        <template #content>
            <ptj-form :entity_name="current_model" />
        </template>
    </Card>
</template>
<script setup>
import { trigger, subscribe, unsubscribe } from "./../../js/bus/bus.js"
import { getClient } from "./../../js/client.js"
import { getEntity } from "./../../js/entity/entitymanager.js"
import { ref, onBeforeUnmount, computed, inject } from "vue"
import DataDisplay from "./../displays/data-display.vue"
import PtjForm from "./../form/form.vue"
import Card from 'primevue/card';
import { RepoData } from "../../js/data/repodata"

const props = defineProps({
    model : String,
    parent_id : Number
});

const i18n = inject("i18n");
const t = i18n.t;


const client = getClient();

const current_model = ref(null);
const current_num = ref(0);
const repo = ref(null);

const data = computed(() => {
    const cdata = {};
    if (props.parent_id) cdata["--parent"] = props.parent_id;
    return cdata; 
});

const header = computed(() => {
    return (current_model.value.parent)
        ? "Add " + t("models." + current_model.value + ".title", 1) + " to " + t("models." + current_model.value.parent + ".title", 1)
        : "Create " + t("models." + current_model.value + ".title", 1);
});

function checkData() {
    let url = "/check";
    if (props.model) url += "/" + props.model + "/" + props.parent_id;
    client.get(url)
    .then(checks => {
        for(const i in checks) {
            const entity = getEntity(i);
            if (entity.perms.includes("post") && entity.min_rows && entity.min_rows > checks[i]) {
                current_model.value = i;
                current_num.value = checks[i];
                if (current_num.value) {
                    repo.value = new RepoData(i);
                    repo.parent_id = props.parent_id;
                } else {
                    repo.value = null;
                }
                return;
            }
        }
        //if we get here, then no checks
        trigger("integrity_min_data", props.model, true);
    });
}


subscribe("form_saved", "integrity_min_data", () => {
    current_num.value = 0;
    current_model.value = '';
    checkData();
});

onBeforeUnmount(() => {
    unsubscribe("form_saved", "integrity_min_data");
});

checkData();

</script>