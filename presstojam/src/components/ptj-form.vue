<template>
 <form @submit.prevent="submit" v-show="fstate==0" :class="Class.getClass('ptj-form') + ' ' + store.classes">
    <div :class="Class.getClass('ptj-form-error')" v-show="globalerror">{{ globalerror }}</div>
    <div v-for="field in store.fields" v-show="field.on" :key="field.name" :class="Class.getClass('ptj-form-group')">
          <ptj-select v-if="field.type=='select'" :field="field" :stores="store" />
          <ptj-radio v-else-if="field.type=='radio'" :field="field" :stores="store" />
          <ptj-checkbox v-else-if="field.type=='checkbox'" :field="field" :stores="store" />
          <ptj-textarea v-else-if="field.type=='textarea'" :field="field" :stores="store" />
          <ptj-asset-field v-else-if="field.type=='asset'" :field="field" :stores="store" />
          <ptj-input v-else :field="field" :stores="store" />
          <div v-if="field.confirm">
            <ptj-confirm :field="field" :stores="store"/> 
          </div>
          <!-- REMOVED: -->
    </div>
    <input type="submit" value="Submit" :class="Class.getClass('ptj-form-submit')">

  </form>
  <ptj-progress-bar v-show="fstate == 1" :total="total" :progress="progress" />
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
import Client from "../js/client.js"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"

 
export default defineComponent({
  name: 'ptj-form',
  data() {
      return {
          fstate : 0,
          progress : 0,
          globalerror : ''
      }
  },
  setup() {
      return { store : Ctrl.getStore(), Class }
  },
  methods : {
    clearErrors() {
        this.globalerror = "";
        for(let i in this.store.fields) {
            this.store.fields[i].error = 0;
        }
    },
    saveAsset(field) {
        const val = this.store.data[field.name];
        if (!val) return Promise.resolve();
        asset.saveFile(val, this._key, () => ++this.progress);
        this.total += asset.num_chunks;
    },
    submit(e) {
        this.fstate = (this.total > 0) ? 1 : 2;
        this.clearErrors();
        let data = {};
        for(let i in this.store.fields) {
            if (this.store.fields[i].on) data[i] = this.store.fields[i].val;
        }
        this.store.addKeys(data);
        return Client[this.store.method](this.store.submiturl, data)
        .then(request=>{
            if (request.__status!= "SUCCESS") {
                throw { message : request.statusText }
            }
            this.store.resolveKeys(request);
        })
        .then(() => {
            let promises = [];
            for(let i in this.store.fields) {
                if (this.store.fields[i].type == "asset") {
                    let promise = this.store.fields[i].saveAsset(this.store.primarykey())
                    .then(() => {
                        ++this.progress;
                    })
                    .catch(err => {
                        this.fstate = 0;
                        this.progress = 0;
                        this.store.fields[i].error = err;
                    });
                    promises.push(promise);
                }
            }
            return Promise.all(promises);
        })
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
                    else if (this.store.fields[i]) {
                        this.store.fields[i].error = Errors.getError(err[i]);
                    }
                }
            }
        });
    }
  },
  computed : {
      total() {
          let total = 0;
          for(let i in this.store.fields) {
            if (this.store.fields[i].type == "asset") {
                ++total;
            }
          }
          return total;
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


