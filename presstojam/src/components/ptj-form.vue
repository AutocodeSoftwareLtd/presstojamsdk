<template>

 <form @submit.prevent="submit" class="card">
    <Message severity="success" v-if="saved">Saved</Message>
    <Message severity="error" v-show="errors.__global">{{ errors.__global }}</Message>
    <div class="field" v-for="field in cells" :key="field.name" :field="field">
        <label :for="field.name">{{ $t("models." + field.model + ".fields." + field.name + ".label") }}</label>
        <ptj-edit-field :field="field" v-model="proxy_values[field.name]" />
        <ptj-error :field="field" v-if="active_validation && errors[field.name]" :error="errors[field.name]" />
    </div>
    <Button :label="$t('btns.save')" @click="submit" />
  </form>
</template>

<script setup>

import { provide, computed, ref, reactive } from "vue" 
import PtjEditField from "./ptj-edit-field.vue"
import Button from 'primevue/Button'
import PtjError from "./ptj-error.vue"
import { getDataStoreById } from "./../js/datastore.js"
import { getForegroundCells } from "./../js/helperfunctions.js"
import Message from 'primevue/message';


const props = defineProps({
    model : String,
    store : Object
});

const emits = defineEmits([
    "close"
])

const active_validation = ref(false);
const saved = ref(false);
const state_changed = ref(0);

provide("model", props.model);


const cells = computed(() => {
    let state = state_changed.value;
    return getForegroundCells(props.store.route.schema);
});


const errors = reactive({});
const proxy_values = reactive({});

const fields = getForegroundCells(props.store.route.schema);
for(const field in fields) {
    proxy_values[field] = computed({
        get() {
            return props.store.active[field];
        },
        set(val) {
            const schema = props.store.route.schema[field];
            const result = schema.validate(val);
            if (result) {
                errors[field] = result;
            }
            props.store.active[field] = val;
            let has_handler = false;
            for(let s of schema.state_handlers) {
                s.updateState(val);
                has_handler = true;
            }
            if (has_handler){
                ++state_changed.value;
            }
            //reset to force a change
        }
    });
}


function submit() {
    saved.value = false;
    const active_store = getDataStoreById(props.model);
    active_validation.value = true;
    console.log("Errors", errors);
    if (Object.keys(errors).length == 0) {
        active_store.save()
        .then(() => {
            if (!props.store.errors) {
                saved.value = true;
                emits("close");
            }
        })
    }
}


</script>
