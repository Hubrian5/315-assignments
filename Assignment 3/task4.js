// Accepts nested structure that contains arrays, objects, and values to flatten and extract into a 1-D array
function deepFlattenAndExtract(input) {
    if (Array.isArray(input)) { // Check if array
        return input.reduce((acc, item) => acc.concat(deepFlattenAndExtract(item)), []); // Reduce to concatenate results recursively
    } else if (typeof input === 'object' && input !== null) { // If Object
        return Object.values(input).reduce((acc, value) => acc.concat(deepFlattenAndExtract(value)), []); // Get value of object and process
    } else if (typeof input === 'number') {
        return [input];
    } else {
        return [];
    }
}

// Test input
const input = [
    1,
    [2, 3, { a: 4, b: "ignore" }],
    { c: 5, d: [6, { e: 7 }] },
    "text",
    [8, [9, 10]]
];

const result = deepFlattenAndExtract(input);
console.log(`[${result.join(", ")}]`); // Fix weird line issues