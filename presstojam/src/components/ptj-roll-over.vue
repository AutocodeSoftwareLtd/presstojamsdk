<template>
    <ptj-form-row v-for="field in cdata.cells" :key="field.name" :field="field">
          <ptj-asset v-if="field.type=='asset'" type="post"  :field="field" />
          <ptj-number v-else-if="field.type=='number'" type="post"  :field="field"/>
          <ptj-flag v-else-if="field.type=='flag'" type="post"  :field="field" />
          <ptj-id v-else-if="field.type=='id'" type="post"  :field="field" />
          <ptj-time v-else-if="field.type=='time'" type="post"   :field="field" />
          <ptj-string v-else-if="field.type=='string'" type="post"  :field="field" />
          <ptj-form-row :field="field" v-if="field.encrypted">
            <ptj-confirm :field="field" />
          </ptj-form-row>
    </ptj-form-row>


</template>
<script setup>

</script>