<template>
    <Teleport to="#ptj-accountdetails">
    <a v-if="User.user != 'public'" class="ptj-account-details-logout" @click="logout">Logout</a>
    </Teleport>
    <ptj-router />
    <ptj-modal :active="User.login">
        
    </ptj-modal>
</template>
<script setup>

import Client from "./../js/client.js"
import PtjModal from "./ptj-modal.vue"
import PtjFormRow from "./ptj-form-row.vue"
import PtjString from "./ptj-string.vue"
import { ref, reactive, inject } from 'vue'
import { DataRow } from '../js/datarow.js';
import { MetaRow } from "../js/metarow.js"
import { User, checkLoginStatus, logout } from "../js/user.js"
import PtjRouter from "./ptj-router.vue"


checkLoginStatus();

/*
<form @submit.prevent="submit" class="ptj-login">
            <ptj-form-row v-for="field in login_data.cells" :key="field.meta.name" :field="field">
                <ptj-string type="edit" :field="field" />
            </ptj-form-row>
            <input type="submit" value="Login" class="ptj-form-submit" @click="submit">
        </form>
*/

</script>