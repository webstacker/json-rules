/* eslint no-use-before-define: ["error", { "functions": false }] */

function createJSONRules() {
    const breakFalse = ['break;', false];
    const operators = {
        '==': (x, y) => x === y || breakFalse,
        '!=': (x, y) => x !== y || breakFalse,
        '>': (x, y) => x > y || breakFalse,
        '>=': (x, y) => x >= y || breakFalse,
        '<': (x, y) => x < y || breakFalse,
        '<=': (x, y) => x <= y || breakFalse,
        '+': (x, y, acc) => acc + y,
        '-': (x, y, acc) => acc - y,
        '/': (x, y, acc) => acc / y,
        '*': (x, y, acc) => acc * y,
        and: rule => {
            for (let i = 1, len = rule.length; i < len; i += 1) {
                if (!evaluate(rule[i])) {
                    return false;
                }
            }

            return true;
        },
        or: rule => {
            for (let i = 1, len = rule.length; i < len; i += 1) {
                if (evaluate(rule[i])) {
                    return true;
                }
            }

            return false;
        }
    };

    operators.and.ownLoop = true;
    operators.or.ownLoop = true;

    function evaluate(rule, data) {
        if (!Array.isArray(rule)) {
            // does the value contain a data reference
            if (typeof rule === 'string' && rule[0] === '$') {
                let objValue = data;

                // User the data reference e.g. "$.aaa.bbb.ccc" to navigate the object's hierarchy e.g. {aaa:{bbb:{ccc:1}}}
                // Start at index 1 to skip the "$." part of the split string
                for (let i = 1, keys = rule.split('.'), len = keys.length; i < len; i += 1) {
                    objValue = objValue[keys[i]];
                }
                return objValue;
            }

            return rule;
        }

        const operator = operators[rule[0]];

        // if the rule array doesn't contain an operator
        // treat it as a standard array and return it
        if (!operator) {
            return rule;
        }

        if (operator.ownLoop) {
            return operator(rule);
        }

        let accumulator = evaluate(rule[1], data);

        // Start at index 1 to skip the operator part
        for (let i = 1, len = rule.length - 1, x, y; i < len; i += 1) {
            x = i === 1 ? accumulator : y;
            y = evaluate(rule[i + 1], data);

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
