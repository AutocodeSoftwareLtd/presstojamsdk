<template>
 <div class="ptj-account-handler">
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
        <input type="submit" :value="getDictionary('ptj-account-handler-btn-login')" class="ptj-form-submit">
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
        <input type="submit" :value="getDictionary('ptj-account-handler-btn-create')" class="ptj-form-submit">
        <a @click="toggleState('login')">Login</a>
    </form>
    <form  @submit.prevent="submit" v-show="store.state=='forgotpassword'" class="ptj-register">
        <div class="ptj-form-error" v-show="store.globalerror">{{ store.globalerror }}</div>
        <span class="p-float-label">
	        <InputText id="fusername" type="text" v-model="store.username" />
	        <label for="fusername">Username</label>
        </span>
        <input type="submit" :value="getDictionary('ptj-account-handler-btn-forgot-password')" class="ptj-form-submit">
        <a @click="toggleState('login')">Login</a>
    </form>
 </div>
</template>

<script setup>
import InputText from 'primevue/inputtext';
import { reload, User } from "./../js/controller.js"
import { reactive } from 'vue'
import client from "./../js/client.js"
import { getDictionary } from "./../js/dictionary.js"



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
        return client.post("/login/" + User.user, { username : store.username, password : store.password })
        .then(response => {
            reload();
        })
        .catch(e => {
            store.globalerror = "Incorrect username / password";
        });
    } else if (store.state == "forgotpassword") {
        return client.post("/login/" +  User.user + "/forgotpassword", { username : store.username })
        .then(response => {
            reload();
        })
        .catch(e => {
            store.globalerror = "Incorrect username / password";
        });
    } else {
        return client.post("/login/" + User.user, { username : store.username, password : store.password })
        .then(response => {
            reload();
        })
        .catch(e => {
            store.register_data.applyErrors(e);
        });
    }
} 
</script>


