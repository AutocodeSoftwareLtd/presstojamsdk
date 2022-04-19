<template>
 <form @submit.prevent="submit" v-show="fstate==0" :class="Class.getClass('ptj-form') + ' ' + store.classes">
    <div :class="Class.getClass('ptj-form-error')" v-show="globalerror">{{ globalerror }}</div>
    <ptj-form-row v-for="field in store.data.cells" :key="field.meta.name" :field="field" :class="Class.getClass('ptj-form-group')">
          <ptj-asset v-if="field.meta.type=='asset'" :editable="true"  :field="field" />
          <ptj-number v-else-if="field.meta.type=='number'" :editable="true" :field="field"/>
          <ptj-flag v-else-if="field.meta.type=='flag'" :editable="true" :field="field" />
          <ptj-id v-else-if="field.meta.type=='id'" :editable="true" :field="field" />
          <ptj-time v-else-if="field.meta.type=='time'" :editable="true"  :field="field" />
          <ptj-string v-else-if="field.meta.type=='string'" :editable="true" :field="field" />
    </ptj-form-row>
    <input type="submit" value="Submit" :class="Class.getClass('ptj-form-submit')">
  </form>
  <ptj-progress-bar v-show="fstate == 1" :total="store.progress.total" :progress="store.progress.progress" />
</template>

<script>


import { defineComponent } from 'vue'
import PtjProgressBar from "./ptj-progress-bar.vue"
import Errors from "../js/error.js"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"
import PtjFormRow from "./ptj-form-row.vue"
import PtjNumber from "./ptj-number.vue"
import PtjFlag from "./ptj-flag.vue"
import PtjId from "./ptj-id.vue"
import PtjTime from "./ptj-time.vue"
import PtjString from "./ptj-string.vue"
import PtjAsset from "./ptj-asset.vue"
 
export default defineComponent({
  name: 'ptj-form',
  data() {
      return {
          fstate : 0,
          globalerror : ''
      }
  },
  setup() {
      return { store : Ctrl.getStore(), Class }
  },
  methods : {
    clearErrors() {
        this.globalerror = "";
        for(let i in this.store.data.cells) {
            this.store.data.cells[i].error = 0;
        }
    },
    submit() {
        this.fstate = (this.total > 0) ? 1 : 2;
        this.clearErrors();
        return this.store.submit()
        .then(() => {
            this.store.next();
            Ctrl.buildLink();
        })
        .catch(err => {
            //show error fields, mark fields as invalidated
            this.fstate = 0;
            console.log(err);
            if (typeof err == "string") {
                this.globalerror = err;
            } else {
                for(let i in err) {
                    if (i.indexOf("__") === 0) continue;
                    const cell = this.store.data.cells[i];
                    if (cell) {
                        cell.error = Errors.getError(err[i]);
                    }
                }
            }
        });
    }
  },
  components : 
    {
      "ptj-string" : PtjString,
      "ptj-time" : PtjTime,
      "ptj-asset" : PtjAsset,
      "ptj-id" : PtjId,
      "ptj-progress-bar" : PtjProgressBar,
      "ptj-form-row" : PtjFormRow,
      "ptj-flag" : PtjFlag,
      "ptj-number" : PtjNumber
    }
       
  
});
</script>


