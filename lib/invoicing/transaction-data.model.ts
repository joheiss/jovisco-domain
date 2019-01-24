import {BoHeaderData} from './bo-data.model';

export interface TransactionData extends TransactionHeaderData {
    items?: TransactionItemData[];
}

export interface TransactionHeaderData extends BoHeaderData {
    issuedAt: Date;
}

export interface TransactionItemData {
    id?: number;
    headerRef?: any;
    parentRef?: any;
}

