<template>
    <div v-for="(combinations, index) in getIndexCombinations" :key="index">
     <h3><span
        v-for="(tag, index) in combinations.tags"
        :key="index"
        >{{ tag }}&nbsp;</span></h3>
    <ul>
       <li v-for="ckey in combinations.data" :key="ckey">
         <ptj-button :route="route">
          {{  data[ckey].getSummary() }}
         </ptj-button>
       </li>
    </ul>
  </div>
</template>

<script setup>

import { computed, inject } from "vue"
import PtjButton from "./ptj-button.vue"
inject("data");
inject("indexes");

function getCombinations(tag, data, combos) {
    const ncombos = [];
    if (combos.length == 0) {
        for(let d in data) {
        ncombos.push({ tags : [ data[d].display ], data : data[d].contains});
        }
    } else {
        for (let c of combos) {
          for(let d in data) {
            let tags = c.tags;
            tags.push(d.display);
            ncombos.push({ tags : tags, data : c.data.filter( value => data[d].contains.includes(value))});
          }
        }
    }
    return ncombos;
}

const getIndexCombinations = computed(() => { 
    let combos = [];
    for (let group in indexes) {
        combos = this.getCombinations(group, indexes[group], combos);
    }
    return combos;
});
</script>

