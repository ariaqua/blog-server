import { IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-z, A-Z]\w{1,7}$/)
  username: string;

  @IsString()
  @Length(8, 16)
  password: string;
}
