import {MasterdataStatus, Receiver, ReceiverData} from '../lib/invoicing';
import {mockReceiver} from './mock-receiver.factory';

describe('receiver tests', () => {

    it('should create a receiver from default values', () => {
        const receiver = Receiver.createFromData(Receiver.defaultValues());
        expect(receiver).toBeTruthy();
    });

    it('should create a receiver containing default values, if an empty object has been provided', () => {
        const data = {} as ReceiverData;
        const receiver = Receiver.createFromData(data);
        expect(receiver).toBeTruthy();
        expect(receiver.data).toEqual(Receiver.defaultValues());
    });

    it('should create a receiver from mock data', () => {
        const data = mockReceiver().data;
        const receiver = Receiver.createFromData(data);
        expect(receiver).toBeTruthy();
        expect(receiver.data).toEqual(data);
    });

    describe('test getters and setters', () => {

        let receiver: Receiver;

        beforeEach(() => {
            const data = mockReceiver().data;
            receiver = Receiver.createFromData(data);
        });

        it('should return true if receiver is active, false if it is inactive', () => {
            expect(receiver.isActive()).toBeTruthy();
            receiver.header.status = MasterdataStatus.inactive;
            expect(receiver.isActive()).toBeFalsy();
        });

        it('should return true if receiver is persistent, false if not', () => {
            expect(receiver.isPersistent()).toBeTruthy();
            receiver.header.id = undefined;
            expect(receiver.isPersistent()).toBeFalsy();
        });
    });
});
