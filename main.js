class BigMap {
    /**
     * @param {Iterable<any>} [iterable]
     */
    constructor(iterable) {
        this._maps = [new Map()];
        this._perMapSizeLimit = 14000000;

        if (iterable) {
            for (const key in iterable) {
                this.set(key, iterable[key]);
            }
        }
    }
    /**
     * @param {string} key
     */
    has(key) {
        for (let map of this._maps) {
            if (map.has(key)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {string} key
     * @returns {any | undefined}
     */
    get(key) {
        for (let map of this._maps) {
            if (map.has(key)) {
                return map.get(key);
            }
        }
        return undefined;
    }
    /**
     * @param {string} key
     * @returns {this}
     */
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
        return this;
    }
    clear() {
        this._maps.forEach((m) => m.clear());
        this._maps.length = 1;
    }
    /**
     * @returns {number}
     */
    get size() {
        return this._maps.reduce((o, map) => (o + map.size), 0);
    }
    /**
     * @private
     * @param {Exclude<keyof Map<any, any>, 'number'>} type
     */
    _reduceSpread(type) {
        return this._maps.reduce((out, map) => out.concat([...map[type]()]), []);
    }
    /**
     * @returns {any[]}
     */
    values() {
        return this._reduceSpread('values');
    }
    /**
     * @returns {string[]}
     */
    keys() {
        return this._reduceSpread('keys');
    }
    /**
     * @returns {Array<[string, any]>}
     */
    entries() {
        return this._reduceSpread('entries');
    }
}

module.exports = BigMap;