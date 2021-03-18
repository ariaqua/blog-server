import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.create(createCommentDto);
  }

  @Public()
  @Get(':id')
  findByArticleId(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findByArticleId(id);
  }

  @Public()
  @Put()
  changeState(@Body() ids: number[]) {
    return this.commentService.changeState(ids);
  }

  @Public()
  @Delete()
  removeMany(@Body() ids: number[]) {
    return this.commentService.removeMany(ids);
  }
}
