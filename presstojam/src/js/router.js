let cb;

function setRoute(uri, title = '') {
    window.history.pushState({'name' : uri.pathname}, document.title, uri);
    runRoute(uri);
}


function hardSetRoute(route) {
    window.location = route;
}


window.onpopstate = function(event) {
    runRoute(new URL(document.location.href));
}


function runRoute(uri) {
    if (!uri) uri = new URL(window.location.href);
    if (cb) cb(uri, window.location.search);
}

function softRoute(uri, title = '') {
    window.history.pushState({'name' : uri.pathname}, document.title, uri);
}

function regCallback(callback) {
    cb = callback;
}


export default {
    setRoute,
    hardSetRoute,
    runRoute,
    regCallback,
    softRoute
}