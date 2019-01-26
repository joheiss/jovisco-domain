import {DocumentLink} from '../lib/documents/document-link';
import {DocumentLinkFactory, DocumentLinkType} from '../lib/documents';

describe('documents tests', () => {

    it('should create a document link', () => {
        const docLink = mockDocumentLink();
        console.log('document link: ', docLink);
        expect(docLink).toBeTruthy();
        expect(docLink.type).toEqual(DocumentLinkType.Invoice);
    });
});

const mockDocumentLink = (): DocumentLink => {

    const data = {
        $id: '2OKzIpO58iM19IR7u2ve',
        name: '5901.pdf',
        owner: 'invoices/5901',
        path: 'docs/invoices/5901/5901.pdf',
        type: DocumentLinkType.Invoice,
        attachToEmail: true
    };

    return DocumentLinkFactory.fromData(data);
};
