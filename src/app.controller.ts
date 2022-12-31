import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getVacancies(@Query() query: Record<string, string>) {
    const {page} = query || {};
  
    return await this.appService.getVacancies(isNaN(Number(page)) ? 0: Number(page));
      
  }
}
