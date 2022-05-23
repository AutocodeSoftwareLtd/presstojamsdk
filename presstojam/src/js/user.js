import { reactive } from "vue"
import { refresh } from "./route.js"
import Client from "./client.js"

export const User = reactive({init : false, login : false, user : "public" });

export function logout() {
    Client.post("/core/logout")
    .then(() => {
        refresh();
    });
}


const user_check = 600000;

export function checkLoginStatus() {
    Client.get("/core/check-user")
    .then(response => {
        if (response.is_expired) {
            return Client.put("/core/switch-tokens")
            .then(() => {
                checkLoginStatus();
            });
        }
        if (!User.init) {
            User.user = response.user;
            User.role = response.role;
            User.init = true;
            /*if (user.user != "public") {
                return Client.post("/route/" + user.user + "/" + user.user + "/login")
                .then(response => {
                    let meta = new MetaRow();
                    meta.map(response.fields);
                    register_data.applyMetaRow(meta);
                });
            }*/
        }
    }).then(response => {
        if (User.user != "public") setTimeout(checkLoginStatus, user_check);
    }).catch(e => {
        User.login = true;
    });
}

