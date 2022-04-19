<template>
    <table :class="Class.getClass('ptj-table') + ' ' + store.classes">
    <thead>
        <tr :class="Class.getClass('ptj-table-header')">
        <th v-for="cell in store.fields" 
            v-show="cell.summary" 
            :key="cell.name" 
            :class="Class.getClass('ptj-table-header-cell') + ' ' + cell.name.replace('_', '-')"
            @click="orderBy(cell.name);"
        >{{ cell.label }}
            <span v-if="this.order.name == cell.name && this.order.dir == 'asc'" 
                class="material-icons" 
                >keyboard_arrow_up</span>
            <span v-if="this.order.name == cell.name && this.order.dir == 'desc'" 
                class="material-icons" 
                >keyboard_arrow_down</span>
        </th>
        <th v-if="sortable">&nbsp;</th>
        </tr>
    </thead>
    <tbody>
      <tr v-for="(obj, rindex) in store.data" :key="rindex" :class="Class.getClass('ptj-table-row') + ' ' + this.getRowClass(obj)" @click="next(obj.primary.toVal());">
        <td v-for="(field, name) in obj.cells" :key="name" v-show="field.meta.summary" :class="Class.getClass('ptj-table-cell') + ' ' + name.replace('_', '-')">
            <ptj-asset v-if="field.meta.type=='asset'" :field="field" />
          <ptj-number v-else-if="field.meta.type=='number'" :field="field" />
          <ptj-flag v-else-if="field.meta.type=='flag'" :field="field" />
          <ptj-id v-else-if="field.meta.type=='id'" :field="field"  />
          <ptj-time v-else-if="field.meta.type=='time'" :field="field" />
          <ptj-string v-else-if="field.meta.type=='string'" :field="field"  />
        </td>
        <td :class="Class.getClass('ptj-table-cell-sortable')" v-if="sortable">
            <a data-action="more" class="button" @click.prevent="toggle" draggable="true">
                <span class="material-icons">drag</span>
            </a>
        </td>
      </tr>
    </tbody>
    </table>
    <ptj-pagination v-if="store.data_template.limit > 0" />
</template>

<script>


import PtjPagination from "./ptj-pagination.vue"
import { defineComponent} from "vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"
import PtjNumber from "./ptj-number.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjId from "./ptj-id.vue"
import PtjTime from "./ptj-time.vue"
import PtjString from "./ptj-string.vue"
import PtjAsset from "./ptj-asset.vue"

export default defineComponent({
    name: 'ptj-table',
    setup() {
        console.log(Ctrl.getStore().fields);
        return { store : Ctrl.getStore(), Class, order : { name : '', dir : ''}}
    },
    methods : {
        next(key) {
            this.store.next(key);
            Ctrl.buildLink();
        },
        orderBy(name) {
            if (this.store.pages > 0) {
                this.order.dir = (!this.order.name != name || this.order.dir  == "desc") ? "asc" : "desc";
                this.order.name = name;
                let sort = [];
                sort[this.order.name] = this.order.dir;
                this.store.data_template.sort = sort;
                this.store.reload();
            } else {
                //custom sort on the table
                if (this.order.name != name || this.order.dir == "desc") {
                    this.store.data.sort(function(x, y) {
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
                    this.order.name = name;
                    this.order.dir = "asc";
                } else {
                    this.store.data.sort(function(x, y) {
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
                    this.order.name = name;
                    this.order.dir = "desc";
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
        "ptj-pagination" : PtjPagination,
        "ptj-string" : PtjString,
      "ptj-time" : PtjTime,
      "ptj-asset" : PtjAsset,
      "ptj-id" : PtjId,
      "ptj-flag" : PtjFlag,
      "ptj-number" : PtjNumber
    }

   
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.table, .thead, .tbody, .tr {
    width : 100%;
}


</style>