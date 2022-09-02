<template>
 <Card>
    <template #title>
        Login
    </template>
    <template #content>
    <form @submit.prevent="submit" v-show="store.state=='login'" class="ptj-login">
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <span class="p-float-label">
	        <InputText id="lusername" type="text" v-model="store.username" />
	        <label for="lusername">Username</label>
        </span>
        <span class="p-float-label">
	        <InputText id="lpassword" type="password" v-model="store.password" />
	        <label for="lpassword">Password</label>
        </span>
        <input type="submit" :value="$t('btns.login')" class="ptj-form-submit">
        <a @click="toggleState('create')">Register</a>
        <a @click="toggleState('forgotpassword')">Forgotten password?</a>
    </form>
    <form  @submit.prevent="submit" v-show="store.state=='create'" class="ptj-register">
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <span class="p-float-label">
	        <InputText id="cusername" type="text" v-model="store.username" />
	        <label for="cusername">Username</label>
        </span>
        <span class="p-float-label">
	        <InputText id="cpassword" type="password" v-model="store.password" />
	        <label for="cpassword">Password</label>
        </span>
        <span class="p-float-label">
	        <InputText id="cconfirm_password" type="password" v-model="store.confirm_password" />
	        <label for="cconfirm_password">Confirm Password</label>
        </span>
        <input type="submit" :value="$t('comp.ptj-account-handler.btn.create')" class="ptj-form-submit">
        <a @click="toggleState('login')">Login</a>
    </form>
    <form  @submit.prevent="submit" v-show="store.state=='forgotpassword'" class="ptj-register">
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <span class="p-float-label">
	        <InputText id="fusername" type="text" v-model="store.username" />
	        <label for="fusername">Username</label>
        </span>
        <input type="submit" :value="$t('comp.ptj-account-handler.btn.forgot')" class="ptj-form-submit">
        <a @click="toggleState('login')">Login</a>
    </form>
    </template>
 </Card>
</template>

<script setup>
import InputText from 'primevue/inputtext';
import { login, forgotPassword, createUser } from "./../js/user.js"
import { reactive } from 'vue'
import Card from 'primevue/card';



const props = defineProps({
    actions : []
});


const store = reactive({
    state : 'login',
    active : true,
    username : "",
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
        login(store.username, store.password)
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


