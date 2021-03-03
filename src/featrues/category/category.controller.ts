import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
// import { ValidateObjectIDPipe } from 'src/common/pipes/validateObjectID.pipe';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryDto).catch((err) => {
      throw new ConflictException(err.message);
    });
  }

  @Public()
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(+id).catch((err) => {
      throw new NotFoundException(err.message);
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(+id, updateCategoryDto).catch((err) => {
      if (err.errno === 1062) {
        throw new BadRequestException(err.message);
      }
      throw new NotFoundException(err.message);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Category> {
    return this.categoryService.remove(+id).catch((err) => {
      throw new NotFoundException(err.message);
    });
  }
}
