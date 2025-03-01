import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countryService: CountriesService) {}

  @Get('available')
  @ApiOperation({ summary: 'Show available countries' })
  @ApiResponse({
    status: 200,
    description: 'Successfully show available countries.',
  })
  async getAvailableCountries() {
    return this.countryService.getAvailableCountries();
  }

  @Get(':countryCode/info')
  @ApiOperation({ summary: 'Get information about a specific country' })
  @ApiParam({
    name: 'countryCode',
    type: String,
    description: 'The country code of the country to get information about',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved country information.',
  })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getCountryInfo(@Param('countryCode') countryCode: string) {
    return this.countryService.getCountryInfo(countryCode);
  }
}
