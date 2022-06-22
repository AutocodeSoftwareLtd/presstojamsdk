import { ID} from "./id.js"
import { Flag } from "./flag.js"
import { Asset } from "./asset.js"
import { Time } from "./time.js"
import { Number } from "./number.js"
import { String } from "./string.js"

export function createField(field, obj) {
    if (obj.type == "ID") return new ID(field, obj);
    else if (obj.type =="Number") return new Number(field, obj);
    else if (obj.type == "Asset") return new Asset(field, obj);
    else if (obj.type == "Flag") return new Flag(field, obj);
    else if (obj.type == "Time") return new Time(field, obj);
    else return new String(field, obj);
}