<template>
    <div :class="[map.model, map.state]">
        <ptj-button v-if="actions.back" :route="actions.back"><span class="material-icons">back</span></ptj-button>
        <h1>{{ title }}</h1>
        <ptj-button v-for="action in actions.sibling" :key="action" :route="action">{{ action.n}}</ptj-button>
        <component v-if="component" :is="component" />
        <ptj-button v-for="action in actions.children" :key="action" :route="action">
            {{ action.n }}
        </ptj-button>
    </div>
</template>

<script setup>


import client from "./../js/client.js"
import { MetaRow } from "./../js/metarow.js"
import Settings from "./../js/settings.js"
import ModuleLoader from "./../js/moduleloader.js"
import { ref, computed, defineAsyncComponent, reactive, provide } from "vue"
import PtjButton from "./ptj-button.vue"

const props = defineProps({
    "map" : Object,
});

const settings = Settings.getModelSettings(props.map.model, props.map.state);
let title = ref('');
let component_name = ref('');
let component = computed(() => {
    if (component_name.value) {
        return defineAsyncComponent(() => ModuleLoader.loadModule(component_name.value));
    } else {
        return null;
    }
});
let actions = reactive({ back : null, sibling : [], children : []});

const meta_row = reactive(new MetaRow());
if (settings.fields) meta_row.limited_fields = settings.fields;

provide("map", props.map);
provide("meta", meta_row);



function importCSV(file) {
        return new Promise((resolve, reject) => {
            var fr = new FileReader();  
            fr.onload = () => {
                resolve(fr.result )
            };
            fr.onerror = reject;
            fr.readAsText(file.blob);
        })
        .then(data => {
            const headers = {};
            for(let i in data[0]) {
                headers[data[0][i]] = i;
            }

            for(let i = 1; i<data.length; ++i) {
                //run row based on the headers
            }
        });
    }




function setReferences() {
        let promises = [];

        const cells = this._meta_row.getCellByType("id");
        for(let name in cells) {
            if (cells[name].reference || cells[name].circular) {
                let params = {};
                if (this._global_meta_row.parent) params[this._global_meta_row.parent.name] = this._global_data.parent.toVal();
                promises.push(cells[name].setReferenceOptions("/" + props.map.model + "-" + name.replace("_", "-") + "-reference", params));
            } 
        }
        return Promise.all(promises);
    }


const init = async() => {
    let url = (!props.map.model) ? "/route-core-default" : "/route-" + props.map.model;
    let method = "get";
    if (props.map.state == "primary" || props.map.state == "parent" ) {
        url += "-" + props.map.state;
    } else if (props.map.state == "login") {
        url += "-" + login;
        method = "post";
    } else if (props.map.state == "put" || props.map.state == "post") {
        method = props.map.state;
    }
   
    let data = {};
    if (props.map.to) data.__to = props.map.to;
    if (settings.fields) data.__fields = settings.fields;
        
    client[method](url, data)
    .then(response => {
        if (response.__status != "SUCCESS") {
            throw new Error(response);
        }
        return response;
    })
    .then(response => {   

        let data = {};
        let recursive = false;

        title.value = response.title;
        
        data.back = response.back;

        props.map.model = response.model;
        props.map.state = response.state;

        const child_state = (props.map.key) ? "parent" : "get";
        for(let i in response.children) {
            let route = {
                n : response.children[i],
                model : i,
                state : child_state,
            }
            actions.children.push(route);
        }

        for(let i in response.actions) {
            let route = { n : response.actions[i], state : i };
            actions.sibling.push(route);
        }

        if (response.back) {
            actions.back = response.back;
        }

        if (settings.hide_actions) {
            if (settings.hide_actions.children) actions.children = [];
            if (settings.hide_actions.sibling) actions.sibling = [];
            if (settings.hide_actions.parent) actions.back = null;
        }
       
        meta_row.map(response.fields);

        if (settings.fields) {
            meta_row.resetSummary(settings.fields);
        }


        meta_row.applySettings(settings);
        meta_row.applyMap(props.map);
        
    

        if (response.state == "get" || response.state == "parent") {
            component_name.value = "ptj-repo";
        } else if (response.state == "primary") {
            component_name.value = "ptj-primary";
        } else if (response.state == "post") {
            component_name.value = (actions.sibling.login) ? "ptj-account-handler" : "ptj-form";
        } else if (response.state == "put") {
            component_name.value = "ptj-form";
        } else if (response.state == "login") {
            component_name.value = "ptj-account-handler";
        }


//not sure about this
    })
    .catch(e => console.log(e));
}

init();

</script>