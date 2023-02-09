<template>
    <div class="invalid-feedback">{{ err_message}}</div>
</template>

<script setup>

import { computed } from "vue"
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  bind :Object
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

const err_message = computed(() => {
  if (props.bind.error.value == 1) return t("errors.min",  { min : props.bind.cell.min });
  else if (props.bind.error.value == 2) return t("errors.max", { max : props.bind.cell.max });
  else if (props.bind.error.value == 3) return t("errors.contains", { char : props.bind.cell.contains });
  else if (props.bind.error.value == 4) return t("errors.notcontains",  { char : props.bind.cell.notcontains });
  else if (props.bind.error.value == 5) return t("errors.unique");
  else return "";
});

</script>