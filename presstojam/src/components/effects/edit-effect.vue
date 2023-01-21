<template>
    <ptj-form :model="model" :data="data" method="put" key="edit" />
  
</template>
<script setup>

    import PtjForm from "../form/form.vue"

    const props = defineProps({
        model : Object,
        data : Object
    });


</script>