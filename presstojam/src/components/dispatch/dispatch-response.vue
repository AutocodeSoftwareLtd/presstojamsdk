<template>
    <p>Operation in action, please do not refresh or close the browser until complete</p>
    <p>Status: {{ status }}</p>
    <p style='text-align:center'><ProgressSpinner /></p>
    <p>&nbsp;</p>
</template>
<script setup>
import { ref, } from "vue"
import ProgressSpinner from 'primevue/progressspinner'
import { inject } from "vue"

const client = inject("client");


const props = defineProps({
    id : Number,
    dialog : Object
});


const emits = defineEmits(['complete','failed']);
const delay = 1000;
const status = ref('');


function chkProgress() {
    client.get("/dispatch/status/" + props.id)
    .then(response => {
        if (response.progress == "FAILED") {
            emits('failed', response);
        } else if (response.progress == "PROCESSED" || !response.progress) {
            emits('complete');
        } else {
            status.value = response.progress;
            setTimeout(chkProgress, delay, );
        }
    });
}

chkProgress();

</script>