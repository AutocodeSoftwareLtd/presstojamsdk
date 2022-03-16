<template>
    <a :class="Class.getClass('ptj-account-details-logout')" @click="logout">Logout</a>

</template>

<script>
import { defineComponent } from 'vue'
import Client from "./../js/client.js"
import CtrlMapper from "./../js/ctrlmap.js"
import Class from "./../js/classinjection.js"

export default defineComponent({
    setup() {
        return { Class }
    },
    methods : {
        logout() {
            Client.post("/core-logout")
            .then(response => {
                CtrlMapper.reloadFromBase();
            });
        }
    },
    computed : {
        classes() {
            return Classes.getClass("ptj-account-details-logout");
        }
    }
})
</script>
