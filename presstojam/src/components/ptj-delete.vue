<template>
    <ptj-modal>
        <p>Are you sure you want to permanently delete this record? Type {{ check_str }} in the box below to continue.</p>
        <input type="text" :placeholder="check_str" @keyup="checkStatus">
        <button ref="delbutton" disabled="true" @click="submitForm">Delete</button>
    </ptj-modal>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import modelComposition from "./../js/modelcomposition.js"
import GCModal from "./ptj-modal.vue"

export default defineComponent({
    props : {
        check_str : String,
        ctrlid : Number
    },
    setup(props) {
        if (!props.check_str) props.check_str = "delete";   
        return modelComposition(props);
    },
    methods : {
        checkStatus() {
            if (this.$refs.check.value == this.check_str) {
                this.$refs.delbutton.disabled = false;
            } else {
                this.$refs.delbutton.disabled = true;
            }
        }
    },
    components : { 'ptj-modal' : GCModal }
})
</script>
