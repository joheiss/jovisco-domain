import {Masterdata} from './masterdata';
import {ReceiverAddressData, ReceiverData, ReceiverHeaderData} from './receiver-data.model';
import {MasterdataStatus} from './masterdata-status.model';

export class Receiver extends Masterdata {

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

    constructor(public header: ReceiverHeaderData, public address: ReceiverAddressData) {
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
