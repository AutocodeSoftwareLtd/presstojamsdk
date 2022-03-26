<template>
    <Teleport to="#ptj-accountdetails">
    <a :class="Class.getClass('ptj-account-details-logout')" @click="logout">Logout</a>
    </Teleport>
</template>

<script>
import { defineComponent } from 'vue'
import Client from "./../js/client.js"
import Ctrl from "../js/controller.js"
import Class from "./../js/classinjection.js"

export default defineComponent({
    setup() {
        return { Class }
    },
    methods : {
        logout() {
            Client.post("/core-logout")
            .then(() => {
                Ctrl.reloadFromBase();
            });
        }
    }
})
</script>
