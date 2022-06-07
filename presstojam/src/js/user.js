import { reactive } from "vue"
import { refresh } from "./route.js"
import Client from "./client.js"
import { Map } from "./map.js"
import { setDictionary } from "./dictionary.js"

export const User = reactive({init : false, login : false, user : "public" });

export const NavStore = reactive({
    cats : {}, 
    routes : [], 
});

export function logout() {
    Client.post("/core/logout")
    .then(() => {
        refresh();
    });
}

function getDefault() {
    for(let cat in NavStore.cats) {
        for(let route of NavStore.cats[cat]) {
            if (route.default) {
                return route;
            }
        }
    }
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
    }).then(response => {
        if (User.user != "public") setTimeout(checkLoginStatus, user_check);
    }).catch(e => {
        User.login = true;
    });
}

export function initUser(role = "") {
    return Client.get("/core/check-user")
    .then(response => {
        if (response.is_expired) {
            return Client.put("/core/switch-tokens")
            .then(() => {
                return Client.get("/core/check-user");
            });
        } else {
            return response;
        }
    })
    .then(response => {
        User.user = response.user;
        User.role = response.role;
        User.init = true;

        if (User.role != role) {
            let url = "/core/change-role";
            if (role) url += "/" + role;
            return Client.post(url)
            .then(response => {
                User.role = role;
            });
        }
    }).then(() => {
        checkLoginStatus();
    }).then(() => {
        return Client.get("/dictionary")
        .then(response => {
            setDictionary(response);
            return true;
        });
    }).catch(e => console.log(e));
}

export function loadNav() {
    NavStore.cats = {};
    NavStore.routes = [];
    return Client.get("/nav/site-map")
    .then(response => {
        for(let cat in response) {
            for(let route_name in response[cat]) {
                const route = { model : route_name, state : response[cat][route_name].state };
                if (response[cat][route_name].default) route.default = true;
                route.route = route_name;
                NavStore.routes.push(route);

                if (!NavStore.cats[cat]) NavStore.cats[cat] = [];
                NavStore.cats[cat].push(route);
            }
        }
    })
    .then(() => {
        if (!Map.model) {
            Map.apply(getDefault());
        }
        return true;
    })
    .catch(e => {
        console.log(e);
    });
}
