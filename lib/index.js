/* eslint no-use-before-define: ["error", { "functions": false }] */

function createJSONRules() {
    const breakFalse = ['break;', false];
    const operators = {
        '==': (x, y) => x === y || breakFalse,
        '>': (x, y) => x > y || breakFalse,
        '>=': (x, y) => x >= y || breakFalse,
        '<': (x, y) => x < y || breakFalse,
        '<=': (x, y) => x <= y || breakFalse,
        '+': (x, y, acc) => acc + y,
        '-': (x, y, acc) => acc - y,
        '/': (x, y, acc) => acc / y,
        and: (x, y) => (!x || !y ? breakFalse : true),
        or: (x, y) => (x || y ? ['break;', true] : false)
    };

    function getValue(value, data) {
        if (Array.isArray(value)) {
            return evaluate(value);
        }

        // does the value contain a data reference
        if (data && typeof value === 'string' && value[0] === '$') {
            let objValue = data;

            // User the data reference e.g. "$.aaa.bbb.ccc" to navigate the object's hierarchy e.g. {aaa:{bbb:{ccc:1}}}
            // Start at index 1 to skip the "$." part of the split string
            for (let i = 1, keys = value.split('.'), len = keys.length; i < len; i += 1) {
                objValue = objValue[keys[i]];
            }
            return objValue;
        }

        return value;
    }

    function evaluate(rule, data) {
        if (!Array.isArray(rule)) {
            throw new Error(`Rule (${rule}) must be an Array`);
        }

        // if the rule array is empty or doesn't contain an operator
        // treat it as a standard array and return it
        if (rule.length === 0 || !(rule[0] in operators)) {
            return rule;
        }

        const operator = operators[rule[0]];
        let accumulator = getValue(rule[1], data);

        // Start at index 1 to skip the operator part
        for (let i = 1, len = rule.length - 1, x, y; i < len; i += 1) {
            x = i === 1 ? accumulator : y;
            y = getValue(rule[i + 1], data);

            accumulator = operator(x, y, accumulator);

            if (accumulator && Array.isArray(accumulator) && accumulator[0] === 'break;') {
                return accumulator[1];
            }
        }

        return accumulator;
    }

    return Object.freeze({
        evaluate
    });
}

module.exports = createJSONRules;
