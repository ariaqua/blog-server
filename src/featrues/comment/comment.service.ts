import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
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
      select: ['id', 'avatar', 'comment', 'alia', 'date', 'status'],
      relations: ['children'],
      order: { date: 1 },
    });
  }

  async changeState(ids: number[]) {
    const removeToComments = await this.commentRepository.findByIds(ids);
    removeToComments.forEach((comment) => {
      comment.status = false;
    });
    return this.commentRepository.save(removeToComments);
  }

  async removeOne(id: number) {
    const removeToComment = await this.commentRepository.findOneOrFail(id);
    return this.commentRepository.remove(removeToComment);
  }

  async removeMany(body: DeleteCommentDto[]) {
    const firstCommentIds = body.map((item) => {
      if (!item.parent) {
        return item.id;
      }
    });
    const replyCommentIds = body.map((item) => {
      if (item.parent) {
        return item.id;
      }
    });
    const removeToReplyComments = await this.commentRepository.findByIds(
      replyCommentIds,
    );
    const removeToFirstComments = await this.commentRepository.findByIds(
      firstCommentIds,
    );
    const r1 = await this.commentRepository.remove(removeToReplyComments);
    const r2 = await this.commentRepository.remove(removeToFirstComments);
    return [r1, r2];
  }
}
