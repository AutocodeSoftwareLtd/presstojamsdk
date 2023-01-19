<template>
    <Button label="Export" icon="pi pi-external-link" class="p-button-help mr-2"  @click="exportCSV" />
</template>
<script setup>
import Button from "primevue/button"
import { useI18n } from 'vue-i18n';
import { getModel } from "../../js/models/modelstore.js"
import { getStore, createRepoStore } from "../../js/reactivestores.js"
import { inject } from "vue"
import { download } from "../../js/download.js"


const { t } = useI18n();
const client = inject("client");

const props = defineProps({
    name : String
});

const repo = getStore(props.name);
const store = repo.store;


const data = repo.data.value;
const cells = store.route.schema;
const settings = store.route.settings;


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
    if (settings.export_fields) {
        if (Array.isArray(settings.export_fields)) {
            for(const index in settings.export_fields){
                headers.push({ key : settings.export_fields[index], label :  t("models." + store.model +  ".fields." +settings.export_fields[index] + ".label") });
            }
        } else {
            for(const key in settings.export_fields){
                headers.push({ key : key, label :  settings.export_fields[key] });
            }
        }
    } else {
        for(const key in cells) {
            if (key == "--owner" || key == "--parent") continue;
            headers.push({ key : key, label : t("models." + store.model +  ".fields." + headers[key] + ".label") });
        }
    }

    let value = "";
    for(const x in headers) {
        value += headers[x].label;
        value += (x < headers.length - 1) ? "," : "\n";
    }


	if (repo.pagination.count) {
		//need to load all data
		let tstore = getModel(store.model);
		let temp_repo = createRepoStore(tstore);
        temp_repo.parent_id = store.parent_id;
		store.loadAll()
		.then(data => {
			value += buildData(data, headers);
			download(value, store.model + '.csv');
		})
		.catch(e => console.log(e));
	} else {
		value += buildData(data, headers);
		download(value, store.model + '.csv');
	}
}



</script>