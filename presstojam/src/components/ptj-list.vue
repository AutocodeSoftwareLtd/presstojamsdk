<template>
  <div :class="Class.getClass('ptj-list') + ' ' + store.classes">
    <div v-for="(combinations, index) in getIndexCombinations" :key="index">
      <h3><span
              v-for="(tag, index) in combinations.tags"
              :key="index"
              >{{ tag }}&nbsp;</span></h3>
      <ul>
        <li v-for="ckey in combinations.data" :key="ckey">
          <a @click="next(store.data[ckey][store.primarykeyname])">
            <span
              v-for="field in store.fields"
              :key="field.name"
              v-show="field.on"
              >{{ store.data[ckey][field.name] }}&nbsp;</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Ctrl from "../js/controller.js";
import Class from "../js/classinjection.js";

export default defineComponent({
  name: "ptj-list",
  setup() {
    return { store: Ctrl.getStore(), Class };
  },
  methods: {
    next(key) {
      this.store.next(key);
      Ctrl.buildLink();
    },
    getCombinations(tag, data, combos) {
      const ncombos = [];
      if (combos.length == 0) {
          for(let d in data) {
            ncombos.push({ tags : { tag : data[d].display }, data : data[d].contains});
          }
      } else {
        for (let c of combos) {
          for(let d in data) {
            let tags = c.tags;
            tags[tag] = d.display;
            ncombos.push({ tags : tags, data : c.data.filter( value => data[d].contains.includes(value))});
          }
        }
      }
      return ncombos;
    }
  },
  computed: {
    getIndexCombinations() {
      let combos = [];
      for (let group in this.store.indexes) {
          combos = this.getCombinations(group, this.store.indexes[group], combos);
      }
      return combos;
    },
  },
});
</script>

