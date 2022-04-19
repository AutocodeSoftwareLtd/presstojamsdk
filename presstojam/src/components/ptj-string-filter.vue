<template>
   <select v-if="tag=='select'" 
        :class="Class.getClass('ptj-form-select')" 
        v-model="field.val"
        :name="field.meta.name"
        v-bind="atts"
         @blur="field.validateon = true"
         multiple="true"
        >
        <option value="0" selected disabled>Select Option</option>
        <option v-for="option in options" :key="option.key" :value="option.key">{{ option.value }}</option>
  </select>
  <input v-else v-bind="atts"
        :class="Class.getClass('ptj-form-number')" 
        :name="field.meta.name"
        v-model="field.val" 
        @blur="field.validateon = true" :readonly="field.meta.readonly" />
</template>

<script>
import { defineComponent } from 'vue'
import Class from "../js/classinjection.js"


export default defineComponent({
  name: 'ptj-string-filter',
  props : {
    field : Object,
  },
  setup() {
       return { Class };
  },
  methods : {
    isEnum(contains) {
        if (!contains) return null;
        let enums=[];
        const regEx = new RegExp(/^[a-zA-Z]+[a-zA-Z0-9._]+$/);
        const exps = contains.split("|");
        for(let exp of exps) {
            if (!exp) continue;
            if (regEx.test(exp)) {
                enums.push(exp);
            } else {
                return null;
            }
        }
        return enums;
    }
  },
  computed : {
      tag() {
          if (this.isEnum(this.field.meta.validator.contains)) {
              return "select";
          } else if (this.field.meta.html || this.field.meta.max > 150) {
              return "textarea";
          } else {
              return "input";
          }
      },
      options() {
          const exps = this.field.meta.validator.contains.split("|");
          let options = [];
          for(let exp of exps) {
              options.push({ key : exp, value : exp});
          }
          return options;
      },
      atts() {
          let atts = {};
          if (this.field.meta.encrypted) {
              atts.type = "hidden";
          }

          if (this.field.meta.readonly) {
              atts.readonly = true;
          }

          if (this.field.meta.placeholder) {
              atts.placeholder = field.meta.placeholder;
          }

          if (this.field.meta.html) {
              atts["data-html"] = 1;
          }
          return atts;
      }
  }
});
</script>
