
const history = [];
let cb;



function setRoute(uri, title = '') {
    history.push({ r : uri, label : title });
    window.history.pushState({'name' : uri}, document.title, uri);
    runRoute(uri);
}


function hardSetRoute(route) {
    window.location = route;
}


window.onpopstate = function() {
    runRoute(document.location.pathname);
}


function runRoute(uri) {
    if (!uri) uri = window.location.pathname;
    if (cb) cb(uri);
}

function regCallback(callback) {
    cb = callback;
}




export default {
    setRoute,
    hardSetRoute,
    runRoute,
    regCallback
}