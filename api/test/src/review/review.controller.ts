import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() request: any, @Body() createReviewDto: CreateReviewDto) {
    const userId = request.user.sub;
    return await this.reviewService.create(userId, createReviewDto);
  }

  @Get()
  async findAll() {
    return await this.reviewService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reviewService.findOne(id);
  }

  @Get('product/:productId')
  async findByProductId(@Param('productId') productId: string) {
    return await this.reviewService.findByProductId(productId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return await this.reviewService.update(id, updateReviewDto);
  }

  @Get(':productId')
  async findByUserIdAndProductId(
    @Param('productId') productId: string,
    @Req() request: any,
  ) {
    const userId = request.user.sub;
    return await this.reviewService.findByUserIdAndProductId(userId, productId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.reviewService.remove(id);
    return { message: `Review #${id} deleted successfully` };
  }
}
