<template>
   <router-link :to="{ name : 'primary', params : {'model' : model, 'id' : id }}"
                    v-slot="{isActive, href, navigate}" style="text-decoration: none;">
        <Button 
            icon="pi pi-arrow-circle-right" 
            class="p-button-rounded p-button-success mr-2"
        />
    </router-link>
</template>
<script setup>
    import Button from "primevue/button"

    const props = defineProps({
        model : String,
        id : Number
    })
</script>