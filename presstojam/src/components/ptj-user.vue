<template>
    <div class="ptj-account-details">
    <a v-if="User.user != 'public'" class="ptj-account-details-logout" @click="logout">{{ getDictionary('ptj-user-logout') }}</a>
    </div>
    <ptj-site-map />
    <ptj-router />
    <ptj-modal v-if="User.login" />
</template>
<script setup>

import PtjModal from "./ptj-modal.vue"
import PtjString from "./ptj-string.vue"
import { User, logout } from "./../js/user.js"
import PtjRouter from "./ptj-route.vue"
import PtjButton from "./ptj-button.vue"
import PtjSiteMap from "./ptj-site-map.vue"
import { getDictionary } from "./../js/dictionary.js"

/*
<form @submit.prevent="submit" class="ptj-login">
            <ptj-form-row v-for="field in login_data.cells" :key="field.meta.name" :field="field">
                <ptj-string type="edit" :field="field" />
            </ptj-form-row>
            <input type="submit" value="Login" class="ptj-form-submit" @click="submit">
        </form>
*/




</script>