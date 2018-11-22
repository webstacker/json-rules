# JSON Rules

A small, fast, safe, 0 dependencies, rules engine.

Serialize rules in JSON format. 

## Rule Syntax

[operator, value1, value2, ...]

## Usage

```js
const jr = require("json-rules")();
```

### Simple
```js
jr.evaluate([">", 2, 1]); // true (2 > 1)
```

```js
jr.evaluate(["+", 2, 1]); // 3 (2 + 1)
```

```js
jr.evaluate(["==", "foo", "bar"]); // false (foo === bar)
```

```js
jr.evaluate(["!=", "foo", "bar"]); // true (foo !== bar) 
```

### Nested rules

```js
jr.evaluate([">",
    2,
    ["+", 2, 1]
]); // false (2 > 3)
```

```js
jr.evaluate(["and",
    ["==", 1, 1],
    [">", 2, 1]
]); // true (1 == 1 && 2 > 1)
```

```js
const data = {
    "type": "user"
    "sub-type": "admin"
}

jr.evaluate(["and",
    ["==", "$.type", "user"],
    ["or",
        ["==", "$.sub-type", "admin"],
        ["==", "$.sub-type", "super"]
    ]
], data); // true (type === user && (sub-type === admin || sub-type === super))
```

### Data reference

```js
const data = {
    "foo": "foo",
    "bar": "bar"
};

jr.evaluate(["!=", "$.foo", "$.baz"], data); // true (foo != baz)
```

```js
const data = {
    "baz": ["b", "a", "z"]
};

jr.evaluate(["==", "$.baz.1", "a"], data); // true (a == a)
```

```js
const data = {
    "foo": {
        "bar": {
            "baz": ["b", "a", "z"]
        }
    }
};

jr.evaluate(["==", "$.foo.bar.baz.1", "a"], data); // true (a == a)
```

### Add operator

```js
function eq(x, y) {
    // ['break;', false] instructs the loop to break and return false, this
    // saves testing any further values as they must all be equal to pass
    return x === y || ['break;', false];  
}

jr.addOperator('equals', eq);

jr.evaluate(['equals', 1, 1]); // true (1 === 1) 
```

### Alias operator

```js
jr.addAlias('>=', 'gte');

jr.evaluate('gte', 2, 2); // true (2 >= 2)
```

## API

### jr.evaluate(rule, data)

#### rule

Type: `Array`

The array will be treated as a rule if the first element contains a known operator, otherwise it's treated as a standard array.

#### data

Type: `Object`

This can be referenced within rules using dot notation.

### jr.addOperator(operator, fn)

#### operator

Type: `string`

Operator name e.g. equals.

#### fn

Type: `function`

TODO

## License

MIT
