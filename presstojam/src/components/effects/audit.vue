<template>
    <DataTable :value="data">
        <Column field="user-login-id/name" header="User" />
        <Column field="action" header="Type" />
        <Column field="log" header="Values">
            <template #body="slotProps">
                <ul>
                    <li v-for="(log, key) in slotProps.data.log">{{ key  }}: {{ log }}</li>
                </ul>
            </template>
        </Column>
        <Column field="--created" header="Date" />
    </DataTable>
</template>
<script setup>
import { ref, inject } from "vue"
import DataTable from "primevue/DataTable"
import Column from 'primevue/column';

const props = defineProps({
    repo : {
        type : Object,
        required : true
    },
    id : {
        type : Number,
        required : true
    }
});

const client = inject("client");
const data = ref([]);
client.get("/audit/" + props.repo.store.name + "/" + props.id)
.then(response => {
    for(const obj of response) {
        if (obj.action == "POST") obj.action = "Created";
        else if (obj.action == "PUT") obj.action = "Updated";
        else if (obj.action == "DELETE") obj.action = "Deleted";
        //obj['--created'] = (!obj['--created']) ? obj['--created'] : obj['--created'].toLocaleDateString("en-UK");
    }
    data.value = response;
});



</script>