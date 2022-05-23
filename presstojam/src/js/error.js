const error_invalid_map = {
            1 : "too small",
            2 : "too large",
            3 : "contains incorrect characters",
            4 : "doesn't contain required characters",
            5 : "not unique"
}

export function getError(code) {
    return error_invalid_map[code];
}

export const Errors = {
    OK : 0,
    MIN_VALUE : 1,
    MAX_VALUE : 2,
    HAS : 3,
    HAS_NOT : 4
}
