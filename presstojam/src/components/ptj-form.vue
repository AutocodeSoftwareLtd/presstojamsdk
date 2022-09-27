<template>

 <form @submit.prevent="submit" class="card">
    <Message severity="success" v-if="saved">Saved</Message>
    <Message severity="error" v-show="global_error">{{ global_error }}</Message>
    <div v-if="parent" class="form-group">
        <label>{{ $t("models." + store.route.parent + ".title")}}</label>
        <ptj-parent-select v-model="proxy_values['--parent']" :model="store.route.parent" :common_parent="common_parent" :common_parent_id="common_parent_id" />
    </div>
    <div class="field form-group" v-for="field in cells" :key="field.name" :field="field">
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
import { getMutableCells, getImmutableCells } from "./../js/helperfunctions.js"
import Message from 'primevue/message';
import Client from "./../js/client.js"
import PtjParentSelect from "./fields/ptj-parent-select.vue"



const props = defineProps({
    store : Object,
    parent : Boolean,
    common_parent : String,
    common_parent_id : Number
});

const emits = defineEmits([
    "saved"
])

const active_validation = ref(false);
const saved = ref(false);
const state_changed = ref(0);

provide("model", props.store.model);

const cells = computed(() => {
    let state = state_changed.value;
    if (props.store.active.value['--id']) return getMutableCells(props.store.route.schema);
    else return getImmutableCells(props.store.route.schema);
});


const errors = reactive({});
const global_error =ref();
const proxy_values = reactive({});
const dirty_cells = {};


if (props.parent) {
    proxy_values['--parent'] = computed({
        get() {
            return props.store.active.value['--parent'];
        },
        set(val) {
            const schema = props.store.route.schema['--parent'];
            const result = schema.validate(val);
            if (result) {
                errors['--parent'] = result;
            } else if (errors['--parent']) {
                delete errors['--parent'];
            }
            props.store.active.value['--parent'] = schema.clean(val);
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



const fields = cells.value;
for(const field in fields) {
    proxy_values[field] = computed({
        get() {
            props.store.active.value[field] = props.store.route.schema[field].clean(props.store.active.value[field]);
            return props.store.active.value[field];
        },
        set(val) {
            const schema = props.store.route.schema[field];
            const result = schema.validate(val);
            if (result) {
                errors[field] = result;
            } else if (errors[field]) {
                delete errors[field];
            }
            
            props.store.active.value[field] = schema.clean(val);

            if (props.store.route.state_handlers && props.store.route.state_handlers[field]) {
                let has_handler = false;
                for(let s of schema.state_handlers) {
                    s.updateState(val);
                    has_handler = true;
                }
                if (has_handler){
                    ++state_changed.value;
                }
            }
             
            dirty_cells[field] = true;
            //reset to force a change
        }
    });

    const schema = props.store.route.schema[field];
    for(let s of schema.state_handlers) {
        s.updateState(props.store.active[field]);
    }

    //validate the first time each value
    const result = props.store.route.schema[field].validate(props.store.active.value[field]);
    if (result) {
        errors[field] = result;
    }
}


function setErrors(err) {
    if (typeof err == "string") {
        global_error.value = err;
    } else {
        return err.json()
        .then(response => {
            const msg = response.exception[0];
            if (msg.type == "PressToJamCore\\Exceptions\\ValidationException") {
                for(let i in err) {
                    if (i.indexOf("__") !== 0) errors[i] = err[i];
                }
            }
        });
    }
}

function serializeData() {
    const formData = new FormData();
    for(const i in dirty_cells) {
        if (cells.value[i]) {
            const field = cells.value[i];
            if (field.type == "time") formData.append(i, field.buildString(props.store.active.value[i]));
            else formData.append(i, props.store.active.value[i]);
        }
    } 
    return formData;
}


function submit() {
    saved.value = false;
    active_validation.value = true;
    if (Object.keys(errors).length == 0) {
        const method = (props.store.active.value['--id']) ? 'put' : 'post';
        const data = serializeData();
        if (method == "put") {
            data.append("--id", props.store.active.value['--id']);
        } else if (method == "post" && props.store.active.value['--parent']) {
            data.append("--parent", props.store.active.value['--parent']);
        }
         
        return Client[method]("/data/" + props.store.model, data)
        .then(response => {
            if (method == 'post') props.store.active.value["--id"] = response["--id"];
        })
        .then(() => {
            saved.value = true;
            emits("saved");
        }).catch(err => {
            if (err.response) setErrors(err.response);
            else console.log(err);
        });
    }
}





</script>
