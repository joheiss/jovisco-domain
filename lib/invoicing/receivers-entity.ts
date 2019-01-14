import {ReceiverData} from './receiver-data.model';
import {Receiver} from './receiver';

export type ReceiversEntity = { [id: string]: ReceiverData };

export function mapReceiversEntityToObjArray(entity: ReceiversEntity): Receiver[] {
    return Object.keys(entity).map(id => Receiver.createFromData(entity[id]));
}
