<template>
 <Card>
    <template #title>
        Login
    </template>
    <template #content>
    <div class="ptj-login">
    <form v-show="store.state=='login'" >
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <div class="field row">
        <span class="p-float-label">
	        <InputText id="lusername" type="text" v-model="store.email" />
	        <label for="lusername">Username</label>
        </span>
        </div>
        <div class="field row">
        <span class="p-float-label">
	        <InputText id="lpassword" type="password" v-model="store.password" />
	        <label for="lpassword">Password</label>
        </span>
        </div>
        <div class="row">
            <Button :label="$t('btns.login')" @click="submit" />
        </div>
    </form>
    <form v-show="store.state=='create'" class="ptj-register">
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <div class="row">
        <span class="p-float-label">
	        <InputText id="cusername" type="text" v-model="store.username" />
	        <label for="cusername">Username</label>
        </span>
        </div>
        <div class="row">
        <span class="p-float-label">
	        <InputText id="cpassword" type="password" v-model="store.password" />
	        <label for="cpassword">Password</label>
        </span>
        </div>
        <div class="row">
        <span class="p-float-label">
	        <InputText id="cconfirm_password" type="password" v-model="store.confirm_password" />
	        <label for="cconfirm_password">Confirm Password</label>
        </span>
        </div>
        <div class="row">
            <Button :label="$t('btns.create')" @click="submit" />
        </div>
    </form>
    <form v-show="store.state=='forgotpassword'" class="ptj-register">
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <div class="row">
        <span class="p-float-label">
	        <InputText id="fusername" type="text" v-model="store.username" />
	        <label for="fusername">Username</label>
        </span>
        </div>
        <div class="row">
            <Button :label="$t('btns.forgot')" @click="submit" />
        </div>
    </form>
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
import InputText from 'primevue/inputtext';
import { login, forgotPassword, createUser } from "./../js/user.js"
import { reactive } from 'vue'
import Card from 'primevue/card';
import Button from 'primevue/Button'



const props = defineProps({
    actions : [],
    base : String
});


const store = reactive({
    state : 'login',
    active : true,
    email : "",
    password : "",
    confirm_password : "",
    globalerror : ''
});

function toggleState(state) {
    store.state = state;
}


function submit() {
    store.active = false;
    store.globalerror = "";
    if (store.state == "login") {
        login(store.email, store.password)
        .then(() => {
            location.href = props.base;
        })
        .catch(e => {
            store.globalerror = "Incorrect username / password";
        });
    } else if (store.state == "forgotpassword") {
        forgotPassword(store.username)
        .catch(e => {
            store.globalerror = "This user doesn't exist";
        });
    } else {
        createUser(store.username, store.password)
        .catch(e => {
            store.applyErrors(e);
        });
    }
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


