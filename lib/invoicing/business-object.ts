import {BoHeaderData} from './bo-data.model';

export abstract class BusinessObject {
    abstract header: BoHeaderData;

    get ownerKey() {
        return `${this.header.objectType}/${this.header.id}`;
    }
}
