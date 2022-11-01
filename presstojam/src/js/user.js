let expected_user = "public";
let actual_user = "public";
const user_check = 600000;


export function createUser(client, profile = "public") {

    expected_user = profile;
     
    if (profile == "public") return;

    function resetTokens() {
        if (expected_user == "public") return Promise.resolve(); //no need to do anything if public user
        return client.switchTokens()
        .then(() => {
            return client.get("/user/check-user")
        }).then(response => {
            actual_user = response.name;
            setTimeout(resetTokens, user_check);
        }).catch(e => {
            console.log(e)
            return client.post("/user/logout")
            .catch(e => {
                console.log(e);
            }); 
        });
    }
    
    return resetTokens();
}


export function isUserAuthenticated() {
    return (expected_user != "public" && expected_user == actual_user);
}