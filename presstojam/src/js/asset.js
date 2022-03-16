
import Client from "./client.js"

export class Asset {

    constructor() {
      this._size = 0;
      this._blob = null;
      this._uploaded = false;
      this._chunk_size = 0;
      this._url;
      this._key = 0;
      this._key_field;
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

    set keyfield(field) {
        this._key_field = field;
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


    loadFile(id) {
        let data = {};
        data[this._key_field] = id;
        return Client.get(this._url, data)
        .catch(e => {
            alert(e);
        });
    }

    delFile(id) {
        let data = {};
        data[this._key_field] = id;
        return Client.delete(this._url, data)
        .catch(e => {
            alert(e);
        });
    }

    saveFile(file, id) {
        //this needs to be a promise
        this._size = file.size;
        return new Promise(( resolve, reject) => {
          const fr = new FileReader();
          let _self = this;
          fr.onload = function(e) {
            _self.blob = e.target.result;
            resolve(fr.result);
          }
          fr.onerror = reject;
          fr.readAsArrayBuffer(file);  
        })
        .then(() => {
          let promises = [];
          //else, do we have any assets?
          let chunks = (this.chunk_size == 0) ? 1 : Math.ceil(this.size / this.chunk_size);
          for(let i=0; i<chunks; ++i) {
              const data = {};
              data.__chunk = i;
              data.__blob = this.getChunk(i);
              data.id = id;
              promises.push(Client.put(this._url, data));
          }
          return Promise.all(promises);
        });
      }

}