<template>
    <Button label="Export" icon="pi pi-external-link" class="p-button-help mr-2"  @click="exportCSV" />
</template>
<script setup>
import Button from "primevue/button"
import { useI18n } from 'vue-i18n';
import { getModel } from "../../js/models/modelmanager.js"
import { getStore, createRepoStore } from "../../js/data/storemanager.js"
import { inject } from "vue"
import { download } from "../../js/download.js"


const { t } = useI18n();
const client = inject("client");

const props = defineProps({
    name : String
});

const repo = getStore(props.name);
const store = repo.store;

const cells = store.fields;


function buildData(data, headers) {
	let value = "";
	for(const rowObj of data){
        for(const x in headers) {
            const header = headers[x].key;
            value += rowObj[header];
            //add value to build an array.
            value += (x < headers.length - 1) ? "," : "\n";
        }
    }
	return value;
}


function exportCSV() {


    const headers = [];
    if (store.export_fields) {
        if (Array.isArray(store.export_fields)) {
            for(const index in store.export_fields){
                headers.push({ key : store.export_fields[index], label :  t("models." + store.name +  ".fields." +store.export_fields[index] + ".label") });
            }
        } else {
            for(const key in store.export_fields){
                headers.push({ key : key, label :  store.export_fields[key] });
            }
        }
    } else {
        for(const key in cells) {
            if (key == "--owner" || key == "--parent") continue;
            headers.push({ key : key, label : t("models." + store.name +  ".fields." + headers[key] + ".label") });
        }
    }

    let value = "";
    for(const x in headers) {
        value += headers[x].label;
        value += (x < headers.length - 1) ? "," : "\n";
    }


	if (repo.pagination.count) {
		//need to load all data
		repo.loadAll()
		.then(data => {
			value += buildData(data, headers);
			download(value, store.name + '.csv');
		})
		.catch(e => console.log(e));
	} else {
        repo.load()
        .then(data => {
            value += buildData(data, headers);
            download(value, store.name + '.csv');
        });
		
		
	}
}



</script>