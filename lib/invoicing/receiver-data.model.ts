import {MasterdataHeaderData} from './masterdata-data.model';

export interface ReceiverData extends ReceiverHeaderData {
    address?: ReceiverAddressData;
}

export interface ReceiverHeaderData extends MasterdataHeaderData {
    name?: string;
    nameAdd?: string;
    logoUrl?: string;
}

export interface ReceiverAddressData {
    country?: string;
    postalCode?: string;
    city?: string;
    street?: string;
    email?: string;
    phone?: string;
    fax?: string;
    webSite?: string;
}
