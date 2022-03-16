class GCDragNDrop {

    constructor(props = {}) {
        this._handle = props.handle;
        this._drop_target = props.drop_target;
        this._drag_target = props.drag_target;
        this._call_back = props.callback;
        this._x = 0;
        this._y = 0;
        this._offset_x = 0;
        this._offset_y = 0;
        this._judder = (props.judder) ? props.judder : 5;
        this._drag_node;
        this._drop_node;
        this._tree = props.tree;
    }

    isJudder(x, y) {
        const dx = x - this._x;
        const dy = y - this._y;
      
        if (dx < -5 || dx > 5) return false;
        else if (dy < -5 || dy > 5) return false;
        else return true;
    }

    getDirection(x, y) {
        const dir_x = (x == this._x) ? 0 : (x > this._x) ? 1 : -1;
        const dir_y = (y == this._y) ? 0 : (y > this._y) ? 1 : -1;
      
        return { x : dir_x, y : dir_y };
    }

    offset(elem) {
        var rect = elem.getBoundingClientRect();
        var win = elem.ownerDocument.defaultView;

        return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
        };
    }

    insertAfter() {
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

    insertBefore() {
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

    dragStart(ev) {
        const targ = ev.target.closest('[id]');
        this._drag_node = targ;
        const { top, left } = this.offset(targ);

        ev.dataTransfer.dropEffect = "move";

        this._x = ev.clientX;
        this._y = ev.clientY;
    
        this._offset_x = ev.clientX - left;
        this._offset_y = ev.clientY - top;
    }

    isDroppable(ev) {
        let cont = ev.target.closest(this._drop_target);
        return (cont) ? true : false;
    }

    dragEnter(ev) {
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

    dragOver(ev) {
        if (!this.isDroppable(ev)) return true;
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }


    dragEnd() {
        if (this._drag_node) this._drag_node.setAttribute("draggable", false);
        this._drag_node = null;
    }

    drop(ev) {
        if (!this._drop_node) return true;
        ev.preventDefault();
        if (this._call_back) this._call_back(this._tree);
    }

}



function initDD(props) {
    let drag = new GCDragNDrop(props);
    let handles = document.querySelectorAll(props.handle);
    handles.forEach(el => el.addAttribute("draggable", true));

    if (props.handle) {

        let handles = document.querySelectorAll(props.handle);

        handles.forEach(el => {
            el.addEventListener("mousedown", e => {
                let cont = e.target.closest(props.drag_target);
                cont.addAttribute("draggable", true);
            });            
        });
    }

    props.main.addEventListener("dragstart", e => drag.dragStart(e));
    props.main.addEventListener("dragenter", e => drag.dragEnter(e));
    props.main.addEventListener("dragover", e => drag.dragOver(e));
    props.main.addEventListener("drop", e => drag.drop(e));
    props.main.addEventListener("dragend", e => drag.dragEnd(e));
}

export default {
    initDD
}