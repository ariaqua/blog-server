import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOne({
      select: ['id', 'username', 'password'],
      where: { username },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.userRepository.findOneOrFail(id);
    this.userRepository.merge(userToUpdate, updateUserDto);
    return this.userRepository.save(userToUpdate);
  }

  async remove(id: number): Promise<User> {
    const userToRemove = await this.userRepository.findOneOrFail(id);
    return this.userRepository.remove(userToRemove);
  }
}
