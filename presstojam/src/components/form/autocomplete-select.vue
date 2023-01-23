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
        :class="bind.classes"
        :multiple="bind.cell.multiple"
        @complete="searchOptions($event)"
         @blur="bind.setShowError(true)"
        />
</template>
<script setup>
import { ref, computed, watch } from "vue"
import AutoComplete from 'primevue/autocomplete';

const props = defineProps({
    bind : Object,
    options : Array
});


const filtered_options = ref([]);


let cvalue = ref({ value : 0, label : 'None'});

const def = props.options.filter(opt => opt.value == props.bind.value);

if (def.length > 0) {
    cvalue.value = def[0];
}


const value = computed({
    get() {
        return cvalue.value;
    },
    set(val) {
        cvalue.value = val;
        props.bind.setValue(val.value);
    }
});

function searchOptions(e) {
    const active = props.options.filter(opt => opt.value == cvalue.value);
    if (active.length > 0) cvalue.value = active[0];
    let vl = (!e || !e.query) ? "" : e.query.trim().toLowerCase();
    filtered_options.value = props.options.filter((opt) => {
        return opt.label.toLowerCase().startsWith(vl);
    });
}


watch(() => props.options, () => {
    searchOptions();
});

</script>