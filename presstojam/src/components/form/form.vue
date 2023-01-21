<template>

 <form @submit.prevent="submit" class="card needs-validation" novalidate>
    <Message severity="error" v-show="global_error">{{ global_error }}</Message>
    <div v-if="parent" class="form-group">
        <label>{{ $t("models." + store.parent + ".title")}}</label>
        <ptj-parent-select v-model="proxy_values['--parent']" :model="store.parent" :common_parent="common_parent" :common_parent_id="common_parent_id" />
    </div>
    <ptj-edit-field :bind="bindGroup.getBind(cell.name)" v-for="cell in cells" :key="cell.name"/>
    <Button :label="$t('btns.save')" @click="submit" />
  </form>
  <Dialog v-model:visible="dispatch" :modal="true" class="p-fluid" >
    <ptj-dispatch v-if="dispatchid != 0" @complete="dispatchComplete" @failed="dispatchFailed" :id="dispatchid" />
  </Dialog>
</template>

<script setup>

import { provide, ref, computed, inject } from "vue" 
import PtjEditField from "./edit-field.vue"
import Button from 'primevue/button'

import Message from 'primevue/message';
import PtjParentSelect from "./parent-select.vue"
import { BindGroup } from "../../js/binds/bindgroup.js"
import { Bind } from "../../js/binds/bind.js"
import PtjDispatch from "../dispatch/dispatch-response.vue"
import Dialog from 'primevue/dialog'
import { trigger } from "../../js/bus/bus.js"

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
const dispatch = ref(false);
const dispatchid=ref(0);

provide("model", props.model.name);


if (props.stype == 'put') props.model.setEditableCells();
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
    if (typeof err.error == "string") {
        global_error.value = err.error;
    } else {
        for(let i in err.response) {
            if (bindGroup.binds[i]) bindGroup.binds[i].setError(err[i]);
        }
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

    bindGroup.setActiveValidation(true);
    if (bindGroup.hasErrors()) return;

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
            dispatchid.value = response['--dispatchid'];
            dispatch.value = true;
        } else {
            if (props.method == "put") {
                trigger("form_edited", response);
            } else {
                trigger("form_created", response);
            }
        }
        return response;
    })
    .catch(err => {
        if (err.status == 402) setErrors(err.response);
        else console.log(err);
    });
    
}

function dispatchFailed(response) {
    setErrors(err.response);
    dispatch.value = false;
    trigger("dispatch_failed", response, props.model, props.method);
}

function dispatchComplete(response) {
    dispatch.value = false;
    saved.value = true;
    if (props.method == "put") {
        trigger("form_edited", response);
    } else {
        trigger("form_created", response);
    }
}




</script>
