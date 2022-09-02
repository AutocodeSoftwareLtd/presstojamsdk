import { describe, expect, test, beforeAll } from "vitest";
import { checkUser, userSettings } from "./../js/user.js"
import client from "./../js/client.js"


beforeAll(() => {
    client.initSettings({ "url" : "https://api.presstojam.com" });
    userSettings({ expected_user : "accounts"});
});

describe("user.js", () => {
    test("check user", () => {
        checkUser();
    });
    
});