import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { HttpModule } from '@nestjs/axios';
import { CountriesController } from './countries.controller';

@Module({
  imports: [HttpModule],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
