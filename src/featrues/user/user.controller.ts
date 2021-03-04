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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
// import { ValidateObjectIDPipe } from 'src/common/pipes/validateObjectID.pipe';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('api/user')
@Public()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ResponseMessage('create user success!')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto).catch((err) => {
      throw new ConflictException(err.message);
    });
  }

  @Get()
  @ResponseMessage('get user success!')
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ResponseMessage('get user success!')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id).catch((err) => {
      throw new NotFoundException(err.message);
    });
  }

  @Put(':id')
  @ResponseMessage('update user success!')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(+id, updateUserDto).catch((err) => {
      if (err.code === 11000) {
        throw new BadRequestException(err.message);
      }
      throw new NotFoundException(err.message);
    });
  }

  @Delete(':id')
  @ResponseMessage('delete user success!')
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(+id).catch((err) => {
      throw new NotFoundException(err.message);
    });
  }
}
