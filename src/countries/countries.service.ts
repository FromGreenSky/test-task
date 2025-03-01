import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface CountryResponse {
  commonName: string;
  borders: { officialName: string }[];
}

interface PopulationResponse {
  data: { populationCounts: any[] };
}

interface FlagResponse {
  data: { flag: string };
}

@Injectable()
export class CountriesService {
  private DateNagerUrl: string;
  private CountriesNowUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.DateNagerUrl = this.configService.get<string>('DATE_NAGER_AT');
    this.CountriesNowUrl = this.configService.get<string>('COUNTRIESNOW_SPACE');
  }

  async getAvailableCountries(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.DateNagerUrl}/AvailableCountries`)
      );
      return response.data;
    } catch (error) {
      throw new Error('Error fetching countries from API');
    }
  }

  async getCountryInfo(countryCode: string): Promise<any> {
    try {
      const countryResponse = await firstValueFrom(
        this.httpService.get<CountryResponse>(
          `${this.DateNagerUrl}/CountryInfo/${countryCode}`
        )
      );
      const countryName = countryResponse.data.commonName;
      const borders = countryResponse.data.borders;

      const borderCountryName = borders.map(
        (border: any) => border.officialName
      );

      const populationResponse = await firstValueFrom(
        this.httpService.post<PopulationResponse>(
          `${this.CountriesNowUrl}/population`,
          {
            country: countryName,
          }
        )
      );
      const population = populationResponse.data.data.populationCounts;

      const flagResponse = await firstValueFrom(
        this.httpService.post<FlagResponse>(
          `${this.CountriesNowUrl}/flag/images`,
          {
            country: countryName,
          }
        )
      );
      const flag = flagResponse.data.data.flag;
      return {
        borderCountryName,
        population,
        flag,
      };
    } catch (error) {
      throw new Error('Error fetching countries from API');
    }
  }
}
