import {NumberRangeData} from './number-range-data.model';

export class NumberRange {

    public static createFromData(data: NumberRangeData): NumberRange {
        return new NumberRange(data);
    }
    constructor(private data: NumberRangeData) {
    }

    get startAtId(): string {
        return this.data.startAtId;
    }
    get endAtId(): string {
        return this.endAtId;
    }
    get lastUsedId(): string {
        return this.data.lastUsedId;
    }

    set lastUsedId(id: string) {
        this.data.lastUsedId = id;
    }

    get nextId(): string {
        return +this.lastUsedId >= +this.startAtId ? (+this.lastUsedId + 1).toString() : (this.startAtId);
    }
}
