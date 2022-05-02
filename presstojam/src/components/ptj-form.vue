<template>
 <form @submit.prevent="submit" v-show="fstate==0" :class="Class.getClass('ptj-form') + ' ' + store.classes">
    <div :class="Class.getClass('ptj-form-error')" v-show="globalerror">{{ globalerror }}</div>
    <ptj-form-row v-for="field in data.cells" :key="field.meta.name" :field="field" :class="Class.getClass('ptj-form-group')">
          <ptj-asset v-if="field.meta.type=='asset'" :editable="true"  :field="field" />
          <ptj-number v-else-if="field.meta.type=='number'" :editable="true" :field="field"/>
          <ptj-flag v-else-if="field.meta.type=='flag'" :editable="true" :field="field" />
          <ptj-id v-else-if="field.meta.type=='id'" :editable="true" :field="field" />
          <ptj-time v-else-if="field.meta.type=='time'" :editable="true"  :field="field" />
          <ptj-string v-else-if="field.meta.type=='string'" :editable="true" :field="field" />
    </ptj-form-row>
    <input type="submit" value="Submit" :class="Class.getClass('ptj-form-submit')">
  </form>
  <ptj-progress-bar v-show="fstate == 1" :total="progress.total" :progress="progress.progress" />
</template>

<script setup>

defineProps({
    metarow : Object,
    map : Object
});


const progress = { total : 0, progress : 0};

const data = new DataRow();

let fstate = 0;

function clearErrors() {
    globalerror = "";
    for(let i in data.cells) {
        data.cells[i].error = 0;
    }
};


function load() {
    
}

function submit() {

    fstate = (progress.total > 0) ? 1 : 2;
    clearErrors();
    let key = 0;
    let data = data.serialize(props.map.state);
    return client[props.map.state](props.map.model, data)
    .then(request=>{
        if (request.__status!= "SUCCESS") {
            throw { message : request.statusText }
        }
        if (props.map.state == "post") {
            key = request.__key;
        }
    })
    .then(() => {
        let promises = [];
        let assets = data.getCellByType("asset");
        progress.total = 0;
        for(let i in assets) {
            const val = assets[i].toVal();
            if (!val) continue;
            ++progress.total;
            const asset = new Asset();
            asset.url = saveURL() + "-" + i;
            let promise = asset.saveFile(assets[i].toVal(), data.primary.toVal())
            .then(() => {
                ++progress.progress;
            });
            promises.push(promise);
        }
        return Promise.all(promises);
    })
    .then(() => {
        this.$root.$emit("redirect", props.metarow.redirect, key);
    })
    .catch(err => {
            //show error fields, mark fields as invalidated
        fstate = 0;
        if (typeof err == "string") {
            globalerror = err;
        } else {
            for(let i in err) {
                if (i.indexOf("__") === 0) continue;
                const cell = data.cells[i];
                if (cell) {
                    cell.error = Errors.getError(err[i]);
                }
            }
        }
    });
}

</script>

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
     
  },
  methods : {
    
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


