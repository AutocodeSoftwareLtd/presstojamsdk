
let _drag_target;
let _drop_target;
let _x =0;
let _y = 0;
let _clone_target;


function isJudder(x, y) {
    const dx = x - this._x;
    const dy = y - this._y;
      
    if (dx < -5 || dx > 5) return false;
    else if (dy < -5 || dy > 5) return false;
    else return true;
}

function getDirection(x, y) {
    const dir_x = (x == this._x) ? 0 : (x > this._x) ? 1 : -1;
    const dir_y = (y == this._y) ? 0 : (y > this._y) ? 1 : -1;
      
    return { x : dir_x, y : dir_y };
}

function offset(elem) {
    var rect = elem.getBoundingClientRect();
    var win = elem.ownerDocument.defaultView;

    return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
    };
}


function insertAfter() {
    let drag_id = this._drag_node.getAttribute("id");
    let drop_id = this._drop_node.getAttribute("id");

    let circular = 0;
    let sort = 0;
    if (this._drop_node.nextElementSibling) {
        for(let i in this._tree) {
            let node = this._tree[i];
            if (node.id == drop_id) {
                circular = node.circular;
                sort = node.sort;
                break;
            } 
        }

        for(let i in this._tree) {
            let node = this._tree[i];
            if (node.id == drag_id) {
                node.circular = circular;
                node.sort = sort + 1;
            } else if (node.circular == circular && node.sort > sort) {
                ++node.sort;
            }
        }
    } else {
        for(let i in this._tree) {
            let node = this._tree[i];
            if (node.id == drag_id) {
                node.circular = circular;
                node.sort = 0;
            } 
        }
    }
}

function insertBefore() {
    let drag_id = this._drag_node.getAttribute("id");
    let drop_id = this._drop_node.getAttribute("id");

    let circular = 0;
    let sort = 0;
    for(let i in this._tree) {
        let node = this._tree[i];
        if (node.id == drop_id) {
            circular = node.circular;
            sort = node.sort;
            ++node.sort;
            break;
        } 
    }

    for(let i in this._tree) {
        let node = this._tree[i];
        if (node.id == drag_id) {
            node.circular = circular;
            node.sort = sort;
        } else if (node.circular == circular && node.sort > sort) {
            ++node.sort;
        }
    }
}

function dragStart(ev) {
    const targ = ev.target.closest('[id]');
    this._drag_node = targ;
    const { top, left } = this.offset(targ);

    ev.dataTransfer.dropEffect = "move";

    this._x = ev.clientX;
    this._y = ev.clientY;
    
    this._offset_x = ev.clientX - left;
    this._offset_y = ev.clientY - top;
}

function isDroppable(ev) {
    let cont = ev.target.closest(this._drop_target);
    return (cont) ? true : false;
}

function dragEnter(ev) {
    if (!this.isDroppable(ev)) return true;
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";

    this._drop_node = ev.target.closest(this._drag_target);

    if (!this._drop_node || this._drop_node.getAttribute("id") == this._drag_node.getAttribute("id")) {
        return;
    }

    const dir = this.getDirection(ev.clientX, ev.clientY);

    if (dir.y == 1) {
        this.insertAfter();
    } else if (dir.y == -1) {
        this.insertBefore();
    }
    this._x = ev.clientX;
    this._y = ev.clientY;
}

function dragOver(ev) {
    if (!this.isDroppable(ev)) return true;
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}


function dragEnd() {
    if (this._drag_node) this._drag_node.setAttribute("draggable", false);
    this._drag_node = null;
}

function drop(ev) {
    if (!this._drop_node) return true;
    ev.preventDefault();
    if (this._call_back) this._call_back(this._tree);
}


function cloneTrRow() {
    let dv = document.createElement("div");
    dv.width = _drag_item.width + "px";
    dv.height = _drag.item.height + "px";
}



export function ptjDrag(drag_handle, drag_item, drop_target) {
    _drag_target = drag_item;
    _drop_target = drop_target;
    drag_item.addEventListener("dragstart", e => drag.dragStart(e));
    drag_item.addEventListener("dragenter", e => drag.dragEnter(e));
    drop_target.addEventListener("dragover", e => drag.dragOver(e));
    drop_target.addEventListener("drop", e => drag.drop(e));
    drag_item.addEventListener("dragend", e => drag.dragEnd(e));
}