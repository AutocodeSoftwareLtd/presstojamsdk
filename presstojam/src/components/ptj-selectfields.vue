<template>
    <div v-for="field, name in RepoStore.meta.cells" :key="name"> 
        <input 
                type="checkbox" 
                v-model="field.summary" 
                :true-value="1" :false-value="0"
                class="ptj-selectfields-checkbox"> 
        <label class="ptj-selectfields-label">{{ getDictionary('label', {'field' :  field.name, model : field.model, default : field.name })  }}</label>
    </div>
</template>

<script setup>
import { RepoStore } from "./../js/repo.js"
import { getDictionary } from "./../js/dictionary.js"
import { Map } from "./../js/map.js"




</script>

