<template>
    <ptj-widget title="select fields" class="ptj-selectfields">
        <div v-for="field, name in meta.cells" :key="name"> 
            <input 
                type="checkbox" 
                v-model="field.summary" 
                :true-value="1" :false-value="0"
                class="ptj-selectfields-checkbox"> 
            <label class="ptj-selectfields-label">{{ field.name }}</label>
        </div>
    </ptj-widget>
</template>

<script setup>
import PtjWidget from "./ptj-widget.vue"
import { inject } from "vue"

const meta = inject("meta");
</script>

