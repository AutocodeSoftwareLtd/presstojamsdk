<template></template>
<script setup>

import configs from "./../js/configs.js"
import { defaultEntity } from "./../js/entity/entitymanager.js"

const base = configs.get("base");
location.href = base + "/data/" + defaultEntity();
 
</script>