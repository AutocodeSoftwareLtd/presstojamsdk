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
        :multiple="is_multiple"
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

const is_multiple = (props.bind.cell.multiple) ? true : false;

const filtered_options = ref([]);

const cvalue = ref();
if(is_multiple) {
    cvalue.value = [];
    for(let i in props.bind.value) {
        cvalue.value.push({ value : i, label : ''});
    }
} else {
    cvalue.value = { value : props.bind.value, label : ''};
}


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
        if (is_multiple) {
            let arr = [];
            for(const i in val) {
                arr.push(val[i].value);
            }
            props.bind.setValue(arr);
        } else {
            props.bind.setValue(val.value);
        }
    }
});

function searchOptions(e) {
    const active = (is_multiple) 
    ? props.options.filter(opt => cvalue.value.includes(opt.value))
    : props.options.filter(opt => opt.value == cvalue.value.value);
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