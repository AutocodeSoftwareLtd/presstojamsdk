<template>
    <ptj-widget title="select fields" class="ptj-selectfields">
        <div v-for="field, name in RepoStore.meta.cells" :key="name"> 
            <input 
                type="checkbox" 
                v-model="field.summary" 
                :true-value="1" :false-value="0"
                class="ptj-selectfields-checkbox"> 
            <label class="ptj-selectfields-label">{{ getFieldDictionary(field.name, 'label', field.name) }}</label>
        </div>
    </ptj-widget>
</template>

<script setup>
import PtjWidget from "./ptj-widget.vue"
import { inject } from "vue"
import { RepoStore } from "../js/repo.js"
import { getFieldDictionary } from "../js/dictionary.js"

</script>

