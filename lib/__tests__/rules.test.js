'use strict';

const createJSONRules = require('../index.js');

describe('JSON-Rules', () => {
    let evaluate;
    let addOperator;
    let addAlias;

    beforeEach(() => {
        ({evaluate, addOperator, addAlias} = createJSONRules());
    });

    it('should return the supplied array if it is empty', () => {
        const rule = [];

        expect(evaluate(rule)).toBe(rule);
    });

    it('should return the supplied array if it has no operator', () => {
        const rule = [1, 2, 3];

        expect(evaluate(rule)).toBe(rule);
    });

    it('should evaluate any sub rules', () => {
        const rule = ['==', 2, ['+', 0, ['+', 1, 1]], 2];

        expect(evaluate(rule)).toEqual(true);
    });

    it('should substitute data references with actual values', () => {
        const rule = ['==', 2, '$.someValue', '$.someArrayValue.1'];
        const data = {
            someValue: 2,
            someArrayValue: [1, 2, 3]
        };

        expect(evaluate(rule, data)).toEqual(true);
    });

    it('should return false if data reference is undefined', () => {
        const rule = ['==', 2, '$.someValue.unknownValue'];
        const data = {
            someValue: 2,
            someArrayValue: [1, 2, 3]
        };

        expect(evaluate(rule, data)).toEqual(false);
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

        it('should pass data to nested rules', () => {
            const rule = ['and', ['==', '$.someValue', true], ['==', '$.someArrayValue.0', true]];
            const data = {
                someValue: true,
                someArrayValue: [true]
            };

            expect(evaluate(rule, data)).toEqual(true);
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

        it('should pass data to nested rules', () => {
            const rule = ['or', ['==', '$.someValue', true], ['==', '$.someArrayValue.0', true]];
            const data = {
                someValue: false,
                someArrayValue: [true]
            };

            expect(evaluate(rule, data)).toEqual(true);
        });
    });

    describe('"includes" operator', () => {
        it('should return true if an array contains a specified value', () => {
            expect(evaluate(['includes', ['foo', 'bar', 'baz'], 'bar'])).toEqual(true);
        });

        it('should return false if an array does not contain a specified value', () => {
            expect(evaluate(['includes', ['foo', 'bar', 'baz'], 'biz'])).toEqual(false);
        });

        it('should return false if the value to be searched is false', () => {
            expect(evaluate(['includes', false, 'foo'])).toEqual(false);
        });

        it('should throw if the value to be searched is not an array', () => {
            expect(() => {
                evaluate(['includes', 'bar', 'bar']);
            }).toThrow(/^"includes" operator expected an array but received: bar$/);
        });
    });

    describe('Add operator', () => {
        it('should add an operator for use with "evaluate" function', () => {
            function eq(x, y) {
                return x === y || ['break;', false];
            }

            const obj = {eq};
            const spy = jest.spyOn(obj, 'eq');

            expect(addOperator('eq', obj.eq)).toBe(obj.eq);
            expect(evaluate(['eq', 1, 1])).toEqual(true);
            expect(spy).toHaveBeenCalled();
        });

        it('should handle an operator with zero arguments', () => {
            function returnAbc() {
                return 'abc';
            }

            const obj = {returnAbc};
            const returnAbcSpy = jest.spyOn(obj, 'returnAbc');

            addOperator('abc', obj.returnAbc);
            expect(evaluate(['abc'])).toEqual('abc');
            expect(returnAbcSpy).toHaveBeenCalled();
        });

        it('should handle an operator with one argument', () => {
            function returnInput(input) {
                return input;
            }

            const obj = {returnInput};
            const spy = jest.spyOn(obj, 'returnInput');

            addOperator('returnInput', obj.returnInput);

            const result = evaluate(['returnInput', 1]);

            expect(result).toEqual(1);
            expect(spy).toHaveBeenCalled();
        });

        it('should handle an operator with multiple arguments', () => {
            function add(input1, input2, accumulator) {
                return accumulator + input2;
            }

            const obj = {add};
            const spy = jest.spyOn(obj, 'add');

            addOperator('add', obj.add);
            expect(evaluate(['add', 1, 1])).toEqual(2);
            expect(evaluate(['add', 1, 2, 3, 4])).toEqual(10);
            expect(spy).toHaveBeenCalled();
        });

        it('should add a native method as an operator', () => {
            addOperator('random', Math.random, true);

            // evaluate(['random']) will return a random number between 0 and 1 e.g. 0.123456
            // As it's random, convert it to a string for the assertion
            const resultAsString = evaluate(['random']).toString();

            expect(resultAsString).toMatch(/0.[0-9]*/);
        });

        it('should add a native method as an operator that accepts arguments', () => {
            addOperator('floor', Math.floor);
            expect(evaluate(['floor', 5.95])).toEqual(5);
        });
    });

    describe('Add alias', () => {
        it('should add an alias for an existing operator', () => {
            addAlias('==', 'eq');
            addAlias('>', 'gt');

            expect(evaluate(['eq', 1, 1])).toEqual(true);
            expect(evaluate(['gt', 2, 1])).toEqual(true);
        });
    });
});
