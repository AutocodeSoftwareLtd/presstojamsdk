<template>
    <form class="ptj-register">
        <h2>Register</h2>
        <Message severity="error" v-show="error">{{ error }}</Message>
        <div class="row">
           <span class="p-float-label">
               <InputText id="cusername" type="text" v-model="username" />
               <label for="cusername">Username</label>
           </span>
        </div>
        <div class="row">
           <span class="p-float-label">
               <InputText id="cpassword" type="password" v-model="password" />
               <label for="cpassword">Password</label>
           </span>
        </div>
        <div class="row">
           <span class="p-float-label">
               <InputText id="cconfirm_password" type="password" v-model="conf_password" />
               <label for="cconfirm_password">Confirm Password</label>
           </span>
        </div>
        <div class="row">
            <Checkbox 
        v-model="terms" 
        :binary="true">
        </Checkbox>
            <label>I accept the terms and conditions</label>
        </div>
        <div class="row">
            <Button :label="$t('btns.create')" @click="submit" />
        </div>
    </form>
   </template>
   
   <script setup>
   import InputText from 'primevue/inputtext'
   import Message from 'primevue/message'
   import Checkbox from 'primevue/checkbox'
   import { ref, inject } from 'vue'
   import Button from 'primevue/button'
   import configs from "../../js/configs.js"


   const Client = inject("client");
   const expected_user = configs.get("profile");

   const error = ref('');
   const username = ref('');
   const password = ref('');
   const conf_password = ref('');
   const terms = ref(0);

   const base = configs.get("base");
   
   
   
   function submit() {
       error.value = "";
       
       if (!username.value) {
        error.value = "You must enter a username";
        return;
       }
       if (!password.value) {
        error.value = "You must enter a password";
        return;
       }

       if (password.value != conf_password.value) {
        error.value = "Passwords must match";
        return;
       }

       if (!terms.value) {
        error.value = "You must accept the terms and conditions";
        return;
       }

       const formData = new FormData();
       formData.append("email", username.value);
       formData.append("password", password.value);
       formData.append("terms", (terms.value) ? 1 : 0);
       return Client.post("/user/register/" + expected_user, formData)
       .then(() => {
            location.href = base + "/";
       })
       .catch(e => {
        console.log(e);
            if (typeof e.response === 'string' || e.response instanceof String) {
                error.value = e.response;
            } else {
                let err = JSON.parse(e.response.error);
                if (err.terms) error.value = "You must accept the terms and conditions";
            }
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
   
   
   