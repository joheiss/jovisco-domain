import {NumberRangeData} from './number-range-data.model';

export class NumberRange {

    public static createFromData(data: NumberRangeData): NumberRange {
        if (!data) {
            throw new Error('invalid input');
        }
        return new NumberRange(data);
    }
    constructor(private data: NumberRangeData) {
    }

    get startAtId(): string | undefined {
        return this.data.startAtId;
    }
    get endAtId(): string | undefined {
        return this.data.endAtId;
    }
    get lastUsedId(): string | undefined {
        return this.data.lastUsedId;
    }

    set lastUsedId(id: string | undefined) {
        this.data.lastUsedId = id;
    }

    get nextId(): string | undefined {
        if (!this.startAtId) {
            return undefined;
        }
        if (!this.lastUsedId) {
            return this.startAtId;
        }
        return +this.lastUsedId >= +this.startAtId ? (+this.lastUsedId + 1).toString() : (this.startAtId);
    }
}
