import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { AddHolidaysDto } from './dto/add-holidays-to-calendar.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async addNationalHolidays(userId: string, body: AddHolidaysDto) {
    const { countryCode, year, holidays } = body;
    try {
      const userIdNumber = parseInt(userId, 10);
      const holidaysUrl = this.configService.get<string>('DATE_NAGER_AT');

      const holidaysResponse = await firstValueFrom(
        this.httpService.get(`${holidaysUrl}/PublicHolidays/${year}/${countryCode}`)
      );

      const allHolidays = holidaysResponse.data;

      const filteredHolidays = allHolidays.filter((holiday) =>
        holidays.includes(holiday.name)
      );

      if (filteredHolidays.length > 0) {
        for (const holiday of filteredHolidays) {
          const existingHoliday = await this.prisma.holiday.findFirst({
            where: {
              userId: userIdNumber,
              date: holiday.date,
              name: holiday.name,
            },
          });
          if (existingHoliday) {
            console.log(
              `Holiday "${holiday.name}" already exists for user ${userId}.`
            );
            continue;
          }
          await this.prisma.holiday.create({
            data: {
              name: holiday.name,
              date: holiday.date,
              countryCode: holiday.countryCode,
              year: body.year,
              userId: userIdNumber,
            },
          });
        }
        return {
          message: 'Holidays have been successfully added to the calendar.',
        };
      } else {
        return {
          message: 'No matching holidays found to add to the calendar.',
        };
      }
    } catch (error) {
      console.error('Error fetching holidays from API:', error);
      throw new Error('Error fetching holidays from API');
    }
  }
}
