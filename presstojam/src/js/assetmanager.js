import Client from "./client.js"

export class AssetManager {

    constructor() {
        this._size = 0;
        this._blob = null;
        this._chunk_size = 0;
    }

    set chunk_size(chunk) {
        this._chunk_size = chunk;
    }
  
    set blob(blob) {
        this._blob = blob;
    }
  
    set url(url) {
        this._url = url;
    }
  
    set key(key) {
        this._key = key;
    }
  
  
    get blob() {
        return this._blob;
    }
  
    get size() {
        return this._size;
    }
  
    get uploaded() {
        return this._uploaded;
    }
  
    get chunk_size() {
        return this._chunk_size;
    }
  
  
    get url() {
        return this._url;
    }
  
  
    getChunk(index) {
        const start = (this._chunk_size == 0) ? 0 : index * this._chunk_size;
        let end = (this._chunk_size == 0) ? this._size : (index + 1) * this._chunk_size;
        if (end > this._size) end = this._size;
        const view = new DataView(this._blob, start, end - start);
        let buffer = [];
        for(let i = 0, n=view.byteLength; i<n; ++i) {
          buffer.push(view.getInt8(i));
        }
        return buffer.join('');
    }
  
  
    async upload(file) {
        this._size = file.size;
        const res = await new Promise(( resolve, reject) => {
            const fr = new FileReader();
            let _self = this;
            fr.onload = function(e) {
              _self.blob = e.target.result;
              resolve(fr.result);
            }
            fr.onerror = reject;
            fr.readAsArrayBuffer(file);  
          });
          return res;
    }

    save(url) {
        //this needs to be a promise
        let promises = [];
        //else, do we have any assets?
        let chunks = (this.chunk_size == 0) ? 1 : Math.ceil(this.size / this.chunk_size);
        for(let i=0; i<chunks; ++i) {
            const data = {};
            data.__chunk = i;
            data.__blob = this.getChunk(i);
            promises.push(Client.patch(url, data));
        }
        return Promise.all(promises);
    }
} 