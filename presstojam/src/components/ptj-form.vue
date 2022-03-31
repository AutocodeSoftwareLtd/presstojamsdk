<template>
 <form @submit.prevent="submit" v-show="fstate==0" :class="Class.getClass('ptj-form') + ' ' + store.classes">
    <div :class="Class.getClass('ptj-form-error')" v-show="globalerror">{{ globalerror }}</div>
    <div v-for="field in store.data.cells" :key="field.meta.name" :class="Class.getClass('ptj-form-group')">
          <ptj-select v-if="field.meta.type=='select'" :field="field" :stores="store" />
          <ptj-radio v-else-if="field.meta.type=='radio'" :field="field" :stores="store" />
          <ptj-checkbox v-else-if="field.meta.type=='checkbox'" :field="field" :stores="store" />
          <ptj-textarea v-else-if="field.meta.type=='textarea'" :field="field" :stores="store" />
          <ptj-asset-field v-else-if="field.meta.type=='asset'" :field="field" :stores="store" />
          <ptj-input v-else :field="field" :stores="store" />
          <div v-if="field.meta.confirm">
            <ptj-confirm :field="field" :stores="store"/> 
          </div>
          <!-- REMOVED: -->
    </div>
    <input type="submit" value="Submit" :class="Class.getClass('ptj-form-submit')">

  </form>
  <ptj-progress-bar v-show="fstate == 1" :total="store.progress.total" :progress="store.progress.progress" />
</template>

<script>


import { defineComponent } from 'vue'
import GCInput from "./ptj-form-input.vue"
import GCConfirm from "./ptj-form-confirm.vue"
import GCSelect from "./ptj-form-select.vue"
import GCRadio from "./ptj-form-radio.vue"
import GCCheckbox from "./ptj-form-checkbox.vue"
import GCTextarea from "./ptj-form-textarea.vue"
import GCAssetField from "./ptj-form-asset.vue"
import GCProgressBar from "./ptj-progress-bar.vue"
import Errors from "../js/error.js"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"

 
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
      "ptj-input" : GCInput,
      "ptj-confirm" : GCConfirm,
      "ptj-select" : GCSelect,
      "ptj-radio" : GCRadio,
      "ptj-checkbox" : GCCheckbox,
      "ptj-textarea": GCTextarea,
      "ptj-asset-field" : GCAssetField,
      "ptj-progress-bar" : GCProgressBar
    }
       
  
});
</script>


