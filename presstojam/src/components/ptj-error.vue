<template>
    <p :class="Class.getClass('ptj-error')">{{ error }}</p>
</template>

<script>

import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"

export default defineComponent({
    name : 'ptj-error',
    props : {
        'error' : [Number, String]
    },
    setup() { 
        return { Class }
    }
});

</script>

<style>
.error {
  color : red;
}
</style>