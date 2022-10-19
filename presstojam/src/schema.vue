<template>
    <Splitter style="height: 300px">
      <SplitterPanel>
      <ul class="schema-nav">
        <li v-for="(schema, table) in data" :key="table">
          <a @click="selectTable(table, schema.schema)">{{ table }}</a>
        </li>
      </ul>
    </SplitterPanel>
    <SplitterPanel>
      <tables v-if="table" :table="table" :schema="schema"/>
    </SplitterPanel>
    </Splitter>
  </template>
  <script setup>
  import { ref, inject } from 'vue'
  import Splitter from 'primevue/splitter';
  import SplitterPanel from 'primevue/splitterpanel';
  
  
  const client = inject("client");
  
  let data = ref({});
  const table = ref('');
  const schema = ref({});
  
  function selectTable(table_name, schema_obj) {
    table.value = table_name;
    schema.value = schema_obj;
  }
  
  
  
  client.get("/user/site-map")
  .then(response => {
    data.value = response;
  
    for(let i in data.value) {
      selectTable(i, data.value[i].schema);
      break;
    }
  });
  
  
  
  </script>
  
  
  
  <style scoped>
  div{
    font-family : arial;
    font-size : 12px;
  }
  
  .schema-nav{
      list-style : none;
      margin : 0;
      padding : 0;
      display : grid;
      grid-template-columns: 1fr;
      
  }
  
  .schema-nav a{
    color : #337ab7;
    text-decoration : none;
    font-size : 12px
  }
  
  .schema-nav a:hover{
    color : #212121
  }
  
  .schema-nav li{
    display :block;
    background-color : #f0f0f0;
    padding : 5px;
    margin : 2px
  }
  .schema-nav::after{
    clear: both;
  }
  </style>
  