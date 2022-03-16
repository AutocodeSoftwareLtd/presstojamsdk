<template>
  <ul>
        <li v-for="obj in arr" v-bind:key="obj.id">
            <span v-for="(property, index) in obj" v-bind:key="index">{{ property }}</span>
        </li>
    </ul>
</template>

<script>
import { defineComponent} from "vue"
export default defineComponent({
  name: 'ptj-list',
  props: {
    arr : {
        type : Array
    }
  },
  components : {}
   
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>