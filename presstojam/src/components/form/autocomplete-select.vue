<template>
    <AutoComplete 
        v-model="value"
        :name="bind.cell.name"
        optionLabel="label"
        forceSelection
        :dropdown="true"
        :suggestions="filtered_options"
        placeholder="Please Select"
        class="focus:border-primary"
        @complete="searchOptions($event)"
         @blur="bind.active_validation.value = true"
        />
</template>
<script setup>
import { ref, computed } from "vue"
import AutoComplete from 'primevue/autocomplete';

const props = defineProps({
    bind : Object,
    options : Array
});

const filtered_options = ref([]);

let cvalue = ref(props.bind.value.value);

const value = computed({
    get() {
        return cvalue.value;
    },
    set(val) {
        cvalue.value = val;
        if (!val || typeof val != 'object') return;
        props.bind.setValue(val.value);
    }
});

function searchOptions(e) {
    if (!e.query.trim().length) {
        filtered_options.value = props.options;
    } else {
        filtered_options.value = props.options.filter((opt) => {
            return opt.label.toLowerCase().startsWith(e.query.toLowerCase());
        });
    }
}
</script>