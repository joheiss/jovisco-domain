import {BusinessObject} from './business-object';
import {MasterdataHeaderData} from './masterdata-data.model';

export abstract class Masterdata extends BusinessObject {
    abstract header: MasterdataHeaderData;

    abstract get data(): any;
}
