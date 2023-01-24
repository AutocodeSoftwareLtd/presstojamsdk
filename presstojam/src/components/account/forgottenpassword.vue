<template>
    <form class="ptj-register">
        <h2>Forgotten Password</h2>
        <div class="ptj-form-error" v-show="error">{{ error }}</div>
        <div class="row">
            <span class="p-float-label">
               <InputText id="fusername" type="text" v-model="username" />
               <label for="fusername">Username</label>
           </span>
        </div>
        <div class="row">
            <Button :label="$t('btns.forgot', 'send new password')" @click="submit" />
        </div>
    </form>
   </template>
   
   <script setup>
   import InputText from 'primevue/inputtext';
   import { ref, inject } from 'vue'
   import Button from 'primevue/button'
   import configs from "../../js/configs.js"
   
   
   const Client = inject("client");
   const expected_user = configs.get("profile");
   const base = configs.get("base");
 
   const username = ref('');
   const error = ref('');

   
    function submit() {
        error.value = "";

        const formData = new FormData();
        formData.append("email", username.value);
       
        return Client.post("/user/login/" + expected_user + "/forgotpassword", formData)
        .catch(e => {
            error.value = "This user doesn't exist";
        });
    } 
   </script>
   <style>
       .ptj-login {
           width : 450px;
           margin-left : auto;
           margin-right : auto;
       }
   
       .ptj-login > form > div {
           margin-bottom :28px;
       }
   
       .ptj-login input {
           width : 100%;
       }
   </style>
   
   
   