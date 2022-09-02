<template>

 <form @submit.prevent="submit" class="card">
    <small class="p-error" v-show="errors.__global">{{ errors.__global }}</small>
    <div class="field" v-for="field in cells" :key="field.name" :field="field">
        <label :for="field.name">{{ $t("models." + field.model + ".fields." + field.name + ".label") }}</label>
        <ptj-edit-field :field="field" v-model="proxy_values[field.name]" />
        <ptj-error :field="field" v-if="active_validation && errors[field.name]" :error="errors[field.name]" />
    </div>
    <Button :label="$t('btns.save')" @click="submit" />
  </form>
  
</template>

<script setup>

import { inject, computed, ref, reactive } from "vue" 
import PtjEditField from "./ptj-edit-field.vue"
import Button from 'primevue/Button'
import PtjError from "./ptj-error.vue"
import { getDataStoreById } from "./../js/datastore.js"

const model = inject("model");
const active_store = getDataStoreById(model);
const store = active_store.store;
const active_validation = ref(false);

const cells = computed(() => {
    const fields = {};
    for(let i in store.route.schema) {
        if (!store.route.schema[i].background) fields[i] = store.route.schema[i];
    }
    return fields;
});

const errors = reactive({});
const proxy_values = reactive({});

for(const field in cells.value) {
    proxy_values[field] = computed({
        get() {
            return store.active[field];
        },
        set(val) {
            const result = store.route.schema[field].validate(val);
            if (result) {
                errors[field] = result;
            }
            store.active[field] = val;
        }
    });
}


function submit() {
    active_validation.value = true;
    console.log("Errors", errors);
    if (Object.keys(errors).length == 0) {
        active_store.save()
        .then(() => {
            if (!store.errors) {
                emit("close");
            }
        })
    }
}


</script>
