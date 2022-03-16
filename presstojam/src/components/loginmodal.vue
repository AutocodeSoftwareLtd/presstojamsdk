<template>
 <div class="blackout" v-if="login">
    <div class="form">
        <ptj-form />
    </div>
 </div>
</template>

<script>
import { defineComponent  } from 'vue'
import profile from "./../js/profile.js"

export default defineComponent({
    name : 'login-modal',
    computed : {
        login() {
            return profile.require_login;
        }
    }
});

</script>