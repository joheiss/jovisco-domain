import {Receiver} from './receiver';
import {Dictionary} from '../core/dictionary';
import {ReceiverData} from './receiver-data.model';

export type ReceiversEntity = Dictionary<ReceiverData>;
// export type ReceiversEntity = { [id: string]: ReceiverData };

export function mapReceiversEntityToObjArray(entity: ReceiversEntity): Receiver[] {
    return Object.keys(entity).map(id => Receiver.createFromData(entity[id]));
}
