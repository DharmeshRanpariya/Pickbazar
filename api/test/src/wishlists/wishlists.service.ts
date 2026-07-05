import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>,
  ) {}

  async create(userId: string, productId: string): Promise<any> {
    const existingWishlist = await this.wishlistModel
      .findOne({ userId, productId })
      .exec();

    if (existingWishlist) {
      await this.wishlistModel.deleteOne({ _id: existingWishlist._id }).exec();
      return { message: 'Wishlist item removed' };
    } else {
      const wishlist = new this.wishlistModel({ userId, productId });
      await wishlist.save();
      return { message: 'Wishlist item added', wishlist };
    }
  }

  async findAll(userId: string): Promise<any[]> {
    const wishlists = await this.wishlistModel
      .find({ userId })
      .populate('productId')
      .exec();

    return wishlists.map((wishlist) => ({
      userId: wishlist.userId,
      wishlistId: wishlist._id,
      product: wishlist.productId,
    }));
  }

  async findOne(userId: string, productId: string): Promise<Wishlist> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid Product ID format');
    }

    const wishlist = await this.wishlistModel
      .findOne({ userId, productId })
      .exec();

    return wishlist;
  }

  async remove(userId: string, id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const wishlist = await this.wishlistModel
      .findOneAndDelete({ _id: id, userId })
      .exec();
  }
}
