const error_invalid_map = {
            1 : "too small",
            2 : "too large",
            3 : "contains incorrect characters",
            4 : "doesn't contain required characters",
            5 : "not unique"
}

function getError(code) {
    return error_invalid_map[code];
}

export default {
    getError
}