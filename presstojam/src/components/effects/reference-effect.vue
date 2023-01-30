<template>
    <ptj-form :entity_name="name" method="post" />
 </template>
 <script setup>
    
    import PtjForm from "../form/form.vue"

 
     const props = defineProps({
        name : String
     });

 
    let parent = false;
    let common_parent = "";
    let common_parent_id = 0;


 </script>