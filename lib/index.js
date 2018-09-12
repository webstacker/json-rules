function createJSONRules(spec) {
    // const {routes} = spec;
    const operators = {
        '==': (x, y) => x === y
    };

    function evaluate(rule) {
        if (!Array.isArray(rule)) {
            throw new Error(`Rule (${rule}) must be an Array`);
        }

        // if the rule array is empty or doesn't contain an operator
        // treat it as a standard array and return it
        if (rule.length === 0 || !(rule[0] in operators)) {
            return rule;
        }

        const operator = rule[0];
        const values = rule.slice(1);

        for (let i = 0, x, y; i < values.length; i++) {
            x = values[i];

            if (i + 1 <= values.length) {
            }
        }
    }

    return Object.freeze({
        evaluate
    });
}

module.exports = createJSONRules;
