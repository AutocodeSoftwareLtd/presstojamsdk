<template>
    <a>Publishing</a>
  </template>
  <script setup>

  const props = defineProps({
    type : String,
    data : Object,
  });

  console.log("Type is ", props.type, props.data);
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
  