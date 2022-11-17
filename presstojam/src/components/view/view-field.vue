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
 import PtjNumber from "./number.vue"
 import PtjFlag from "./flag.vue"
 import PtjId from "./id.vue"
 import PtjTime from "./time.vue"
 import PtjString from "./string.vue"
 import PtjAsset from "./asset.vue"
 import PtjJson from "./json.vue"

const props = defineProps({
    field : Object,
    row : [Array,Object],
});
</script>