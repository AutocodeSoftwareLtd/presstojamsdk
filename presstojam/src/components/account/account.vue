<template>
    <Card>
       <template #title>
           Account
       </template>
       <template #content>
       <div class="ptj-login">
        <login v-show="state=='login'" />
        <register v-show="state=='create'" />
        <forgotten-password v-show="state=='forgotpassword'" />
         <div class="row">
               <a @click="toggleState('login')">Login</a> |
               <a @click="toggleState('create')">Register</a> | 
               <a @click="toggleState('forgotpassword')">Forgotten password?</a>
           </div>
       </div>
       </template>
    </Card>
   </template>
   
   <script setup>
   import { ref, inject } from 'vue'
   import Card from 'primevue/card';
   import configs from "../../js/configs.js"
   import Login from "./login.vue"
   import Register from "./register.vue"
   import ForgottenPassword from "./forgottenpassword.vue"
   
   
   const Client = inject("client");
   const expected_user = configs.get("profile");
   
   const state = ref('login');

   function toggleState(istate) {
       state.value = istate;
   }
  
   
   </script>
   <style>
       .ptj-login {
           width : 450px;
           margin-left : auto;
           margin-right : auto;
       }
   
   </style>
   
   
   