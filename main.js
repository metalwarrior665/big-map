class BigMap {
    constructor(iterable) {
        if (iterable) throw new Error("haven't implemented construction with iterable yet");
        this._maps = [new Map()];
        this._perMapSizeLimit = 14000000;
        this.size = 0;
    }
    has(key) {
        for (let map of this._maps) {
            if (map.has(key)) {
                return true;
            }
        }
        return false;
    }
    get(key) {
        for (let map of this._maps) {
            if (map.has(key)) {
                return map.get(key);
            }
        }
        return undefined;
    }
    set(key, value) {
        for (let map of this._maps) {
            if (map.has(key)) {
                map.set(key, value);
                return this;
            }
        }
        let map = this._maps[this._maps.length - 1];
        if (map.size > this._perMapSizeLimit) {
            map = new Map();
            this._maps.push(map);
        }
        map.set(key, value);
        this.size++;
        return this;
    }
    entries() {
        let total = [];
        for (const map of this._maps) {
            for (const entry of map) {
                total.push(entry);
            }
           
        }
        console.log('total[0]:', total[0]);
        return total;
    }
}

module.exports = BigMap;