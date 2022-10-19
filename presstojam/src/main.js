import { PtjRun } from "./js/controller.js"

import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'
import 'primeflex/primeflex.css'
import Schema from "./schema.vue";

const url = "https://api.presstojam.com";
//const url = "https://api.genercode.com";
//const url = "http://slim.localhost";
//https://api.presstojam.com

/*const url = "https://dev-local.api-capstonegroup.com/v4";

let settings = {
    "client" : { "url" : url, "debug" : true, custom_headers : {
        'x-domain' : "petinsure.ie"
    } },
    "map" : { base : "/admin/" },
    "models" : {
        "pi-claims" : {
            "limit" : 50,
            "to" : "pi-policy",
            "fields" : [
                "--id",
                "pre-authorisation",
                "last-updated",
                "pi-policy-pet/--parentid",
                "contacts",
                "contacts/phone1",
                "pi-policy-pet/pet-name",
                "claim-handler",
              
                "any-other-comments"
            ],
            "includes" : {
                "contacts" : ["title", "first-name", "last-name"]
            },
              max_cols : 30
        },
        "pi-surgerys" : {
            "limit" : 50
        },
        "pi-claims-rejection-categories" : {
            "nofilter" : 1,
            max_cols : 30
        },
        "pi-claim-type" : {
            "nofilter" : 1
        },
        "pi-claims-file-types" : {
            "nofilter" : 1,
            max_cols : 30
        },
        "pi-conditions" : {
            "limit" : 50
        },
        "pi-claims-payments" : {
            "limit" : 50
        },
        "plan-discounts" : {
            
        },
        "pi-policy-payments" : {
            "limit" : 50
        },
        "eft-batch-payments" : {
            "fields" : [
                "policy-payments-id/policy-id",
                { 
                  name : "risk-key", 
                  label : "Risk Key",
                  type : "aggregate",
                  ws : "-",
                  "fields" : [
                    "policy-payments-id/policy-id",
                    "policy-payments-id/renewal"
                  ]
                },
                {  "path" : "policy-payments-id/policy-id/..pi-policy-account-details",
                "fields" : [
                    "account-holder", //from 
                    "pay-ref",
                    "mandate-ref",
                    "pay-ref",
                    "bic",
                    "sort-code",
                    "account-number",
                    "date-of-signing"
            ]},

            "policy-payments-id/amount",
            "policy-payments-id",
            "policy-payments-id/due-date"
            ]
        }
    }
};

*/


let settings = { 
  "client" : { "url" : url, "debug" : true },
  "map" : { base : "/admin/"},
  "user" : {
      "teleport" : "#ptj-accountdetails",
      "role" : ""
  },
  "models" : {
      "projects" : {
           "export_fields" : {
            "cfdist-id" : "Distribution ID",
            "domain" : "Domain",
            "hosting-status" : "Hosting Status"
           },
           "limit" : 2,
           "order":{
            "hosting-status" : "desc"
           },
           "group" : "hosting-status",
           "groupclasses" : { "active" : "redbackground"}
          // "export_fields" : ["cfdist-id", "domain", "hosting-status"]
      },
      "fields" : {
          "max_cols" : 10,
          "parent" : {
              "hide_actions" : {
                  "post" : true,
                  "parent" : true
              }
          },
          "classes" : [
            {
                att : "type",
                value : "str",
                class : "red"
            }
          ]
          
      }
  },
  "flows" : [{
        "title" : "Register Project",
        "key" : "register",
        "routes" : [
            {"model" : "projects", "method" : "post"},
            {"model" : "profiles", "method" : "crud"}
        ]
    }],
    "routes" : [
        { "path" : "/schema", component : Schema, name :"name"}
    ]
};


//settings = { map : { model : "", key : '', state : '', param_str : '', to : '' }}
document.getElementById("logout").addEventListener("click", logout);

PtjRun("accounts", settings)
.then(app => {
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
