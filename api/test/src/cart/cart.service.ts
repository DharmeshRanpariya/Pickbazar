import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { ProductService } from 'src/product/product.service';
import { options } from 'pdfkit';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly productService: ProductService,
  ) {}

  async addToCart(
    userId: string,
    createCartDto: CreateCartDto,
  ): Promise<{ cart: Cart | null; product: any }> {
    const { productId: data, quantity } = createCartDto;

    let productId: string;
    let variationOptionsId: string | undefined;

    if (data.includes('.')) {
      [productId, variationOptionsId] = data.split('.');
    } else {
      productId = data;
    }

    const product = await this.productService.findOne(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    let variationOption: any = null;

    if (product.product_type === 'variable' && variationOptionsId) {
      variationOption = product.variationOptions.find(
        (option: any) => option?._id.toString() === variationOptionsId,
      );
      if (!variationOption) {
        throw new Error('Variation option not found');
      }
    }

    const existingCart = await this.cartModel
      .findOne({ userId, productId, variationOptionsId })
      .exec();
      
      if (quantity > 10) {
        throw new BadRequestException('Cannot add more than 10 units of this product to the cart');
      }
      
    if (quantity === 0) {
      if (existingCart) {
        await this.cartModel.deleteOne({ _id: existingCart._id }).exec();
      }
      return { cart: null, product };
    }

    const total = variationOption
      ? variationOption.sale_price * quantity ||
        variationOption.price * quantity
      : product.sale_price * quantity || product.price * quantity;

    if (existingCart) {
      existingCart.quantity = quantity;
      existingCart.total = total;
      await existingCart.save();
      return { cart: existingCart, product };
    } else {
      const createdCart = new this.cartModel({
        productId,
        quantity,
        userId,
        variationOptionsId,
        total,
      });
      const savedCart = await createdCart.save();
      return { cart: savedCart, product };
    }
  }

  async findAll(
    userId: string,
  ): Promise<{ items: any[]; totalPrice: number; totalitem: number }> {
    const cartItems = await this.cartModel
      .find({ userId })
      .populate('productId')
      .exec();
    let totalPrice = 0;
    const totalitem = cartItems.length;
    const items = cartItems.map((item) => {
      let product;
      if (item?.productId?.product_type === 'variable') {
        let variationOptionsData = item.productId.variationOptions.find(
          (option) =>
            (option as any)?._id.toString() === item.variationOptionsId,
        );
        product = {
          _id: `${(item.productId as any)._id.toString()}.${item.variationOptionsId}`,
          name: `${item.productId.name} - ${variationOptionsData.title}`,
          image: item.productId.image,
          stock: variationOptionsData.quantity,
          sale_price: variationOptionsData.sale_price,
          price: variationOptionsData.price,
          variationId: variationOptionsData,
        };
      } else {
        product = item.productId;
      }

      totalPrice += item.total;
      return {
        userId: item.userId,
        product: product,
        quantity: item.quantity,
        total: item.total,
      };
    });

    return { items, totalPrice, totalitem };
  }

  async findOne(id: string): Promise<{ cart: Cart; product: any }> {
    const cart = await this.cartModel.findById(id).exec();
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    const product = await this.productService.findOne(
      cart.productId.toString(),
    );
    return { cart, product };
  }

  async remove(productId: string, variationOptionsId?: string): Promise<Cart> {
    let deletedCart: Cart | null;

    if (variationOptionsId) {
      deletedCart = await this.cartModel
        .findOneAndDelete({
          productId: productId,
          variationOptionsId: variationOptionsId,
        })
        .exec();
    } else {
      deletedCart = await this.cartModel
        .findOneAndDelete({ productId: productId })
        .exec();
    }

    if (!deletedCart) {
      throw new NotFoundException(
        `Cart with product ID ${productId} not found`,
      );
    }
    return deletedCart;
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartModel.deleteMany({ userId }).exec();
  }
}
