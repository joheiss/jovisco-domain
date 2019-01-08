import {Masterdata} from './masterdata';
import {ReceiverAddressData, ReceiverData, ReceiverHeaderData} from './receiver-data.model';
import {MasterdataStatus} from './masterdata-status.model';

export class Receiver extends Masterdata {

    public static createFromData(data: ReceiverData) {
        if (data) {
            const header = Receiver.extractHeaderFromData(data);
            const address = Receiver.extractAddressFromData(data);
            return new Receiver(header, address);
        }
        return undefined;
    }

    private static extractAddressFromData(data: ReceiverData): ReceiverAddressData {
        return data.address;
    }

    private static extractHeaderFromData(data: ReceiverData): ReceiverHeaderData {
        const {address: removed1, ...header} = data;
        return header;
    }

    constructor(public header: ReceiverHeaderData,
                public address: ReceiverAddressData) {
        super();
    }

    get data(): ReceiverData {
        return {
            ...this.header,
            address: this.address,
        };
    }

    public isActive(): boolean {
        return this.header.status ? this.header.status.valueOf() === MasterdataStatus.active.valueOf() : false;
    }

    public isPersistent(): boolean {
        return !!this.header.id;
    }
}
