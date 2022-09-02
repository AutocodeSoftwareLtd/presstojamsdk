<template>
    <small class="p-error" v-if="error == 1">{{ $t("errors.min",  { min : field.min })}}</small>
    <small class="p-error" v-else-if="error == 2">{{ $t("errors.max", { max : field.max }) }}</small>
    <small class="p-error" v-else-if="error == 3">{{ $t("errors.contains", { char : field.contains }) }}</small>
    <small class="p-error" v-else-if="error == 4">{{ $t("errors.notcontains",  { char : field.notcontains }) }}</small>
    <small class="p-error" v-else-if="error == 5">{{ $t("errors.unique") }}</small>
    <small class="p-error" v-else-if="error == 6">{{ $t("errors.null") }}</small>
</template>

<script setup>

const props = defineProps({
  error : Number,
  field : Object
});

/*
  const OK = 0;
    const OutOfRangeMin = 1;
    const OutOfRangeMax = 2;
    const Characters = 3;
    const CharactersNegative = 4;
    const Unique = 5;
    const NullViolation = 6;
*/

</script>