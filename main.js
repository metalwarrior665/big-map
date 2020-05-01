class BigMap {
    constructor(iterable) {
        if (iterable) throw new Error("haven't implemented construction with iterable yet");
        this._maps = [new Map()];
        this._perMapSizeLimit = 14000000;
        this.size = 0;
    }

    has(key) {
        for (const map of this._maps) {
            if (map.has(key)) {
                return true;
            }
        }
        return false;
    }

    get(key) {
        for (const map of this._maps) {
            if (map.has(key)) {
                return map.get(key);
            }
        }
        return undefined;
    }

    set(key, value) {
        for (const map of this._maps) {
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
        let totalEntries = [];
        for (const map of this._maps) {
            totalEntries = totalEntries.concat(map.entries());
        }
        return totalEntries;
    }

    keys() {
        let totalKeys = [];
        for (const map of this._maps) {
            totalKeys = totalKeys.concat(map.keys());
        }
        return totalKeys;
    }

    values() {
        let totalValues = [];
        for (const map of this._maps) {
            totalValues = totalValues.concat(map.values());
        }
        return totalValues;
    }
}

module.exports = BigMap;
