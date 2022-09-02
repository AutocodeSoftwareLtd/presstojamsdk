import { describe, expect, test, beforeAll } from "vitest";
import client from "./../js/client.js"

beforeAll(() => {
    client.initSettings({ "url" : "https://api.presstojam.com" });
});


describe("client ", () => {
  

test('get settings', () => {
   const settings = client.getSettings();
   expect(settings.url).toEqual("https://api.presstojam.com");
});


test('check user', () => {
    client.get("/core/check-user")
    .then(response => {
        expect(response.u).toEqual("public");
    })
    .catch(e => console.log(e));
})
});