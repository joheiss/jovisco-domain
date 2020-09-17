import {Vat, VatData} from '../lib/settings';
import {mockAllVatSettings} from './mock-settings.factory';

describe('settings tests', () => {

    it('should find the currently valid vat percentage for tax code DE_full', () => {
        const vats = mockAllVatSettings();
        expect(Vat.findVatPercentage(vats, 'DE_full', new Date())).toBe(19.0);
    });

    it('should return true if setting is currently valid, false if not', () => {
        const vatSetting = {
            taxCode: 'DE_full',
            validFrom: new Date(2019, 0, 1),
            validTo: new Date(2019, 0, 31),
            percentage: 11.11
        } as VatData;

        expect(Vat['isValid'](vatSetting, new Date(2019, 0, 2))).toBeTruthy();
        expect(Vat['isValid'](vatSetting, new Date(2019, 1, 1))).toBeFalsy();
    })
});
