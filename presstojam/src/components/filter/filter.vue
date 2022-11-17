<template>
    <div class="ptj-filter">
        <Button 
            type="button"  
            :label="$t('models.' + field.model + '.fields.' + field.name + '.filterlabel')"
            @click="toggle" 
            aria-haspopup="true" 
            aria-controls="overlay"
            :badge="badge"
            class="p-button-secondary"
        />
        <OverlayPanel 
            ref="overlay" 
            appendTo="body" 
            :showCloseIcon="true" 
            :id="'overlay_' + field.name" 
            style="width: 450px" 
            :breakpoints="{'960px': '75vw'}">
            <div>
                <ptj-filter-field :field="field" v-model="val" />
            </div>
        </OverlayPanel>
    </div>
   </template>
   
   <script setup>
   
   import { inject, ref, computed, reactive} from "vue" 
   import Button from 'primevue/button'
   import OverlayPanel from 'primevue/overlaypanel'
   import { getStoreById } from "../../js/datastore.js"
   import PtjFilterField from "./filter-field.vue"
   
   const props = defineProps({
    field : {
        type : Object,
        required : true
    }
   });

   let overlay = new ref();

   const model = inject("model");
   const store = getStoreById(model);

   const errors = reactive({});

   const val = computed({
        get() {
            return store.filters[props.field.name];
        },
        set(val) {
            let result = 0;
            if(Array.isArray(val)) {
                for(let vl of val) {
                    const res = props.field.validate(vl);
                    if (res) {
                        result = res;
                        break;
                    }
                }
            } else {
                result = props.field.validate(val);
            }
        
            if (result) {
                errors[props.field.name] = result;
            }
            store.filters[props.field.name] = val;
        }
    });


   function toggle(e) {
        overlay.value.toggle(e);
   }

   const badge = computed(() => {
        if (store.filters[props.field.name]) {
            if (Array.isArray(store.filters[props.field.name])) return store.filters[props.field.name].length.toString();
            else return "1";
        } else {
            return "";
        }
   });

   
</script>

   