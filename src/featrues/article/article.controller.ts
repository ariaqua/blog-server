import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('api/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Public()
  @Get()
  findAll(@Query('skip') skip: number, @Query('take') take: number) {
    return this.articleService.findAll(skip, take);
  }

  @Public()
  @Get('ids')
  findByIds(@Body() ids: number[]) {
    return this.articleService.findByIds(ids);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(+id).catch((err) => {
      throw new NotFoundException(err.message);
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(+id, updateArticleDto).catch((err) => {
      throw new NotFoundException(err.message);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.articleService.remove(+id).catch((err) => {
      throw new NotFoundException(err.message);
    });
  }
}
