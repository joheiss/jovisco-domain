import {BoHeaderData} from './bo-data.model';
import {MasterdataStatus} from './masterdata-status.model';

export interface MasterdataHeaderData extends BoHeaderData {
    status?: MasterdataStatus;
}
