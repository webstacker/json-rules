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

    // it('should throw an error if the rule is not an array', () => {
    //     expect(() => evaluate('')).toThrow();
    // });

    it('should evaluate any sub rules', () => {
        const rule = ['==', 2, ['+', 0, ['+', 1, 1]], 2];

        expect(evaluate(rule)).toEqual(true);
    });

    it('should substitute data references with actual values', () => {
        const rule = ['==', 2, '$.someValue'];

        expect(evaluate(rule, {someValue: 2})).toEqual(true);
    });

    describe('"==" operator', () => {
        it('should return true if two primitive values are equal', () => {
            expect(evaluate(['==', 1, 1])).toEqual(true);
        });

        it('should return false if two primitive values are not equal', () => {
            expect(evaluate(['==', 1, 2])).toEqual(false);
        });

        it('should return true if multiple primitive values are all equal', () => {
            expect(evaluate(['==', 1, 1, 1, 1, 1])).toEqual(true);
        });

        it('should return false if multiple primitive values are not all equal', () => {
            expect(evaluate(['==', 1, 1, 2])).toEqual(false);
        });
    });

    describe('"!=" operator', () => {
        it('should return true if two primitive values are not equal', () => {
            expect(evaluate(['!=', 1, 2])).toEqual(true);
        });

        it('should return false if two primitive values are equal', () => {
            expect(evaluate(['!=', 2, 2])).toEqual(false);
        });

        it('should return true if multiple primitive values are not equal', () => {
            expect(evaluate(['!=', 1, 2, 3, 4, 5])).toEqual(true);
        });

        it('should return false if multiple primitive values are equal', () => {
            expect(evaluate(['!=', 1, 1, 1, 1, 1])).toEqual(false);
        });
    });

    describe('">" operator', () => {
        it('should return true if a number is greater than the following number', () => {
            expect(evaluate(['>', 2, 1])).toEqual(true);
        });

        it('should return false if a number is less than the following number', () => {
            expect(evaluate(['>', 1, 2])).toEqual(false);
        });

        it('should return true if a number is greater than the following number for all numbers in the array', () => {
            expect(evaluate(['>', 5, 4, 3, 2, 1])).toEqual(true);
        });

        it('should return false if a number is less than the following number for all numbers in the array', () => {
            expect(evaluate(['>', 5, 4, 3, 2, 5])).toEqual(false);
        });
    });

    describe('">=" operator', () => {
        it('should return true if a number is greater than the following number', () => {
            expect(evaluate(['>=', 2, 1])).toEqual(true);
        });

        it('should return true if a number is equal to the following number', () => {
            expect(evaluate(['>=', 2, 2])).toEqual(true);
        });

        it('should return false if a number is less than the following number', () => {
            expect(evaluate(['>=', 1, 2])).toEqual(false);
        });

        it('should return true if a number is greater than the following number for all numbers in the array', () => {
            expect(evaluate(['>=', 5, 4, 3, 2, 1])).toEqual(true);
        });

        it('should return true if a number is equal to the following number for all numbers in the array', () => {
            expect(evaluate(['>=', 5, 5, 5, 5, 5])).toEqual(true);
        });

        it('should return false if a number is less than the following number for all numbers in the array', () => {
            expect(evaluate(['>=', 5, 4, 3, 2, 5])).toEqual(false);
        });
    });

    describe('"<" operator', () => {
        it('should return true if a number is less than the following number', () => {
            expect(evaluate(['<', 1, 2])).toEqual(true);
        });

        it('should return false if a number is greater than the following number', () => {
            expect(evaluate(['<', 2, 1])).toEqual(false);
        });

        it('should return true if a number is less than the following number for all numbers in the array', () => {
            expect(evaluate(['<', 1, 2, 3, 4, 5])).toEqual(true);
        });

        it('should return false if a number is greater than the following number for all numbers in the array', () => {
            expect(evaluate(['<', 1, 2, 3, 1, 5])).toEqual(false);
        });
    });

    describe('"<=" operator', () => {
        it('should return true if a number is less than the following number', () => {
            expect(evaluate(['<=', 1, 2])).toEqual(true);
        });

        it('should return true if a number is equal to the following number', () => {
            expect(evaluate(['<=', 2, 2])).toEqual(true);
        });

        it('should return false if a number is greater than the following number', () => {
            expect(evaluate(['<=', 2, 1])).toEqual(false);
        });

        it('should return true if a number is less than the following number for all numbers in the array', () => {
            expect(evaluate(['<=', 1, 2, 3, 4, 5])).toEqual(true);
        });

        it('should return true if a number is equal to the following number for all numbers in the array', () => {
            expect(evaluate(['<=', 5, 5, 5, 5, 5])).toEqual(true);
        });

        it('should return false if a number is greater than the following number for all numbers in the array', () => {
            expect(evaluate(['<=', 1, 2, 3, 1, 5])).toEqual(false);
        });
    });

    describe('"+" operator', () => {
        it('should return the sum of adding two numbers', () => {
            expect(evaluate(['+', 1, 1])).toEqual(2);
        });

        it('should return the sum of adding multiple numbers', () => {
            expect(evaluate(['+', 1, 2, 3, 4, 1, -1, 1])).toEqual(11);
        });

        it('should return the sum of adding multiple numbers including floats', () => {
            expect(evaluate(['+', 1, 2, 0.5])).toEqual(3.5);
        });
    });

    describe('"-" operator', () => {
        it('should return the sum of subtracting two numbers', () => {
            expect(evaluate(['-', 1, 1])).toEqual(0);
        });

        it('should return the sum of subtracting multiple numbers', () => {
            expect(evaluate(['-', 5, 1, 1, 1, 1, 1])).toEqual(0);
        });

        it('should return the sum of subtracting multiple numbers including floats', () => {
            expect(evaluate(['-', 5.5, 1, 1, 1.5, 1, 1])).toEqual(0);
        });
    });

    describe('"/" operator', () => {
        it('should return the sum of dividing two numbers', () => {
            expect(evaluate(['/', 2, 1])).toEqual(2);
        });

        it('should return the sum of dividing multiple numbers', () => {
            expect(evaluate(['/', 15, 3, 2.5, 1, 1, 1])).toEqual(2);
        });
    });

    describe('"*" operator', () => {
        it('should return the sum of multiplying two numbers', () => {
            expect(evaluate(['*', 2, 2])).toEqual(4);
        });

        it('should return the sum of multiplying multiple numbers', () => {
            expect(evaluate(['*', 2, 2, 2, 2, 1])).toEqual(16);
        });
    });

    describe('"%" operator', () => {
        it('should return the remainder of dividing one number by another', () => {
            expect(evaluate(['%', 5, 2])).toEqual(1);
            expect(evaluate(['%', 10, 2])).toEqual(0);
        });

        it('should return the remainder of dividing multiple numbers', () => {
            expect(evaluate(['%', 20, 11, 5, 3])).toEqual(1);
        });
    });

    describe('"and" operator', () => {
        it('should return true if two predicates are true', () => {
            expect(evaluate(['and', true, true])).toEqual(true);
        });

        it('should return true if all predicates in the array are true', () => {
            expect(evaluate(['and', true, true, true, true, true])).toEqual(true);
        });

        it('should return false if one of the two predicates is false', () => {
            expect(evaluate(['and', true, false])).toEqual(false);
        });

        it('should return false if all predicates in the array are false', () => {
            expect(evaluate(['and', false, false, false, false, false])).toEqual(false);
        });

        it('should return false if a single predicate in the array is false', () => {
            expect(evaluate(['and', 1, 2, 3, 4, 0])).toEqual(false);
        });
    });

    describe('"or" operator', () => {
        it('should return true if both of the two predicates are true', () => {
            expect(evaluate(['or', true, true])).toEqual(true);
        });

        it('should return true if one of the two predicates are true', () => {
            expect(evaluate(['or', false, true])).toEqual(true);
        });

        it('should return true if all the predicates in the array are true', () => {
            expect(evaluate(['or', true, true, true, true, true])).toEqual(true);
        });

        it('should return false if all the predicates in the array are false', () => {
            expect(evaluate(['or', false, false, false])).toEqual(false);
        });

        it('should return true if a single predicate in the array is true', () => {
            expect(evaluate(['or', false, false, false, false, true, false, false])).toEqual(true);
        });
    });
});
