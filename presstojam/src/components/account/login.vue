<template>
    <form>
        <h2>Login</h2>
        <Message severity="error" v-show="error">{{ error }}</Message>
        <div class="field row">
        <span class="p-float-label">
	        <InputText id="lusername" type="text" v-model="email" />
	        <label for="lusername">Username</label>
        </span>
        </div>
        <div class="field row">
        <span class="p-float-label">
	        <InputText id="lpassword" type="password" v-model="password" />
	        <label for="lpassword">Password</label>
        </span>
        </div>
        <div class="row">
            <Button :label="$t('btns.login')" @click="submit" />
        </div>
    </form>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import { ref, inject } from 'vue'
import Button from 'primevue/button'
import configs from "../../js/configs.js"
import Message from 'primevue/message'


const Client = inject("client");
const expected_user = configs.get("profile");
const base = configs.get("base");



const error = ref('');
const email = ref('');
const password = ref('');



function submit() {
    error.value = "";

    const formData = new FormData();
    formData.append("email", email.value);
    formData.append("password", password.value);

    Client.post("/user/login/" + expected_user, formData)
    .then(() => {
        location.href = base + "/";
    })
    .catch(e => {
        error.value = "Incorrect username / password";
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


