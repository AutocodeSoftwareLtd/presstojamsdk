<template>
    <div class="ptj-filter">
        <Button 
            type="button"  
            :label="$t('models.' + model + '.fields.' + bind.cell.name + '.filterlabel')"
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
            :id="'overlay_' + bind.cell.name" 
            style="width: 450px" 
            :breakpoints="{'960px': '75vw'}">
            <div>
                <ptj-filter-field :field="bind.cell" v-model="val" />
            </div>
        </OverlayPanel>
    </div>
   </template>
   
   <script setup>
   
   import { ref, computed, inject} from "vue" 
   import Button from 'primevue/button'
   import OverlayPanel from 'primevue/overlaypanel'
   import PtjFilterField from "./filter-field.vue"
   
   const props = defineProps({
    bind : {
        type : Object,
        required : true
    }
   });

   const model = inject("model");
  
   let overlay = new ref();

  
   const val = computed({
        get() {
            return props.bind.value;
        },
        set(val) {
            let result = 0;
            if(Array.isArray(val)) {
                for(let vl of val) {
                    const res = props.bind.cell.validate(vl);
                    if (res) {
                        result = res;
                        break;
                    }
                }
            } else {
                result = props.bind.cell.validate(val);
            }
        }
    });


   function toggle(e) {
        overlay.value.toggle(e);
   }

   const badge = computed(() => {
        if (props.bind.value) {
            if (Array.isArray(props.bind.value)) return props.bind.value.length.toString();
            else return "1";
        } else {
            return "";
        }
   });

   
</script>

   