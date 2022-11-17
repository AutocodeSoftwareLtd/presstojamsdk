<template>

<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import"
                        class="mr-2 inline-block" />
</template>
<script setup>
    import FileUpload from 'primevue/FileUpload';
</script>