/* eslint no-use-before-define: ["error", { "functions": false }] */

function createJSONRules() {
    const operators = {
        '==': (x, y) => x === y || 'break;',
        '>': (x, y) => x > y || 'break;',
        '<': (x, y) => x < y || 'break;',
        '+': (x, y, acc) => acc + y,
        '-': (x, y, acc) => acc - y
    };

    function getValue(value, data) {
        if (Array.isArray(value)) {
            return evaluate(value);
        }

        // does the value contain a data reference
        if (typeof value === 'string' && value[0] === '$') {
            let objValue = data;

            // User the data reference e.g. "$.aaa.bbb.ccc" to navigate the object's hierarchy e.g. {aaa:{bbb:{ccc:1}}}
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
        const values = rule.slice(1);
        let accumulator = getValue(values[0], data);

        for (let i = 0, len = values.length - 1, x, y; i < len; i += 1) {
            x = i === 0 ? accumulator : y;
            y = getValue(values[i + 1], data);

            accumulator = operator(x, y, accumulator);

            if (accumulator === 'break;') {
                return false;
            }
        }

        return accumulator;
    }

    return Object.freeze({
        evaluate
    });
}

module.exports = createJSONRules;
