import {DocumentLinkType} from './document-link-type.model';

export interface DocumentLinkData {
    $id?: string;
    id?: string;
    name: string;
    path: string;
    type: DocumentLinkType;
    attachToEmail: boolean;
    owner?: string;
}

