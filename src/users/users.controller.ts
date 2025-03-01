import {
  Body,
  Controller,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddHolidaysDto } from './dto/add-holidays-to-calendar.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post(':userId/calendar/holidays')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Add national holidays to user calendar' })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @ApiBody({ type: AddHolidaysDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully added national holidays.',
  })
  @ApiResponse({
    status: 404,
    description: 'Bad request due to validation errors.',
  })
  async addNationalHolidays(
    @Param('userId') userId: string,
    @Body() body: AddHolidaysDto
  ) {
    await this.userService.addNationalHolidays(userId, body);
  }
}
