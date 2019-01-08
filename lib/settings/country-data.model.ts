export type CountryNames = { [key: string]: string };

export interface CountryData {
    isoCode: string;
    names: CountryNames;
}
