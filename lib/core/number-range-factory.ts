import {NumberRangeData} from './number-range-data.model';
import {NumberRange} from './number-range';

export class NumberRangeFactory {

    static fromData(data: NumberRangeData): NumberRange {
        if (!data) {
            throw new Error('invalid input');
        }
        return new NumberRange(data);
    }

    static fromDataArray(numberRanges: NumberRangeData []): NumberRange[] {
        return numberRanges.map(nr => NumberRangeFactory.fromData(nr));
    }
}
