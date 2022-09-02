import { describe, expect, test, beforeAll } from "vitest";
import { getRoutes, getRoute } from "./../js/routes.js"
import client from "./../js/client.js"


beforeAll(() => {
    client.initSettings({ "url" : "https://api.presstojam.com" });
});

describe("routes.js", () => {
    test("loading all", () => {
        getRoutes()
        .then(routes => {
            console.log(routes);
        })
        .catch(e => console.log(e));
    });

    test("loading model", () => {
        getRoute("projects")
        .then(route => {
            console.log(route);
        })
        .catch(e => console.log(e));
    });
    
});