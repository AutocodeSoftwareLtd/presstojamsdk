const module_address = {
}

function addModule(name, location) {
    module_address[name] = location;
}


function loadModule(name) {
    if (module_address[name]) {
        return import(/* @vite-ignore */module_address[name]);
    } else {
        return import(/* @vite-ignore */"../components/" + name + ".vue");
    }
}

export default {
    addModule,
    loadModule
}