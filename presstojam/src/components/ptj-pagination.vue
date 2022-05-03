<template>
 <div class="ptj-pagination">
     <a v-for="index in data_template.max_pages" :key="index" @click="$emit('setPage', index - 1)" :class="getActiveClass(index)">{{ index }}</a>
 </div>
</template>
<script setup>

const props = defineProps({
    data_template : Object
});

function getActiveClass(index) {
    return (index - 1 == props.data_template.page) ? "ptj-pagination-active" : "";
}
</script>