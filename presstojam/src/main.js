
import { createApp } from "vue"
import Settings from "./js/settings.js"
import PTJUser from "./components/ptj-user.vue"
import { Map } from "./js/map.js"
import { loadNav } from "./js/user.js"
//https://api.presstojam.com
let settings = { 
    "client" : { "url" : "http://api.localhost", "debug" : true },
    "mapper" : { base : ""},
    "models" : {
        "projects" : {
            "get" : {
                "fields" : ["name", "accounts/name"],
                "to" : "accounts",
                "change_intention" : {
                    "target" : 0
                }
               
            }
        },
        "fields" : {
            "parent" : {
               
                "hide_actions" : {
                    "post" : true,
                    "parent" : true
                }
            }
        }
    }
};

Settings.regSettings(settings);

settings = { map : { model : "", key : '', state : '', param_str : '', to : '' }}

Map.init();
loadNav()
.then(() => {
    const app = createApp(PTJUser);
    app.mount("#app");
});

/*
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const referer = urlParams.get("referer");
const domain = urlParams.get("domain");
const code = urlParams.get("code");


const Ctrl = FactoryController.createController({
    "plugin" : {
          "project-import" : {
              "post" : {
                    "load" : instance => {
                        instance.data.domain = domain;
                        instance.data.code = code;
                        instance.submit()
                        .then(() => {
                            let url = domain + referer;
                            url += (url.indexOf("?") == -1) ? "?" : "&";
                            url += "code=" + code;
                            window.location = url;
                        })
                    }
                }
            }
        }
});

Ctrl.initProfile()
.then(profile => {
    if (profile == "accounts") {
        return Client.post('/core-assume-role', { 'role' : 'plugin' });
    }
})
.then(() => {
    Router.runRoute();
    try {
        const app = createApp(GCRoot);
        app.provide('ctrl', Ctrl);
        app.mount("#app");
    } catch(err) {
        alert(err.message);
    }
});

    Ctrl.initSettings({
        "client" : {"url" : "http://api.localhost", "debug" : true },
        "models" : {
            "accounts-user" : {
            "actions" : {
                "login" : {
                    "next" : redirect
                },
                "post" : {
                    "next" : redirect
                }
            }
        }
        },
        "router" : {
            "aliases" : {
                "/accounts-login" : "/plugin/" 
            }
        },
        "routes" : response => {
            if (response.__profile && response.__profile != "public") {
                //the user is already logged in, need to logout and reset
                Client.post("/core-logout")
                .then(() => {
                  //  location.reload();
                });
            }
        }
    });*/