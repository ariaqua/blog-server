import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

function encrypt(password: string) {
  return bcrypt.hash(password, 10);
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  avatar: string;

  @Column({ length: 8, unique: true })
  username: string;

  @Column({ length: 120, select: false })
  password: string;

  @CreateDateColumn({ select: false })
  create_date: Date;

  @VersionColumn({ select: false })
  version: number;

  @BeforeUpdate()
  @BeforeInsert()
  async encryptBeforeInsert() {
    this.password = await encrypt(this.password);
  }
}
