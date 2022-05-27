<template>
    <div class="ptj-account-details">
    <a v-if="User.user != 'public'" class="ptj-account-details-logout" @click="logout">Logout</a>
    </div>
    <div class="ptj-nav">
        <div v-for="(routes, title) in NavStore.cats" :key="title">
            <span v-if="routes.length > 1">{{ title }}</span>
            <ptj-button v-for="(route) in routes" :route="{ 'route' : route.route, 'model' : route.model, 'state':route.state, 'key' : 0}" :key="route.route">{{ route.route }}</ptj-button>
        </div>
    </div>
    <ptj-router />
    <ptj-modal :active="User.login">
        
    </ptj-modal>
</template>
<script setup>

import PtjModal from "./ptj-modal.vue"
import PtjString from "./ptj-string.vue"
import { User, logout, NavStore } from "./../js/user.js"
import PtjRouter from "./ptj-router.vue"
import PtjButton from "./ptj-button.vue"

/*
<form @submit.prevent="submit" class="ptj-login">
            <ptj-form-row v-for="field in login_data.cells" :key="field.meta.name" :field="field">
                <ptj-string type="edit" :field="field" />
            </ptj-form-row>
            <input type="submit" value="Login" class="ptj-form-submit" @click="submit">
        </form>
*/




</script>