<template>
    <div>
    <p>Schema:</p>
    <table style="position:relative;margin-left:20px;width:70%">
        <tr>
            <th>Alias</th>
            <th>Type</th>
            <th>System</th>
            <th>Background Only</th>
            <th>Reference</th>
        </tr>
        <tr v-for="(field, alias) in route.schema">
            <td>{{ alias }}</td>
            <td>{{ field.type }}</td>
            <td>{{ (field.system) ? "yes" : "no" }}</td>
            <td>{{ (field.background) ? "yes" : "no" }}</td>
            <td v-if="field.reference && field.reference_type > 0">{{ field.reference }}</td>
            <td v-else>&nbsp;</td>
        </tr>
    </table>
    <p>Permissions: <span v-for="perm in route.perms">{{ perm }}&nbsp;</span> </p>
    </div>
 </template>
<script setup>

const props = defineProps({
    route : Object
});

</script>
<style scoped>

    th { text-align : left;}
</style>