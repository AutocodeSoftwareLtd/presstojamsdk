<template>

 <form v-show="processing == false" @submit.prevent="submit" class="card needs-validation" novalidate>
    <Message severity="error" v-show="global_error">{{ global_error }}</Message>
    <div v-if="parent" class="form-group">
        <label>{{ $t("models." + store.parent + ".title")}}</label>
        <ptj-parent-select v-model="proxy_values['--parent']" :model="store.parent" :common_parent="common_parent" :common_parent_id="common_parent_id" />
    </div>
    <ptj-edit-field v-for="cell in cells" :bind="bindGroup.getBind(cell.name)" :key="cell.name" :data="data"/>
    <Button :label="$t('btns.save')" @click="submit" />
  </form>
  <Panel v-show="processing" Panel header="Processing">
        <p>Please do not refresh or close the browser until complete</p>
        <p>Status: {{ status }}</p>
        <p style='text-align:center;'><ProgressSpinner /></p>
    </Panel>
  </template>

<script setup>

import { provide, ref, inject } from "vue" 
import PtjEditField from "./edit-field.vue"
import Button from 'primevue/button'
import Message from 'primevue/message';
import PtjParentSelect from "./parent-select.vue"
import { BindGroup } from "../../js/binds/bindgroup.js"
import { Bind } from "../../js/binds/bind.js"
import { trigger } from "../../js/bus/bus.js"
import Panel from 'primevue/panel'
import ProgressSpinner from 'primevue/progressspinner'

const Client = inject("client");

const props = defineProps({
    data : Object,
    model : Object,
    method : {
        type : String,
        default : 'post'
    },
    parent : Boolean
});




const global_error = ref("");
const processing = ref(false);
const status = ref(0);

provide("model", props.model.name);


if (props.method == 'put') props.model.setEditableCells();
else props.model.setCreateCells();

const cells = props.model.getEnabledCells();


const bindGroup = new BindGroup();


if (props.parent) {
    bindGroup.addBind("--parent", new Bind(props.model.fields["--parent"], props.data["--parent"]));
}


for(const field in cells) {
    bindGroup.regBind(field, new Bind(cells[field], props.data[field]));
    if (cells[field].type == "json") {
        for(let ocell in cells[field].fields) {
            bindGroup.regBind(field + "-" + ocell, new Bind(cells[field].fields[ocell], (props.data[field]) ? props.data[field][ocell] : null));
        }
    } 
}


bindGroup.setInitActive();



function setErrors(err) {
    if (typeof err === 'string' || err instanceof String) {
        err = JSON.parse(err);
    }
    for(let i in err) {
        const bind = bindGroup.getBind(i);
        bind.error = err[i][0];
    }
}

function serializeData() {
    const formData = new FormData();
    for(const i in cells) {
        const bind = bindGroup.getBind(i);
        if (bind.is_dirty ) {
            const field = bind.cell;
            if (field.type == "time") formData.append(i, bind.cell.buildString(bind.value));
            else if (field.type == "json") formData.append(i, JSON.stringify(bind.cell.buildJSON(bind)));
            else formData.append(i, bind.value);
        }
    } 
    return formData;
}


function submit() {

    
    bindGroup.showValidation(true);
    if (bindGroup.hasErrors()) {
        global_error.value = "Some fields have errors, please correct and resubmit";
        return;
    }
    processing.value = true;
    const data = serializeData();
    if (props.method == "put") {
        data.append("--id", props.data['--id']);
    } else if (props.method == "post" && props.data['--parent']) {
        data.append("--parent", props.data['--parent']);
    }         

    return Client[props.method]("/data/" + props.model.name, data)
    .then(response => {
        if (props.method == "put") {
            response.data["--id"] = props.data["--id"];
        }
        return response;
    })
    .then(response => {
        if (response['--dispatchid']) {
            runDispatch(response['--dispatchid'], response);
        } else {
            trigger("form_saved", response, props.method, props.model);
        }
        return response;
    })
    .catch(err => {
        console.log(err);
        processing.value = false;
        if (err.status == 422) {
            global_error.value = "Some fields have errors, please correct and resubmit";
            setErrors(err.response.error);
        } else global_error.value = err.response.error;
    });
}


function runDispatch(id, oresponse) {
    const delay = 1000;
   
    function chkProgress() {
        Client.get("/dispatch/status/" + id)
        .then(response => {
            if (response.progress == "FAILED") {
                trigger("dispatch_failed", oresponse, props.method, props.model, response);
            } else if (response.progress == "PROCESSED" || !response.progress) {
                trigger("form_saved", oresponse, props.method, props.model, response)
            } else {
                status.value = response.progress;
                setTimeout(chkProgress, delay);
            }
        });
    }
    chkProgress();
}


</script>
