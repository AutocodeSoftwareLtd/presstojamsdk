import { shallowRef, ref } from "vue"

export const component = shallowRef(null);
export const args = ref({});
export const dialogswitch = ref(false);
export const header = ref('');


export function toggleDialog(in_component, in_args, input_header) {
    if (!dialogswitch.value) {
        header.value = input_header;
        component.value = in_component;
        args.value = in_args;
        dialogswitch.value = true;
    } else {
        header.value = null;
        component.value = null;
        args.value = null;
        dialogswitch.value = false;
    }
}