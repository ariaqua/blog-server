import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentRepository.save(createCommentDto);
  }

  findByArticleId(id: number) {
    return this.commentRepository.find({
      where: { article: id },
      select: ['id', 'avatar', 'comment'],
      relations: ['children'],
    });
  }
}
