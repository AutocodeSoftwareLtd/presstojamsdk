<template>

 <form v-show="processing == false" @submit.prevent="submit" novalidate>
    <Message severity="error" v-show="global_error">{{ global_error }}</Message>
    <div v-if="model.parent" class="row mt-3">
        <label class="control-label col-md-3">{{ $t("models." + store.parent + ".title")}}</label>
        <div class="col-md-9">
            <ptj-parent-select v-model="proxy_values['--parent']" :model="store.parent" :common_parent="common_parent" :common_parent_id="common_parent_id" />
        </div>
    </div>
    <ptj-edit-field v-for="cell in cells" :bind="bindGroup.getBind(cell.name)" :key="cell.name" :data="data"/>
    <div class="row">
        <div class="offset-3 col-9">
            <Button :label="$t('btns.save')" @click="submit" />
        </div>
    </div>
  </form>
  <Panel v-show="processing" Panel header="Processing">
        <p>Please do not refresh or close the browser until complete</p>
        <p>Status: {{ status }}</p>
        <p style="text-align:center;"><ProgressSpinner /></p>
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
import { FormModel } from "../../js/models/formmodel.js";


const Client = inject("client");

const props = defineProps({
    id : Number,
    entity_name : String,
    method : {
        type : String,
        default : 'post'
    }
});




const global_error = ref("");
const processing = ref(false);
const status = ref(0);


const model = new FormModel(props.entity_name, props.id);
provide("model", model);


if (props.method == 'put') model.setEditableCells();
else model.setCreateCells();

const cells = model.getEnabledCells();

const bindGroup = new BindGroup();

let data = {};
if (props.method == "put") {
    data = await model.load();
} else if (props.id) {
    data['--parent'] = props.id;
}

//if (model.parent) {
  //  bindGroup.addBind("--parent", new Bind(model.fields["--parent"], props.id));
//}


for(const field in cells) {
    const bind = new Bind(cells[field], data[field]);
    bindGroup.regBind(field, bind);
    if (cells[field].type == "json") {

        for(let ocell in cells[field].fields) {
            bindGroup.regBind(field + "-" + ocell, new Bind(cells[field].fields[ocell], (bind.value) ? bind.value[ocell] : null));
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
            else if (field.type != "asset" || props.method == 'post') {
                formData.append(i, bind.value);
            }
        }
    } 
    return formData;
}


function submitFiles() {
    const promises = [];
    for(const i in cells) {
        const bind = bindGroup.getBind(i);
        if (bind.is_dirty && bind.cell.type == "asset") {
            const formData = new FormData();
            formData.append(i, bind.value);
            promises.push(Client.post("/asset/" + model.name + "/" + bind.cell.name + "/" + props.id, formData));
        }
    }
    return promises; 
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
        data.append("--id", props.id);
    } else if (props.method == "post" && props.id) {
        data.append("--parent", props.id);
    }         

    //return;
    let promise;
    console.log("Total is", Array.from(data.keys()).length);
    if (props.method == "put" && Array.from(data.keys()).length == 1) {
        promise = Promise.resolve(true);
    } else {
        promise = Client[props.method]("/data/" + model.name, data);
    }
    return promise
    .then(response => {
        if (props.method == "put" && response.data) {
            response.data["--id"] = props.id;
        }
        return response;
    })
    .then(response => {
        if (props.method == "put") {
            Promise.resolve(submitFiles())
            .then(() => {
                return response;
            });
        } else {
            return response;
        }
    })
    .then(response => {
        if (response && response['--dispatchid']) {
            runDispatch(response['--dispatchid'], response);
        } else {
            trigger("form_saved", response, props.method, model);
        }
        processing.value = false;
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
                trigger("dispatch_failed", oresponse, props.method, model, response);
            } else if (response.progress == "PROCESSED" || !response.progress) {
                trigger("form_saved", oresponse, props.method, model, response)
            } else {
                status.value = response.progress;
                setTimeout(chkProgress, delay);
            }
        });
    }
    chkProgress();
}


</script>
