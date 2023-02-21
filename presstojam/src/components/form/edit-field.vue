 <template>
    <div class="form-check mt-3" v-if="bind.cell.type=='flag'">
        <div class="offset-3 col-md-9">
            <Flag :bind="bind" />
            <label class="form-check-label" :for="bind.cell.name">
                {{ $t("models." + bind.cell.model + ".fields." + bind.cell.name + ".label") }}
            </label>
            <Error v-if="bind.show_error" :bind="bind" />
        </div>
    </div>
    <div class="json-group" v-else-if="bind.cell.type=='json'">
        <PtjJson :bind="bind" :active_validation="active_validation" :data="data"/>
    </div>
    <div class="logic-group" v-else-if="bind.cell.type=='logic'">
        <PtjLogic :bind="bind" :active_validation="active_validation" />
    </div>
    <div class="row" v-else>
        <label :for="bind.cell.name" class="control-label col-md-3">{{ $t("models." + bind.cell.model + ".fields." + bind.cell.name + ".label") }} </label>
        <div class="col-md-9">
                <Number v-if="bind.cell.type=='number'" :bind="bind" class="col"/>
                <Id v-else-if="bind.cell.type=='id'" :bind="bind" class="col" :data="data"/>
                <Asset v-else-if="bind.cell.type=='asset'" :bind="bind" class="col"/>
                <Time v-else-if="bind.cell.type=='time'" :bind="bind" class="col"/>
                <PtjJson v-else-if="bind.cell.type=='json'" :bind="bind" :active_validation="active_validation" class="col"/>
                <PtjString v-else :bind="bind" class="col"/>
                <Error v-if="bind.show_error" :bind="bind" class="col"/>
        </div>
    </div>
</template>
<script setup>
 import Number from "./number-edit.vue"
 import Flag from "./flag-edit.vue"
 import Id from "./id-edit.vue"
 import Time from "./time-edit.vue"
 import PtjString from "./string-edit.vue"
 import Asset from "./asset-edit.vue"
 import PtjJson from "./json-edit.vue"
 import PtjLogic from "./logic-edit.vue"
 import Error from "./error.vue"
 import { computed } from "vue"


const props = defineProps({
    bind : Object,
    active_validation : Boolean,
    data : Object
});



const error = computed(() => {
    if (props.bind.show_error) return props.error;
    else return 0;
});


</script>