import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOneOrFail(id);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const categoryToUpdate = await this.categoryRepository.findOneOrFail(id);
    this.categoryRepository.merge(categoryToUpdate, updateCategoryDto);
    return this.categoryRepository.save(categoryToUpdate);
  }

  async remove(id: number): Promise<Category> {
    const categoryToRemove = await this.categoryRepository.findOneOrFail(id);
    return this.categoryRepository.remove(categoryToRemove);
  }
}
