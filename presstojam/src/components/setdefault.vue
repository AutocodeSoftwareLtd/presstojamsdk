<template></template>
<script setup>
import { getDefaultRoute } from "./../js/routes.js"
import configs from "./../js/configs.js"

const base = configs.get("base");
location.href = base + "/data/" + getDefaultRoute();
 
</script>