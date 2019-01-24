import {Masterdata} from './masterdata';
import {ReceiverAddressData, ReceiverData, ReceiverHeaderData} from './receiver-data.model';
import {MasterdataStatus} from './masterdata-status.model';

export class Receiver extends Masterdata {

    static createFromData(data: ReceiverData) {
        if (!data) {
            throw new Error('invalid input');
        }
        const header = Receiver.extractHeaderFromData(data);
        const address = Receiver.extractAddressFromData(data);
        return new Receiver(header, address);
    }

    static defaultValues(): any {
        return {
            objectType: 'receivers',
            status: MasterdataStatus.active,
            isDeletable: true,
            address: {
                country: 'DE'
            }
        };
    }

    private static extractAddressFromData(data: ReceiverData): ReceiverAddressData {
        const address = data.address || {};
        const defaultValues = Receiver.defaultValues();
        if (!address.country) {
            address.country = defaultValues.address.country;
        }
        return address;
    }

    private static extractHeaderFromData(data: ReceiverData): ReceiverHeaderData {
        const {address: removed1, ...header} = data;
        const defaultValues = Receiver.defaultValues();
        if (!header.objectType) {
            header.objectType = defaultValues.objectType;
        }
        if (header.status === undefined) {
            header.status = defaultValues.status;
        }
        if (header.isDeletable === undefined) {
            header.isDeletable = defaultValues.isDeletable;
        }
        return header;
    }

    private constructor(public header: ReceiverHeaderData, public address: ReceiverAddressData) {
        super();
    }

    get data(): ReceiverData {
        return {
            ...this.header,
            address: this.address,
        };
    }

    isActive(): boolean {
        return this.header.status === MasterdataStatus.active;
    }

    isPersistent(): boolean {
        return !!this.header.id;
    }
}
