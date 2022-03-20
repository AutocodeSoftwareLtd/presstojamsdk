<template>
    <div :class="Class.getClass('ptj-list') + ' ' + store.classes">
        <div v-for="(group, index) in store.groups" :key="index">
            <h3>{{ index }}</h3>
            <ul>
                <li v-for="(row, index) in group" :key="index">
                    <a @click="next(row[store.primarykeyname]);">
                        <span v-for="field in store.fields" :key="field.name" v-show="field.on">{{ field.val}}</span>                         {{ field.val }}
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

import { defineComponent} from "vue"
import Ctrl from "../js/controller.js"
import Class from "../js/classinjection.js"

export default defineComponent({
    name: 'ptj-list',
    setup() {
        return { store : Ctrl.getStore(), Class}
    },
    methods : {
        next(key) {
            this.store.next(key);
            Ctrl.buildLink();
        }
    }
});

</script>

