import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const { productId } = createReviewDto;

    const existingReview = await this.reviewModel.findOne({
      userId,
      productId,
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product.');
    }

    const createdReview = new this.reviewModel({
      ...createReviewDto,
      userId,
    });
    const review = await createdReview.save();

    const reviews = await this.reviewModel.find({ productId });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    const roundedAverageRating = parseFloat(averageRating.toFixed(1));

    await this.productModel.findByIdAndUpdate(productId, {
      $set: {
        review: roundedAverageRating,
      },
    });

    return review;
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().populate('productId userId').exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(id)
      .populate('productId userId')
      .exec();
    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    return review;
  }

  async findByProductId(productId: string): Promise<Review[]> {
    const reviews = await this.reviewModel
      .find({ productId })
      .populate('userId')
      .exec();

    return reviews;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      id,
      updateReviewDto,
      {
        new: true,
      },
    );
    if (!updatedReview) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    return updatedReview;
  }

  async findByUserIdAndProductId(
    userId: string,
    productId: string,
  ): Promise<Review> {
    const review = await this.reviewModel
      .findOne({ userId, productId })
      .populate('productId userId')
      .exec();

    if (!review) {
      throw new NotFoundException(
        `No review found for user with ID ${userId} and product with ID ${productId}`,
      );
    }

    return review;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Review #${id} not found`);
    }
  }
}
