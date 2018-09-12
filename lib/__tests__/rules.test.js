const createJSONRules = require('../index.js');

const {evaluate} = createJSONRules({});

describe('JSON-Rules', () => {
    it('should return the supplied array if it is empty', () => {
        const rule = [];

        expect(evaluate(rule)).toBe(rule);
    });

    it('should return the supplied array if it has no operator', () => {
        const rule = [1, 2, 3];

        expect(evaluate(rule)).toBe(rule);
    });

    it('should throw an error if the rule is not an array', () => {
        expect(() => evaluate('')).toThrow();
    });

    describe('"==" operator', () => {
        it('should return true if two primitive values are equal', () => {
            expect(evaluate(['==', 1, 1])).toEqual(true);
        });
    });
});
