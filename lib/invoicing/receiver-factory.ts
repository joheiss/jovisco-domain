import {ReceiverAddressData, ReceiverData, ReceiverHeaderData} from './receiver-data.model';
import {Receiver} from './receiver';
import {ReceiversEntity} from './receivers-entity';

export class ReceiverFactory {

    static fromData(data: ReceiverData) {
        if (!data) throw new Error('invalid input');
        const header = ReceiverFactory.extractHeaderFromData(data);
        const address = ReceiverFactory.extractAddressFromData(data);
        return new Receiver(header, address);
    }

    static fromDataArray(receivers: ReceiverData []): Receiver[] {
        return receivers.map(r => ReceiverFactory.fromData(r));
    }

    static fromEntity(entity: ReceiversEntity): Receiver[] {
        return Object.keys(entity).map(id => ReceiverFactory.fromData(entity[id]));
    }

    private static extractAddressFromData(data: ReceiverData): ReceiverAddressData {
        const address = data.address || {};
        return Object.assign({}, Receiver.defaultValues().address, address) as ReceiverAddressData;
    }

    private static extractHeaderFromData(data: ReceiverData): ReceiverHeaderData {
        const {address: ignore1, ...header} = data;
        const {address: ignore2, ...defaultValues} = Receiver.defaultValues();
        return Object.assign({}, defaultValues, header) as ReceiverHeaderData;
    }
}
