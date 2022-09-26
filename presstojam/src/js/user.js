import Client from "./client.js"

let expected_user = "public";
let actual_user = "public";
let user_init = false;
const user_check = 600000;


export function userSettings(profile) {
    expected_user = profile;
}

function resetTokens() {
    if (expected_user == "Public") return Promise.resolve(); //no need to do anything if public user
    return Client.switchTokens()
    .then(() => {
        return Client.get("/user/check-user")
    }).then(response => {
       actual_user = response.name;
       setTimeout(resetTokens, user_check);
    }).catch(e => {
        console.log(e)
        return logout()
        .catch(e => {
            console.log(e);
        }); 
    });
}


export function initUser() {
    if (!user_init) user_init = resetTokens();
    return user_init;
}

export function getUser() {
    return expected_user;
}


export function logout() {
    return Client.post("/user/logout", {'x-force-auth-cookies' : 1})
}


export function login(username, password) {
    const formData = new FormData();
    formData.append("email", username);
    formData.append("password", password);
    return Client.post("/user/login/" + expected_user, formData)
}



export function forgotPassword(username) {
    const formData = new FormData();
    formData.append("email", username);
    return Client.post("/user/login/" + expected_user + "/forgotpassword", formData );
}


export function createUser(name, username, password) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", username);
    formData.append("password", password);
    return Client.post("/user/login/" + expected_user, formData)
}

export function isUserAuthenticated() {
    return (expected_user != "public" && expected_user == actual_user);
}