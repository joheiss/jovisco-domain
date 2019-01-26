import {
    MasterdataStatus,
    Receiver,
    ReceiverData,
    ReceiversEntity,
    ReceiverSummariesFactory,
    ReceiverSummariesData, ReceiverFactory
} from '../lib/invoicing';
import {mockContractsEntity} from './mock-contract.factory';
import {mockInvoicesEntity} from './mock-invoice.factory';

export const mockReceiver = (): Receiver => {

    const data: ReceiverData = {
        id: '1901',
        organization: 'GHQ',
        name: 'Test Receiver 1901',
        address: {
            postalCode: '77777',
            city: 'Testingen',
            street: 'Test Allee 7',
            email: 'test@test.example.de',
            phone: '+49 777 7654321',
            fax: '+49 777 7654329',
            webSite: 'http://www.test.example.de'
        }
    };
    return ReceiverFactory.fromData(data);
};

export const mockAllReceivers = (): ReceiverData[] => {
    return [
        getBaseReceiver('1901', 'Test AG', 'officium@test-ag.de'),
        getBaseReceiver('1902', 'Test GmbH', 'buero@test-gmbh.de')
    ];
};

const getBaseReceiver = (id: string, name: string, email: string): ReceiverData => {
    return {
        id: id,
        objectType: 'receivers',
        organization: 'THQ',
        name: name,
        status: MasterdataStatus.active,
        address: {
            country: 'DE',
            postalCode: '77777',
            city: 'Testlingen',
            street: 'Testgasse 1',
            email: email,
            phone: '+49 777 12345678',
            fax: '+49 777 12345678'
        }
    };
};

export const mockReceiversEntity = (): ReceiversEntity => {
    const allReceivers = mockAllReceivers();
    const entity = {} as ReceiversEntity;
    // @ts-ignore
    allReceivers.map(r => entity[r.id] = r);
    return entity;
};

export const mockReceiverSummaries = (): ReceiverSummariesData => {
    const contracts = mockContractsEntity();
    const receivers = mockReceiversEntity();
    const invoices = mockInvoicesEntity();
    return ReceiverSummariesFactory.create(receivers, contracts, invoices);
};

