import {DocumentLinkData} from './document-link-data.model';
import {DocumentLink} from './document-link';

export class DocumentLinkFactory {

    static fromData(data: DocumentLinkData): DocumentLink {
        return new DocumentLink(data);
    }
}
