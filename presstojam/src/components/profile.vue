<template>
 <a @click="logout">Logout</a>
</template>
<script setup>
import { inject, ref } from "vue"


const Client = inject("client");


</script>