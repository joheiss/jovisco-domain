import {VatData} from './vat-data.model';
import {SettingData} from './setting-data.model';
import {DateTime} from 'luxon';
import {DateUtility} from '../utils';

export class Vat {

    static findVatPercentage(vatSettings: SettingData, taxCode: string, issuedAt: Date): number {

        const percentage = vatSettings.values
            .find((vatSetting: VatData) => vatSetting.taxCode === taxCode && Vat.isValid(vatSetting, issuedAt))
            .percentage;
        console.log('Vat percentage found: ', percentage);
        return percentage;
    }

    private static isValid(vatSetting: VatData, issuedAt: Date): boolean {
        const validity = DateUtility.getIntervalFromDates(vatSetting.validFrom, vatSetting.validTo);
        return validity.contains(DateTime.fromJSDate(issuedAt));
    }
}
