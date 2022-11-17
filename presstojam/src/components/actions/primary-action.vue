<template>
   <router-link :to="{ name : 'primary', params : {'model' : model, 'id' : id }}"
                    v-slot="{isActive, href, navigate}">
        <Button 
            icon="pi pi-chevron-right" 
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