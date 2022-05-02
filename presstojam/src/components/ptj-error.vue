<template>
    <p class="ptj-error">{{ error }}</p>
</template>

<script setup>
defineProps({
    'error' : [Number, String, Object]
});

</script>

<style>
.ptj-error {
  color : red;
}
</style>