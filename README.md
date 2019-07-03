## big-map-simple

Simple and uncomplete wrapper of [native javascript Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). It bypasses V8 max limit of approx. 14M elements. It does so by creating multiple maps and wrapping them to similar API.

Has no dependencies. Just few lines of code. It is basically the same as [`big-set`](https://www.npmjs.com/package/big-set) library, just about 10-20% slower. If you need only the key, use `big-set`.

Currently it only allows these methods (usefull for a large dedup):
- `.has(key)`
- `.get(key)`
- `.set(key, value)`
- `.entries()` (This doesn't return iterable like original map but just a plain array)

It doesn't allow passing iterable in its constructor, you have to add elements with .set(key) method.

Checking if element is present or getting the element takes about 1-10 ms per 10k checks (depends on size) but adding millions of keys takes time. From my tests (10 character long random string key and one of 3 strings value) it seems about:

1M adds - 0.7 sec
20M adds - 18 sec
100M adds - 180 sec


```
const BigMap = require('big-map-simple')

// We create an array first so we can measure how long it took to add keys to the map
// We create few million random numbers converted to a string (mocking product IDs)
const insert = (map, multiplicator, switchValue) => {
    const total = multiplicator * 1000 * 1000;
    const arr = []
    for (let i = 0; i < total; i++) {
        if (i % 1000000 === 0) {
            console.log(`${i} random numbers created`)
        }
        const str = Math.random().toFixed(8)
        arr.push(str);
    }
    const start = Date.now();
    if (switchValue) {
        let i = 0;
        for (const str of arr) {
            if (i % 3 === 0) {
                map.set(str, 'processed');
            } else if (i % 2 === 0) {
                map.set(str, 'enqueued');
            } else {
                map.set(str, 'processing');
            }
            
            i++;
        } 
    }
    else {
        for (const str of arr) {
            map.set(str, 'processed');
        }
    }
    
    const end = Date.now();
    console.log(`Final size of map: ${map.size}, took ${end - start} ms to create`);
    const entriesStart = Date.now();
    const entries = map.entries();
    const entriesEnd = Date.now();
    console.log(`Final size of entries: ${entries.length}, took ${entriesEnd - entriesStart} ms to create`);
}

const map = new BigMap();

// Insert 1 million and measure how long it took
insert(map, 1)

// Try to switch the values
const map2 = new BigMap();
insert(map2, 1, true)

// This may crash depending on your available memory
// insert(map, 50) 

// Now we measure the element lookup
let testingRandomNumbers = [];
for (let i = 0; i < 10000; i++) {
    const str = Math.random().toFixed(8)
    testingRandomNumbers.push(str);
}

const results = {
    true: 0,
    false: 0,
    enqueued: 0,
    processed: 0,
    processing: 0,
}

const start = Date.now()
for (const testN of testingRandomNumbers) {
    results[map2.has(testN)]++;
}
const end = Date.now();
console.dir(results)
console.log(`Lookup check took ${end - start} ms`)

const start2 = Date.now()
for (const testN of testingRandomNumbers) {
    results[map2.get(testN)]++;
}
const end2 = Date.now();
console.dir(results)
console.log(`Getter check took ${end2 - start2} ms`)

```