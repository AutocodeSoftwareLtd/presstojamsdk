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
        return Client.get("/core/check-user")
    }).then(response => {
       actual_user = response.u;
       setTimeout(resetTokens, user_check);
    }).catch(e => console.log(e));
}


export function initUser() {
    if (!user_init) user_init = resetTokens();
    return user_init;
}

export function getUser() {
    return expected_user;
}


export function logout() {
    return Client.post("/core/logout")
}


export function login(username, password) {
    return Client.post("/login/" + expected_user, { username : username, password : password })
}



export function forgotPassword(username) {
    return Client.post("/login/" + expected_user + "/forgotpassword", { username : username })
}


export function createUser(username, password) {
    return Client.post("/login/" + expected_user, { username : username, password : password })
}

export function isUserAuthenticated() {
    return (expected_user != "public" && expected_user == actual_user);
}