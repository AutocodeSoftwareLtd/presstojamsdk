import { describe, expect, test, beforeAll } from "vitest";
import { getData } from "./../js/datastore.js"
import client from "./../js/client.js"

const store = getData("projects");

beforeAll(() => {
    client.initSettings({ "url" : "https://api.presstojam.com" });
});

describe("datastore.js", () => {
    test("test route loading", () => {
        const type = "error";
        store.init()
        .then(store => {
            console.log(store.route);
            expect(store.route.name).toEqual("projects");
        })
        .catch(e => console.log(e));
    });
    
});