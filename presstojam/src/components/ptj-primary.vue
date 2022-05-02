<template>
    <div class="ptj-primary">
        <ptj-nav :actions="actions" />
        <ptj-form-row v-for="(field, index) in data.cells" :key="index" :field="field" :class="Class.getClass('ptj-single-item-row') + ' ' + field.name">
          <ptj-asset v-if="field.meta.type=='asset'" :field="field" />
          <ptj-number v-else-if="field.meta.type=='number'" :field="field" />
          <ptj-flag v-else-if="field.meta.type=='flag'" :field="field" />
          <ptj-id v-else-if="field.meta.type=='id'" :field="field"  />
          <ptj-time v-else-if="field.meta.type=='time'" :field="field" />
          <ptj-string v-else-if="field.meta.type=='string'" :field="field"  />
        </ptj-form-row>
    </div>
    <ptj-nav :actions="children" />
</template>

<script setup>
    defineProps({
        metarow : Object,
        actions : Array,
        children : Array,
        map : Object
    });

    data = new DataRow();


    function load() {
        let params = {};
        if (props.map.to) params.__to = props.map.to;
        if (props.map.key) params.__key = props.map.key;
        return client.get(props.map.model + "-primary", params)
        .then(response => {
            if (response.__status != "SUCCESS") throw new Error(response);
            data.row = response;
            return response;
        })
        .catch(e => {
            console.log(e);
        });
    }

     "ptj-nav" : PtjNav, 
    "ptj-widget" : PtjWidget,
    "ptj-string" : PtjString,
    "ptj-time" : PtjTime,
    "ptj-asset" : PtjAsset,
    "ptj-id" : PtjId,
    "ptj-form-row" : PtjFormRow,
    "ptj-flag" : PtjFlag,
    "ptj-number" : PtjNumber
</script>