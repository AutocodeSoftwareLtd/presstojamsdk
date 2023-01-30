<template>
    <TableDisplay :name="name" :key="name" :repo="repo"/>
</template>
<script setup>
import TableDisplay from "./table-display.vue"
import {  RepoData } from "../../js/data/repodata.js"

const props = defineProps({
    name : String,
    id : Number
});


const repo  = new RepoData(props.name);

repo.parent_id = props.id;

</script>