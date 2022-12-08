<template>
    <div v-if="parsed==false">
    <table>
        <tr v-for="(header, key) in headers">
            <td>key</td>
            <td><input type="text" v-bind="header"></td>
        </tr>
    </table>
    <div>
        <label>Upload File</label>
        <input type="file" />
    </div>
    </div>
    <table v-if="parsed" style="width: 100%;">
    <thead>
        <tr>
            <th v-for="(header, key) in content.meta.fields"
                v-bind:key="'header-'+key">
                {{ header }}
            </th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(row, rowKey) in content.data"
            v-bind:key="'row-'+rowKey">
                <td v-for="(column, columnKey) in content.meta.fields"
                    v-bind:key="'row-'+rowKey+'-column-'+columnKey">
                        <input v-model="content.data[rowKey][column]"/>
                </td>
        </tr>
    </tbody>
</table>
</template>
<script setup>
import { ref } from "vue"
import Papa from 'papaparse';

const props = defineProps({
    name : String
});

const repo = getStore(props.name);
const store = repo.store;

let parsed = ref(false);
let content = ref();

let headers = [];
for(let i in store.route.schema) {
    headers.push(i);
}



function parseFile(file){
    Papa.parse( file, {
        header: true,
        skipEmptyLines: true,
        complete: function( results ){
            content.value = results;
            parsed.value = true;
        }.bind(this)
    } );
}


function handleFileUpload( event ){
    parseFile(event.target.files[0]);
}


function getCsvHeaders() {
    const positions = {};

    for(let col in cols) {
        for(let ans of headers) {
            if (ans.value == cols[col]) {
                positions[ans] = col;
            }
        }
    }
    return positions;
}


function nextRow(row) {
    let obj = {};
    for(let i in positions) {
        obj[i] = row[positions[i]];
    }
    return obj;
}


</script>