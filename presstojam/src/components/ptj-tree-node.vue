<template >
    <div :class="Class.getClass('ptj-tree-node') + ' ptj-draggable' + this.getRowClass()" :id="branch.primary.toVal()" draggable="false">
        <div :class="Class.getClass('ptj-tree-node-row')" @click="selectRow(branch);">  
            <div>
                <a v-if="ischild" data-action="more" class="button" @click.prevent.stop="toggle(branch.primary.toVal(), false)">
                    <span class="material-icons">subdirectory_arrow_right</span>
                </a>
                <a v-else data-action="more" class="button" @click.prevent.stop="toggle(branch.primary.toVal(), true)">
                    <span class="material-icons">keyboard_arrow_right</span>
                </a>
            </div>
            <div v-if="sortable">
                <a data-action="more" class="button" @click="prevent.stop" @mousedown="setDraggable" @mouseup="endDraggable">
                    <span class="material-icons">drag_handle</span>
                </a>
            </div>
            <div>{{ branch.getSummary() }}</div>
            
        </div>
        <ptj-tree-node v-for="(obj, index) in children" :branch="obj" :ischild="true"  :key="index" v-show="toggle_state[branch.primary.toVal()]" :store="store" />
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
        selectRow(branch) {
            let key = branch.primary.toVal();
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
            let children = this.branch.children;
            for(let i in children) {
                const carr = children[i];
                arr.push(...carr);
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