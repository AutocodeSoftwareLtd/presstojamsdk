import { describe, expect, test, beforeAll } from "vitest";
import PtjTimeEdit from "./../components/fields/ptj-time-edit.vue"
import client from "./../js/client.js"


beforeAll(() => {
    client.initSettings({ "url" : "https://api.presstojam.com" });
});


describe("date.js", () => {
    test("test date validation", () => {
        const type = "error";
        store.init()
        .then(store => {
            console.log(store.route);
            expect(store.route.name).toEqual("projects");
        })
        .catch(e => console.log(e));
    });
    
});
