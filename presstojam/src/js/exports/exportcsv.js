import { useI18n } from '../i18n.js';
import { download } from "./download.js"
import { Model } from "./../models/model.js"





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


export function exportCSV(name, parent_id) {

    const store = new Model(name);
    store.limit = 0;
    const cells = store.fields;

    const i18n = useI18n();
    const t = i18n.global.t

    const headers = [];
    console.log("Being called");
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

    console.log("Headers are now", headers);

    let value = "";
    for(const x in headers) {
        value += headers[x].label;
        value += (x < headers.length - 1) ? "," : "\n";
    }

    const filters = {};
    if (parent_id) filters["--parent"] = parent_id;
	store.load(filters)
    .then(data => {
        value += buildData(data, headers);
        download(value, store.name + '.csv');
    });
}
