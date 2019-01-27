import {DocumentLinkData} from './document-link-data.model';
import {DocumentLink} from './document-link';

export class DocumentLinkFactory {

    static fromData(data: DocumentLinkData): DocumentLink {
        return new DocumentLink(data);
    }

    static fromDataArray(docLinks: DocumentLinkData []): DocumentLink[] {
        return docLinks.map(dl => DocumentLinkFactory.fromData(dl));
    }
}
