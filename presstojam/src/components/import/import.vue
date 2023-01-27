<template>
    <div v-if="is_passed == false">
    <h3>Column Headers</h3>
    <table>
        <tr v-for="(header, key) in headers">
            <td>{{ (key + 1) }}.</td>
            <td>
                <div class="p-inputgroup">
                <input type="text" v-model="headers[key]" class="form-control">
                <span class="p-inputgroup-addon">
                <i class="pi pi-refresh" @click="refreshHeader(key, headers)" style="cursor:pointer;"></i>
                </span>
                </div>
            </td>
        </tr>
    </table>
    <div>
        <FileUpload name="file" mode="basic" :customUpload="true" @uploader="importCSV" :auto="true"  />
    </div>
    </div>
    <div v-else>
        <h3>Results</h3>
        <p>Passed: {{success}}</p>
        <p>Failed: {{failed}}</p>
    </div> 
</template>
<script setup>
import { ref, inject } from "vue"
import FileUpload from 'primevue/FileUpload'

const props = defineProps({
    name : String,
    repo : Object
});

const store = props.repo.store;

const client = inject("client");

const is_passed = ref(false);
const success = ref(0);
const failed = ref(0);


let headers = [];
const oheaders = [];
for(let i in store.fields) {
    if (!store.fields[i].system) {
        headers.push(i);
        oheaders.push(i);
    }
}



function importCSV( evt ){
    const formData = new FormData();
    for(const key in oheaders) {
        formData.append("headers[" + oheaders[key] + "]", headers[key]);
    }
    formData.append("upload-csv", evt.files[0]);
    return client.post("/bulk/" + props.name, formData)
    .then(response => {
        is_passed.value = true;
        success.value = response.success;
        failed.value = response.failure;
    });
}


function refreshHeader(key, headers) {
    headers[key] = oheaders[key];
}


</script>