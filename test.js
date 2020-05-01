const BigMap = require('./main.js')

const memory = () => {
    const used = process.memoryUsage();

    console.log('==== mem ====');
    for (let key in used) {
      console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
    console.log('==== /mem ====');
}

// We create an array first so we can measure how long it took to add keys to the map
// We create few million random numbers converted to a string (mocking product IDs)
const insert = (map, multiplicator, switchValue) => {
    const total = multiplicator * 1000 * 1000;
    const arr = []
    memory();
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
    memory();
    const entriesStart = Date.now();
    const entries = map.entries();
    const entriesEnd = Date.now();
    console.log(`Final size of entries: ${entries.length}, took ${entriesEnd - entriesStart} ms to create`);
    memory();
    const valuesStart = Date.now();
    const values = map.values();
    const valuesEnd = Date.now();
    console.log(`Final size of values: ${values.length}, took ${valuesEnd - valuesStart} ms to create`);
    memory();
    const keysStart = Date.now();
    const keys = map.keys();
    const keysEnd = Date.now();
    console.log(`Final size of keys: ${keys.length}, took ${keysEnd - keysStart} ms to create`);
    memory();
}

const map = new BigMap();

// Insert 1 million and measure how long it took
insert(map, 1)

// Try to switch the values
const map2 = new BigMap();
insert(map2, 5, true)

// This may crash depending on your available memory
insert(map, 12)

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
memory();

const start2 = Date.now()
for (const testN of testingRandomNumbers) {
    results[map2.get(testN)]++;
}

const end2 = Date.now();
console.dir(results)
console.log(`Getter check took ${end2 - start2} ms`)
memory();

