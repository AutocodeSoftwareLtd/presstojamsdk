<template>

 <form @submit.prevent="submit" class="card">
    <Message severity="success" v-if="saved">Saved</Message>
    <Message severity="error" v-show="global_error">{{ global_error }}</Message>
    <div v-if="parent" class="form-group">
        <label>{{ $t("models." + store.route.parent + ".title")}}</label>
        <ptj-parent-select v-model="proxy_values['--parent']" :model="store.route.parent" :common_parent="common_parent" :common_parent_id="common_parent_id" />
    </div>
    <div class="field form-group" v-for="bind in binds" :key="bind.cell.name">
       <label :for="bind.cell.name" v-if="bind.cell.type!='json'" >{{ $t("models." + bind.cell.model + ".fields." + bind.cell.name + ".label") }}</label>
        <ptj-edit-field :bind="bind" />
        <ptj-error :field="bind.cell" v-if="bind.active_validation.value && bind.error.value && bind.cell.type!='json'" :error="bind.error.value" />
    </div>
    <Button :label="$t('btns.save')" @click="submit" />
  </form>
  <Dialog v-model:visible="dispatch" :modal="true" class="p-fluid" >
    <ptj-dispatch v-if="dispatchid != 0" @complete="dispatchComplete" @failed="dispatchFailed" :id="dispatchid" />
  </Dialog>
</template>

<script setup>

import { provide, ref, computed, inject } from "vue" 
import PtjEditField from "./ptj-edit-field.vue"
import Button from 'primevue/button'
import PtjError from "./ptj-error.vue"
import { getMutableCells, getImmutableCells } from "./../js/helperfunctions.js"
import Message from 'primevue/message';
import PtjParentSelect from "./fields/ptj-parent-select.vue"
import { createBind, createBindGroup } from "./../js/binds.js"
import PtjDispatch from "./ptj-dispatch-response.vue"
import Dialog from 'primevue/dialog'


const Client = inject("client");

const props = defineProps({
    schema : Object,
    data : Object,
    model : String,
    parent : Boolean,
    method : {
        type : String,
        default : 'post'
    }
});

const emits = defineEmits([
    "saved", "dataChanged"
]);

const saved = ref(false);
const global_error = ref("");
const dispatch = ref(false);
const dispatchid=ref(0);

provide("model", props.model);


let cells;
if (props.stype == 'put') cells = getMutableCells(props.schema);
else cells = getImmutableCells(props.schema);


const bindGroup = createBindGroup();


if (props.parent) {
    bindGroup.addBind("--parent", createBind(props.schema["--parent"], props.data["--parent"]));
}


for(const field in cells) {
    bindGroup.addBind(field, createBind(props.schema[field], props.data[field]));
}


bindGroup.setInitActive();

const binds = computed(() => {
    const arr = [];
    for(let i in bindGroup.binds) {
        if (bindGroup.binds[i].active.value) {
            arr.push(bindGroup.binds[i]);
        } 
    }
    return arr;
});

function setErrors(err) {
    if (typeof err == "string") {
        global_error.value = err;
    } else {
        return err.json()
        .then(response => {
            const msg = response.exception[0];
            if (msg.type == "PressToJamCore\\Exceptions\\ValidationException") {
                for(let i in err) {
                    if (i.indexOf("__") !== 0) bindGroup.binds[i].setError(err[i]);
                }
            }
        });
    }
}

function serializeData() {
    const formData = new FormData();
    for(const i in bindGroup.binds) {
        const bind = bindGroup.binds[i];
        if (bind.is_dirty ) {
            const field = bind.cell;
            if (field.type == "time") formData.append(i, bind.cell.buildString(bind.value.value));
            else if (field.type == "json") formData.append(i, JSON.stringify(bind.cell.buildJSON(bind)));
            else formData.append(i, bind.value.value);
        }
    } 
    return formData;
}


function submit() {
    saved.value = false;
    bindGroup.activateValidation();
    if (bindGroup.hasErrors()) return;

    const data = serializeData();
    if (props.method == "put") {
        data.append("--id", props.data['--id']);
    } else if (props.method == "post" && props.data['--parent']) {
        data.append("--parent", props.data['--parent']);
    }
         

    return Client[props.method]("/data/" + props.model, data)
    .then(response => {
        if (props.method == 'post') {
            emits("dataChanged", response);
        } else if (props.method == "put") {
            response.data["--id"] = props.data["--id"];
            emits("dataChanged", response.data);
        }
        return response;
    })
    .then(response => {
        if (response['--dispatchid']) {
            dispatchid.value = response['--dispatchid'];
            dispatch.value = true;
        } else {
            saved.value = true;
            emits("saved");
        }
    })
    .catch(err => {
        if (err.response) setErrors(err.response);
        else console.log(err);
    });
    
}

function dispatchFailed(response) {
    setErrors(err.response);
    dispatch.value = false;
}

function dispatchComplete() {
    dispatch.value = false;
    saved.value = true;
    emits("saved");
}




</script>
