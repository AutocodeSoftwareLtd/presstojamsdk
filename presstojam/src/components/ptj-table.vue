<template>
    <table class="ptj-table" :class="map.model">
    <thead>
        <tr class="ptj-table-header">
        <th v-for="cell in meta.cells" 
            v-show="cell.summary" 
            :key="cell.name" 
            class="ptj-table-header-cell"
            :class="cell.name"
            @click="orderBy(cell.name);"
        >{{ cell.label }}
            <span v-if="order.name == cell.name && order.dir == 'asc'" 
                class="material-icons" 
                >keyboard_arrow_up</span>
            <span v-if="order.name == cell.name && order.dir == 'desc'" 
                class="material-icons" 
                >keyboard_arrow_down</span>
        </th>
        <th class="ptj-actions">&nbsp;</th>
        </tr>
    </thead>
    <tbody>
      <tr v-for="(obj, rindex) in data" :key="rindex" class="ptj-table-row">
        <td v-for="(field, name) in obj.cells" :key="name" v-show="field.summary" class="ptj-table-cell" :class="field.meta.name">
          <ptj-asset v-if="field.type=='asset'" :field="field" />
          <ptj-number v-else-if="field.type=='number'" :field="field" />
          <ptj-flag v-else-if="field.type=='flag'" :field="field" />
          <ptj-id v-else-if="field.type=='id'" :field="field"  />
          <ptj-time v-else-if="field.type=='time'" :field="field" />
          <ptj-string v-else-if="field.type=='string'" :field="field"  />
        </td>
        <td class="ptj-actions" >
            <ptj-button :route="{state:'primary', key:obj.primary.toVal()}"><span class="material-icons">arrow_forward_ios</span></ptj-button>
        </td>
      </tr>
    </tbody>
    </table>
</template>

<script setup>

import PtjNumber from "./ptj-number.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjId from "./ptj-id.vue"
import PtjTime from "./ptj-time.vue"
import PtjString from "./ptj-string.vue"
import PtjAsset from "./ptj-asset.vue"
import PtjButton from "./ptj-button.vue"
import { reactive, ref, inject } from "vue"
import { DataRow } from "./../js/datarow.js"
import client from "./../js/client.js"


const map = inject("map");
const meta = inject("meta");
const data = inject("data");


let order = reactive( { name : '', dir : ''});

function orderBy(name) {
    if (meta.pages > 0) {
        order.dir = (!order.name != name || order.dir  == "desc") ? "asc" : "desc";
        order.name = name;
        let sort = [];
        sort[order.name] = order.dir;
        meta.sort = sort;
        load();
    } else {
        //custom sort on the table
        if (order.name != name || order.dir == "desc") {
            data.value.sort(function(x, y) {
                let xval = x.getCell(name).toVal();
                let yval = y.getCell(name).toVal();
                if (xval < yval) {
                    return -1;
                } else if (xval > yval) {
                    return 1;
                } else {
                    return 0;
                }
            });
            order.name = name;
            order.dir = "asc";
        } else {
            data.value.sort(function(x, y) {
                let xval = x.getCell(name).toVal();
                let yval = y.getCell(name).toVal();
                if (xval < yval) {
                    return 1;
                } else if (xval > yval) {
                    return -1;
                } else {
                    return 0;
                }
            });
            order.name = name;
            order.dir = "desc";
        }
    }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.table, .thead, .tbody, .tr {
    width : 100%;
}


</style>