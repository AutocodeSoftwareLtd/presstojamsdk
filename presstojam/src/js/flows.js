const flows = {};

class Flow {
    constructor() {
        this._title = "";
        this._routes = [];
        this._seeker = 0;
        this._cb;
    }

    set title(title) {
        this._title = title;
    }

    get title() {
        return this._title;
    }

    get routes() {
        return this._routes;
    }

    regRoute(route) {
        this._routes.push(route);
    }

    next() {
        ++this._seeker;
        if (this._seeker >= this._routes.length) this._cb();
    }

    getRoute() {
        return this._routes[this._seeker];
    }

}

export function registerFlow(flow) {
    flows[flow.key] = new Flow();
    flows[flow.key].title = flow.title;
    for(const route of flow.routes) {
        flows[flow.key].regRoute(route);
    }
    console.log("Registering", flows);
}

export function getFlow(key) {
    return flows[key];
}