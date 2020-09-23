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
        '%': (x, y, acc) => acc % y,
        includes: (arr, value) => {
            if (Array.isArray(arr)) {
                const hasValue = arr.includes(value);

                return hasValue ? ['break;', true] : breakFalse;
            }

            if (arr === false) {
                return breakFalse;
            }
            throw Error(`"includes" operator expected an array but received: ${arr}`);
        },
        and: (rule, data) => {
            for (let i = 1, len = rule.length; i < len; i += 1) {
                // eslint-disable-next-line no-use-before-define
                if (!evaluate(rule[i], data)) {
                    return false;
                }
            }

            return true;
        },
        or: (rule, data) => {
            for (let i = 1, len = rule.length; i < len; i += 1) {
                // eslint-disable-next-line no-use-before-define
                if (evaluate(rule[i], data)) {
                    return true;
                }
            }

            return false;
        }
    };

    operators.and.hasOwnLoop = true;
    operators.or.hasOwnLoop = true;

    function addOperator(operator, fnOperator, hasOwnLoop) {
        if (hasOwnLoop) {
            fnOperator.hasOwnLoop = true; // eslint-disable-line
        }

        operators[operator] = fnOperator;

        return fnOperator;
    }

    function addAlias(existingOperatorName, alias) {
        operators[alias] = operators[existingOperatorName];

        return operators[alias];
    }

    function evaluate(rule, data) {
        if (!Array.isArray(rule)) {
            // does the value contain a data reference
            if (typeof rule === 'string' && rule[0] === '$') {
                let objValue = data;

                // User the data reference e.g. "$.aaa.bbb.ccc" to navigate the object's hierarchy e.g. {aaa:{bbb:{ccc:1}}}
                // Start at index 1 to skip the "$." part of the split string
                for (let i = 1, keys = rule.split('.'), len = keys.length; i < len; i += 1) {
                    objValue = objValue[keys[i]] ? objValue[keys[i]] : false;
                }

                return objValue;
            }

            return rule;
        }

        const operator = operators[rule[0]];
        const ruleLength = rule.length;

        // if the rule array contains no operator, return it as standard array
        if (!operator) {
            return rule;
        }

        // lets the operator handle everything e.g. looping and evaluating values
        if (operator.hasOwnLoop) {
            return operator(rule, data, evaluate);
        }

        // No loop required for a rule with just an operator e.g. ['someOperator']
        if (ruleLength === 1) {
            return operator();
        }

        let accumulator = evaluate(rule[1], data);

        // No loop required for a rule with an operator and single value e.g. ['someNumericOperator', 99]
        if (ruleLength === 2) {
            return operator(accumulator);
        }

        // [op, val, val...]
        // Start at index 1 to skip the operator part
        for (let i = 1, len = ruleLength - 1, x, y; i < len; i += 1) {
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
        evaluate,
        addOperator,
        addAlias
    });
}

module.exports = createJSONRules;
