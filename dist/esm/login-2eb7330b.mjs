import { inject, reactive, openBlock, createBlock, unref, withCtx, createElementVNode, withDirectives, toDisplayString, vShow, createVNode, createTextVNode } from 'vue';
import { a as script$2, s as script$3 } from './inputtext.esm-98b20197.mjs';
import { s as script$1 } from './card.esm-aa1399ba.mjs';
import { c as configs } from './configs-be955862.mjs';
import { s as styleInject } from './style-inject.es-04d8aa40.mjs';

const _hoisted_1 = /*#__PURE__*/createTextVNode(" Login ");
const _hoisted_2 = { class: "ptj-login" };
const _hoisted_3 = { class: "field row" };
const _hoisted_4 = { class: "p-float-label" };
const _hoisted_5 = /*#__PURE__*/createElementVNode("label", { for: "lusername" }, "Username", -1 /* HOISTED */);
const _hoisted_6 = { class: "field row" };
const _hoisted_7 = { class: "p-float-label" };
const _hoisted_8 = /*#__PURE__*/createElementVNode("label", { for: "lpassword" }, "Password", -1 /* HOISTED */);
const _hoisted_9 = { class: "row" };
const _hoisted_10 = { class: "ptj-register" };
const _hoisted_11 = { class: "row" };
const _hoisted_12 = { class: "p-float-label" };
const _hoisted_13 = /*#__PURE__*/createElementVNode("label", { for: "cusername" }, "Username", -1 /* HOISTED */);
const _hoisted_14 = { class: "row" };
const _hoisted_15 = { class: "p-float-label" };
const _hoisted_16 = /*#__PURE__*/createElementVNode("label", { for: "cpassword" }, "Password", -1 /* HOISTED */);
const _hoisted_17 = { class: "row" };
const _hoisted_18 = { class: "p-float-label" };
const _hoisted_19 = /*#__PURE__*/createElementVNode("label", { for: "cconfirm_password" }, "Confirm Password", -1 /* HOISTED */);
const _hoisted_20 = { class: "row" };
const _hoisted_21 = { class: "ptj-register" };
const _hoisted_22 = { class: "row" };
const _hoisted_23 = { class: "p-float-label" };
const _hoisted_24 = /*#__PURE__*/createElementVNode("label", { for: "fusername" }, "Username", -1 /* HOISTED */);
const _hoisted_25 = { class: "row" };
const _hoisted_26 = { class: "row" };
const _hoisted_27 = /*#__PURE__*/createTextVNode(" | ");
const _hoisted_28 = /*#__PURE__*/createTextVNode(" | ");



var script = {
  props: {
    actions : []
},
  setup(__props) {

const Client = inject("client");
const expected_user = configs.get("profile");
const i18n = inject("i18n");
const t = i18n.t;
const base = configs.get("base");




const store = reactive({
    state : 'login',
    active : true,
    email : "",
    password : "",
    confirm_password : "",
    globalerror : ''
});

function toggleState(state) {
    store.state = state;
}


function login(username, password) {
    const formData = new FormData();
    formData.append("email", username);
    formData.append("password", password);
    return Client.post("/user/login/" + expected_user, formData)
}



function forgotPassword(username) {
    const formData = new FormData();
    formData.append("email", username);
    return Client.post("/user/login/" + expected_user + "/forgotpassword", formData );
}


function createUser(name, username, password) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", username);
    formData.append("password", password);
    return Client.post("/user/login/" + expected_user, formData)
}




function submit() {
    store.active = false;
    store.globalerror = "";
    if (store.state == "login") {
        login(store.email, store.password)
        .then(() => {
            location.href = base + "/";
        })
        .catch(e => {
            store.globalerror = "Incorrect username / password";
        });
    } else if (store.state == "forgotpassword") {
        forgotPassword(store.username)
        .catch(e => {
            store.globalerror = "This user doesn't exist";
        });
    } else {
        createUser(store.username, store.password)
        .catch(e => {
            store.applyErrors(e);
        });
    }
} 

return (_ctx, _cache) => {
  return (openBlock(), createBlock(unref(script$1), null, {
    title: withCtx(() => [
      _hoisted_1
    ]),
    content: withCtx(() => [
      createElementVNode("div", _hoisted_2, [
        withDirectives(createElementVNode("form", null, [
          withDirectives(createElementVNode("div", { class: "ptj-form-error" }, toDisplayString(unref(store).globalerror), 513 /* TEXT, NEED_PATCH */), [
            [vShow, unref(store).globalerror]
          ]),
          createElementVNode("div", _hoisted_3, [
            createElementVNode("span", _hoisted_4, [
              createVNode(unref(script$2), {
                id: "lusername",
                type: "text",
                modelValue: unref(store).email,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((unref(store).email) = $event))
              }, null, 8 /* PROPS */, ["modelValue"]),
              _hoisted_5
            ])
          ]),
          createElementVNode("div", _hoisted_6, [
            createElementVNode("span", _hoisted_7, [
              createVNode(unref(script$2), {
                id: "lpassword",
                type: "password",
                modelValue: unref(store).password,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((unref(store).password) = $event))
              }, null, 8 /* PROPS */, ["modelValue"]),
              _hoisted_8
            ])
          ]),
          createElementVNode("div", _hoisted_9, [
            createVNode(unref(script$3), {
              label: unref(t)('btns.login'),
              onClick: submit
            }, null, 8 /* PROPS */, ["label"])
          ])
        ], 512 /* NEED_PATCH */), [
          [vShow, unref(store).state=='login']
        ]),
        withDirectives(createElementVNode("form", _hoisted_10, [
          withDirectives(createElementVNode("div", { class: "ptj-form-error" }, toDisplayString(unref(store).globalerror), 513 /* TEXT, NEED_PATCH */), [
            [vShow, unref(store).globalerror]
          ]),
          createElementVNode("div", _hoisted_11, [
            createElementVNode("span", _hoisted_12, [
              createVNode(unref(script$2), {
                id: "cusername",
                type: "text",
                modelValue: unref(store).username,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((unref(store).username) = $event))
              }, null, 8 /* PROPS */, ["modelValue"]),
              _hoisted_13
            ])
          ]),
          createElementVNode("div", _hoisted_14, [
            createElementVNode("span", _hoisted_15, [
              createVNode(unref(script$2), {
                id: "cpassword",
                type: "password",
                modelValue: unref(store).password,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((unref(store).password) = $event))
              }, null, 8 /* PROPS */, ["modelValue"]),
              _hoisted_16
            ])
          ]),
          createElementVNode("div", _hoisted_17, [
            createElementVNode("span", _hoisted_18, [
              createVNode(unref(script$2), {
                id: "cconfirm_password",
                type: "password",
                modelValue: unref(store).confirm_password,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((unref(store).confirm_password) = $event))
              }, null, 8 /* PROPS */, ["modelValue"]),
              _hoisted_19
            ])
          ]),
          createElementVNode("div", _hoisted_20, [
            createVNode(unref(script$3), {
              label: unref(t)('btns.create'),
              onClick: submit
            }, null, 8 /* PROPS */, ["label"])
          ])
        ], 512 /* NEED_PATCH */), [
          [vShow, unref(store).state=='create']
        ]),
        withDirectives(createElementVNode("form", _hoisted_21, [
          withDirectives(createElementVNode("div", { class: "ptj-form-error" }, toDisplayString(unref(store).globalerror), 513 /* TEXT, NEED_PATCH */), [
            [vShow, unref(store).globalerror]
          ]),
          createElementVNode("div", _hoisted_22, [
            createElementVNode("span", _hoisted_23, [
              createVNode(unref(script$2), {
                id: "fusername",
                type: "text",
                modelValue: unref(store).username,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((unref(store).username) = $event))
              }, null, 8 /* PROPS */, ["modelValue"]),
              _hoisted_24
            ])
          ]),
          createElementVNode("div", _hoisted_25, [
            createVNode(unref(script$3), {
              label: unref(t)('btns.forgot'),
              onClick: submit
            }, null, 8 /* PROPS */, ["label"])
          ])
        ], 512 /* NEED_PATCH */), [
          [vShow, unref(store).state=='forgotpassword']
        ]),
        createElementVNode("div", _hoisted_26, [
          createElementVNode("a", {
            onClick: _cache[6] || (_cache[6] = $event => (toggleState('login')))
          }, "Login"),
          _hoisted_27,
          createElementVNode("a", {
            onClick: _cache[7] || (_cache[7] = $event => (toggleState('create')))
          }, "Register"),
          _hoisted_28,
          createElementVNode("a", {
            onClick: _cache[8] || (_cache[8] = $event => (toggleState('forgotpassword')))
          }, "Forgotten password?")
        ])
      ])
    ]),
    _: 1 /* STABLE */
  }))
}
}

};

var css_248z = "\n.login-vue-vue-type-style-index-0-id-26fc1ace-lang_ptj-login__uVh-v {\r\n        width : 450px;\r\n        margin-left : auto;\r\n        margin-right : auto;\n}\n.login-vue-vue-type-style-index-0-id-26fc1ace-lang_ptj-login__uVh-v > form > div {\r\n        margin-bottom :28px;\n}\n.login-vue-vue-type-style-index-0-id-26fc1ace-lang_ptj-login__uVh-v input {\r\n        width : 100%;\n}\r\n";
styleInject(css_248z);

script.__file = "presstojam/src/components/login/login.vue";

export { script as s };
