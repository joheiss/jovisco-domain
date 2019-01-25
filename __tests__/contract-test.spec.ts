import {Contract, ContractData, ContractItem} from '../lib/invoicing';
import {mockContract} from './mock-contract.factory';
import {DateTime} from 'luxon';

describe('contract tests', () => {

    it('should create a contract from default values', () => {
        const contract = Contract.createFromData(Contract.defaultValues());
        expect(contract).toBeTruthy();
    });

    it('should create a contract containing default values, if an empty object has been provided', () => {
        const data = {} as ContractData;
        const contract = Contract.createFromData(data);
        expect(contract).toBeTruthy();
        expect(contract.data).toEqual(Contract.defaultValues());
    });

    it('should create a contract from mock data', () => {
        const data = mockContract().data;
        const contract = Contract.createFromData(data);
        expect(contract).toBeTruthy();
        expect(contract.items).toHaveLength(1);
        expect(contract.data).toEqual(data);
    });

    describe('test getters and setters', () => {

        let contract: Contract;

        beforeEach(() => {
            const data = mockContract().data;
            contract = Contract.createFromData(data);
        });

        it('should return the contract duration in days', () => {
            expect(contract.term.durationDays).toBeGreaterThanOrEqual(89);
            expect(contract.term.durationDays).toBeLessThanOrEqual(92);
        });

        it('should return a new item with id = 2', () => {
            expect(contract.buildNewItemFromTemplate()).toEqual({ id: 2 });
        });
    });

    describe('contract item tests', () => {

        let contract: Contract;

        beforeEach(() => {
            contract = mockContract();
        });

        it('should create an item from data', () => {
            const data = {
                id: 1,
                description: 'Test',
                priceUnit: 'Tage',
                pricePerUnit: 1000.00,
                cashDiscountAllowed: true
            };
            const item = ContractItem.createFromData(data);
            expect(item).toBeTruthy();
            expect(item.data).toEqual(data);
        });

        it('should create an item from empty data', () => {
            const data = {};
            const item = ContractItem.createFromData(data);
            expect(item).toBeTruthy();
            expect(item.data).toEqual(ContractItem.defaultValues());
        });

        it('should create an item from default values', () => {
            const data = ContractItem.defaultValues();
            const item = ContractItem.createFromData(data);
            expect(item).toBeTruthy();
            expect(item.data).toEqual(ContractItem.defaultValues());
        });
    });
});
