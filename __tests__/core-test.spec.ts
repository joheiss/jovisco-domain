import {inspect} from "util";
import {NumberRange, NumberRangeData, NumberRangeFactory} from '../lib/core';

describe('number range tests', () => {
    it('should create a number range', () => {
        const nr = mockNumberRange();
        console.log('number range: ', inspect(nr));
        expect(nr).toBeTruthy();
        expect(nr.startAtId).toEqual('99000');
        expect(nr.endAtId).toEqual('99999');
        expect(nr.nextId).toEqual('99000');
        nr.lastUsedId = '99000';
        expect(nr.nextId).toEqual('99001');
    });
});

const mockNumberRange = (): NumberRange => {

    const data: NumberRangeData = {
        id: 'tests',
        startAtId: '99000',
        endAtId: '99999',
    };
    return NumberRangeFactory.fromData(data);
};

