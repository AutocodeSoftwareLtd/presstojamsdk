import { useI18n } from '../i18n.js';
import { download } from "./download.js"
import { getClient } from "./../client.js"





function buildData(data, headers) {
	let value = "";
	for(const rowObj of data){
        for(const x in headers) {
            const header = headers[x].key;
            let new_val = rowObj[header];
            if (new_val) new_val = new_val.toString().replace(/\,/g,'');
            value += new_val;
            //add value to build an array.
            value += (x < headers.length - 1) ? "," : "\n";
        }
    }
	return value;
}


export function exportCSV(repo) {

    const store = repo.store;

    const cells = store.fields;

    const i18n = useI18n();
    const t = i18n.global.t

    const client = getClient();


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
            headers.push({ key : key, label : t("models." + store.name +  ".fields." + key + ".label") });
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
