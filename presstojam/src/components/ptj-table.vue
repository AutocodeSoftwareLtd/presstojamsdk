<template>
    <table :class="Class.getClass('ptj-table') + ' ' + store.classes">
    <thead>
        <tr :class="Class.getClass('ptj-table-header')">
        <th v-for="(cell, index) in store.fields" :key="cell.name" :class="Class.getClass('ptj-table-header-cell') + ' ' + cell.name.replace('_', '-')" v-show="store.fields[index].on">{{ cell.label }}
            <span v-if="sortable == false" class="material-icons" @click="orderBy(cell, false);">keyboard_arrow_up</span>
            <span v-if="sortable == false" class="material-icons" @click="orderBy(cell, true);">keyboard_arrow_down</span>
        </th>
        <th v-if="sortable">&nbsp;</th>
        </tr>
    </thead>
    <tbody>
      <tr v-for="(obj, rindex) in store.data" :key="rindex" :class="Class.getClass('ptj-table-row') + ' ' + this.getRowClass(obj)" @click="next(obj[store.primarykeyname]);">
        <td v-for="(field, index) in store.fields" :key="index" :class="Class.getClass('ptj-table-cell') + ' ' + field.name.replace('_', '-')" v-show="store.fields[index].on">{{ obj[field.name].display }}</td>
        <td :class="Class.getClass('ptj-table-cell-sortable')" v-if="sortable">
            <a data-action="more" class="button" @click.prevent="toggle" draggable="true">
                <span class="material-icons">drag</span>
            </a>
        </td>
      </tr>
    </tbody>
    </table>
    <ptj-pagination v-if="overlimit" />
</template>

<script>


import GCPagination from "./ptj-pagination.vue"
import { defineComponent} from "vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"

export default defineComponent({
    name: 'ptj-table',
    setup() {
        return { store : Ctrl.getStore(), Class}
    },
    methods : {
        next(key) {
            this.store.next(key);
            Ctrl.buildLink();
        },
        orderBy(cell, dir) {
            let order = {};
            order[cell.name] = dir;
            this.store.orderby = order;
            if (this.store.pages > 0) {
                this.store.load();
            } else {
                //custom sort on the table
                if (dir) {
                    this.store.data.sort(function(x, y) {
                        let xval = x[cell.name];
                        let yval = y[cell.name];
                        if (xval < yval) {
                            return -1;
                        } else if (xval > yval) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                } else {
                    this.store.data.sort(function(x, y) {
                        let xval = x[cell.name];
                        let yval = y[cell.name];
                        if (xval < yval) {
                            return 1;
                        } else if (xval > yval) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                }
            }
        },
        getRowClass(obj) {
            let str = [];
            for(let name of this.store.groups) {
                str.push(this.store.model + "-" + name.replace("_", "-") + "-" + obj[name]);
            }
            return str.join(" ");
        }
    },
    computed : {
        sortable() {
            return (this.store.sort) ? true : false;
        },
        overlimit() {
            return false;
        },
        rowclass() {

        }
    },
    components : {
        "ptj-pagination" : GCPagination,
    }

   
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.table, .thead, .tbody, .tr {
    width : 100%;
}


</style>