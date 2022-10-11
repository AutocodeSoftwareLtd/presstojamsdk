 <template>
    <ptj-number v-if="field.type=='number'" :value="row[field.name]" :field="field" />
    <ptj-flag v-else-if="field.type=='flag'"  :value="row[field.name]" :field="field"/>
    <ptj-id v-else-if="field.type=='id'" :value="row[field.name]" :field="field" :row="row" />
    <ptj-asset v-else-if="field.type=='asset'" :value="row[field.name]" :field="field" :id="row['--id']" />
    <ptj-time v-else-if="field.type=='time'" :value="row[field.name]" :field="field" />
    <ptj-json v-else-if="field.type=='json'" :value="row[field.name]" :field="field" />
    <ptj-string v-else-if="field.type=='string'" :value="row[field.name]" :field="field" />
</template>
<script setup>
 import PtjNumber from "./fields/ptj-number.vue"
 import PtjFlag from "./fields/ptj-flag.vue"
 import PtjId from "./fields/ptj-id.vue"
 import PtjTime from "./fields/ptj-time.vue"
 import PtjString from "./fields/ptj-string.vue"
 import PtjAsset from "./fields/ptj-asset.vue"
 import PtjJson from "./fields/ptj-json.vue"

const props = defineProps({
    field : Object,
    row : [Array,Object],
});
</script>