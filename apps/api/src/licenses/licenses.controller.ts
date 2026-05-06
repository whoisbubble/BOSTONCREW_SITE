import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LicenseRequestDto } from './dto/license-request.dto';
import { LicensesService } from './licenses.service';

@ApiTags('licenses')
@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Post('activate')
  @ApiOperation({ summary: 'Первая онлайн-активация ключа на устройстве' })
  activate(@Body() dto: LicenseRequestDto) {
    return this.licensesService.activate(dto);
  }

  @Post('check')
  @ApiOperation({ summary: 'Онлайн-проверка уже активированного ключа' })
  check(@Body() dto: LicenseRequestDto) {
    return this.licensesService.check(dto);
  }
}
