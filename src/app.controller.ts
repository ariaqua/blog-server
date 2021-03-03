import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getIndex() {
    return this.appService.getIndex();
  }

  @Get(':id')
  @Render('detail')
  getDetail(@Param('id') id: string) {
    const result = this.appService.getDetail(+id);
    return result;
  }
}
