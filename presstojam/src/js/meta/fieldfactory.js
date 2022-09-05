import { ID} from "./id.js"
import { Flag } from "./flag.js"
import { Asset } from "./asset.js"
import { Time } from "./time.js"
import { Number } from "./number.js"
import { String } from "./string.js"

export function createField(field, obj) {
    if (obj.type == "id") return new ID(field, obj);
    else if (obj.type =="number") return new Number(field, obj);
    else if (obj.type == "asset") return new Asset(field, obj);
    else if (obj.type == "flag") return new Flag(field, obj);
    else if (obj.type == "time") return new Time(field, obj);
    else return new String(field, obj);
}