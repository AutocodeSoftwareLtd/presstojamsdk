let _ctarget = {
    orig : 0,
    target : 0,
    state : null,
    key : null,
    to : null,
    model: null,
    end : null,
    param_str : {}
}

function resetIntention() {
    for(let i in _ctarget) {
        _ctarget[i] = null;
    }
}

function updateIntention(orig, vals) {
    resetIntention();
    _ctarget.orig = parseInt(orig);

    for(let i in vals) {
        _ctarget[i] = vals[i];
    }
}

function convertMaps(omaps) {
    let ni = _ctarget.orig + _ctarget.target;
    if (ni < 0) omaps.unshift({ ...omaps[i] });
    else if (ni >= omaps.length) omaps.push({ ... omaps[omaps.length - 1]});

    for(let i in _ctarget) {
        if (_ctarget[i] !== null) {
            if (i == "_end") omaps.splice(ni + 1, omaps.length);
            else omaps[ni][i] = _ctarget[i];
        }
    }
}

export default {
    updateIntention,
    convertMaps
}
