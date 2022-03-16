<template >
    <div :class="Class.getClass('ptj-tree-node') + ' ptj-draggable' + this.getRowClass()" :id="branch[store.primarykeyname]" draggable="false">
        <div :class="Class.getClass('ptj-tree-node-row')" @click="selectRow(branch[store.primarykeyname]);">  
            <div>
                <a v-if="ischild" data-action="more" class="button" @click.prevent.stop="toggle(branch[store.primarykeyname], false)">
                    <span class="material-icons">subdirectory_arrow_right</span>
                </a>
                <a v-else data-action="more" class="button" @click.prevent.stop="toggle(branch[store.primarykeyname], true)">
                    <span class="material-icons">keyboard_arrow_right</span>
                </a>
            </div>
            <div v-if="sortable">
                <a data-action="more" class="button" @click="prevent.stop" @mousedown="setDraggable" @mouseup="endDraggable">
                    <span class="material-icons">drag_handle</span>
                </a>
            </div>
            <div v-for="(field, cindex) in store.fields" :key="cindex" v-show="field.on">
                <span>{{ field.label }}: {{ branch[field.name] }}</span>
            </div>
            
        </div>
        <ptj-tree-node v-for="(obj, index) in children" :branch="obj" :ischild="true"  :key="index" v-show="toggle_state[branch[store.primarykeyname]]" :store="store" />
    </div>
</template>

<script>
import { defineComponent} from "vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"

export default defineComponent({
	name : "ptj-tree-node",
	props : {
		branch : {
            type : Object,
            required : true
        },
        draggable : Boolean,
        ischild : {
            type : Boolean,
            default : false
        }

	},
    data() {
        return {
            toggle_state : {}
        }
    },
    setup() {
        return { store : Ctrl.getStore(), Class }
    },
	methods : {
        toggle(index) {
            this.toggle_state[index] = (this.toggle_state[index]) ? false : true;
        },
        setDraggable(e) {
            e.target.closest(".ptj-draggable").setAttribute("draggable", true);
        },
        endDraggable(e) {
            e.target.closest(".ptj-draggable").setAttribute("draggable", false);
        },
        selectRow(key) {
            this.store.next(key);
            Ctrl.buildLink();
        },
        getRowClass() {
            let str = [];
            for(let name of this.store.groups) {
                str.push(this.store.model + "-" + name.replace("_", "-") + "-" + this.branch[name]);
            }
            return str.join(" ");
        }
	},
    computed : {
        sortable() {
            return true;
        },
        children() {
            let arr = [];
            if (this.store.circular && this.branch[this.store.model]) arr = this.branch[this.store.model];
            for(let i in this.store.activechildren) {
                if (this.branch[this.store.activechildren[i]]) arr=arr.concat(this.branch[this.store.activechildren[i]]);
            }
            return arr;
        }
    },
	components : {
	
	}
});


</script>

<style scoped>

.model-tree.branch {
  padding-left: 8px;
  padding-right: 8px;
  margin: 6px 0;
  background-color:#111111;
}

.tree .ide-block {
	display : none;
}

.dragArea {
  min-height: 50px;
  outline: 1px solid #777777;
}


</style>