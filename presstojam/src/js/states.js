import { Field } from "./field";

export function createStateTrigger(name, states, cb) {

    let group = [];
    for(let i in states) {
        let field = new Field(name, states[i]);
        group.push({ depends_val : states[i].depends_val, field });
    }
    
    return (val) => {
        for(const state of group) {
            if (state.depends_val == val) {
                return cb(state.field);
            }
        }

        //if we get to here, then set a default
        for(const state of group) {
            if (!state.depends_val) {
                return cb(state.field);
            }
        }
    }

}           