import {VatData} from './vat-data.model';
import {SettingData} from './setting-data.model';
import {DateTime} from 'luxon';
import {DateUtility} from '../utils';

export class Vat {

    public static findVatPercentage(vatSettings: SettingData, taxCode: string, issuedAt: Date): number {

        const vats = vatSettings.values.slice();

        const percentages = vats
            .filter((vatSetting: VatData) => vatSetting.taxCode === taxCode && Vat.isValid(vatSetting, issuedAt))
            .sort((a: VatData, b: VatData) => a.validTo.getTime() - b.validTo.getTime())
            .map((vatSetting: VatData) => vatSetting.percentage);

        return percentages[0] || 0;
    }

    private static isValid(vatSetting: VatData, issuedAt: Date): boolean {
        const validity = DateUtility.getIntervalFromDates(vatSetting.validFrom, vatSetting.validTo);
        return validity.contains(DateTime.fromJSDate(issuedAt));
    }
}
