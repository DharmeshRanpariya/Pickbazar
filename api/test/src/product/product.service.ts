import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { pagination } from '../common/pagination/pagination';
import {
  FlashSale,
  FlashSaleType,
} from '../flash-sale/entities/flash-sale.entity';
import { FlashSaleService } from '../flash-sale/flash-sale.service';
import { join } from 'path';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly flashSaleService: FlashSaleService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    const product = await createdProduct.save();

    return product;
  }

  async findAll(
    page: number,
    limit: number,
    filters: { name?: string; categories?: string[]; product_type?: string },
  ): Promise<any> {
    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }
    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));

    const filterQuery: any = {};

    if (filters.name) {
      filterQuery.name = { $regex: new RegExp(filters.name, 'i') };
    }
    if (filters.product_type) {
      filterQuery.product_type = {
        $regex: new RegExp(filters.product_type, 'i'),
      };
    }

    let products: any[] = [];

    products = await this.productModel
      .find(filterQuery)
      .populate('categories')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    if (filters.categories) {
      products = products.filter((product) =>
        product.categories.some((category) =>
          filters.categories.some((filterCategory) =>
            new RegExp(filterCategory, 'i').test(category.name),
          ),
        ),
      );
    }

    const activeFlashSales = await this.flashSaleService.findActiveFlashSales();
    if (activeFlashSales.length > 0) {
      products = await this.applyFlashSaleToProducts(
        products,
        activeFlashSales,
      );
    }

    const totalItems = await this.productModel.countDocuments(filterQuery);

    return {
      data: products,
      ...pagination(totalItems, page, limit, products.length),
    };
  }

  async findLowAndOutOfStock(
    page: number,
    limit: number,
    filters: { name?: string; categories?: string[]; product_type?: string },
  ): Promise<any> {
    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }

    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));

    const filterQuery: any = {
      $or: [
        { product_type: 'simple', quantity: { $gte: 0, $lte: 10 } },
        {
          product_type: 'variable',
          variationOptions: { $elemMatch: { quantity: { $gte: 0, $lte: 10 } } },
        },
      ],
    };

    if (filters.name) {
      filterQuery.name = { $regex: new RegExp(filters.name, 'i') };
    }

    if (filters.product_type) {
      filterQuery.product_type = filters.product_type;
    }

    const totalItems = await this.productModel.aggregate([
      { $match: filterQuery },
      { $count: 'count' },
    ]);

    const data = await this.productModel.aggregate([
      { $match: filterQuery },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    let products = data
      .map((item) => {
        if (item.product_type === 'variable') {
          const variations = item.variationOptions
            .filter(
              (variation) =>
                variation.quantity >= 0 && variation.quantity <= 10,
            )
            .map((variation) => ({
              _id: item._id,
              image: item.image,
              gallery: item.gallery,
              categories: item.categories,
              name: `${item.name} - ${variation.title}`,
              sku: variation.sku || item.sku,
              product_type: item.product_type,
              quantity: variation.quantity,
              unit: item.unit,
              price: variation.sale_price,
              status: item.status,
            }));
          return variations;
        } else {
          return {
            _id: item._id,
            image: item.image,
            gallery: item.gallery,
            categories: item.categories,
            name: item.name,
            sku: item.sku,
            product_type: item.product_type,
            quantity: item.quantity,
            unit: item.unit,
            price: item.sale_price,
            status: item.status,
          };
        }
      })
      .flat();

    if (filters.categories) {
      const categoryFilterRegexes = filters.categories.map(
        (category) => new RegExp(category, 'i'),
      );

      products = products.filter((product) =>
        product.categories.some((category) =>
          categoryFilterRegexes.some((regex) => regex.test(category.name)),
        ),
      );
    }

    const totalItemCount = totalItems[0]?.count || 0;

    return {
      data: products,
      ...pagination(totalItemCount, page, limit, products.length),
    };
  }

  async findDrafts(page: number, limit: number, name: string): Promise<any> {
    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }

    const filterQuery: any = { status: 'draft' };

    if (name) {
      filterQuery.name = { $regex: new RegExp(name, 'i') };
    }

    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));

    const totalItems = await this.productModel
      .countDocuments(filterQuery)
      .exec();
    const products = await this.productModel
      .find(filterQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return {
      data: products,
      ...pagination(totalItems, page, limit, products.length),
    };
  }

  async findOne(id: string, applyFlashSale: boolean = true): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('categories')
      .populate({
        path: 'variations.attribute_value_id',
        model: 'Attribute',
      })
      .exec();

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    if (applyFlashSale) {
      const activeFlashSales = await this.flashSaleService.findActiveFlashSales();
      if (activeFlashSales.length > 0) {
        return this.applyFlashSaleToProduct(product, activeFlashSales);
      }
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productModel.findById(id).exec();
    if (!existingProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }
  
    if (existingProduct.product_type === 'simple') {
      existingProduct.quantity = updateProductDto.quantity ?? existingProduct.quantity;
      Object.assign(existingProduct, updateProductDto);
      await existingProduct.save();
    } else if (existingProduct.product_type === 'variable') {
      if (updateProductDto.variationOptions) {
        existingProduct.variationOptions.forEach((option) => {
          const variationUpdate = updateProductDto.variationOptions?.find(
            (update) =>
              update['_id'] &&
              option['_id'] &&
              update['_id'].toString() === option['_id'].toString(),
          );
          if (variationUpdate) {
            option.quantity = variationUpdate.quantity;
          }
        });
      }

      const totalVariationQuantity = existingProduct.variationOptions.reduce(
        (total, option) => total + option.quantity,
        0
      );
      existingProduct.quantity = totalVariationQuantity;
      Object.assign(existingProduct, {
        ...updateProductDto,
        quantity: existingProduct.quantity,
      });
      await existingProduct.save();
    }
  
    return existingProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return deletedProduct;
  }

  async applyFlashSaleToProducts(
    products: (Product & { _id: any })[],
    flashSales: FlashSale[],
  ): Promise<(Product & { _id: any })[]> {
    if (!flashSales.length) {
      return products;
    }

    return products.map((product) =>
      this.applyFlashSaleToProduct(product, flashSales),
    );
  }

  applyFlashSaleToProduct(
    product: Product & { _id: any },
    flashSales: FlashSale[],
  ): Product & { _id: any } {
    if (!flashSales || flashSales.length === 0) return product;

    for (const sale of flashSales) {
      if (sale.type && sale.rate) {
        const roundPrice = (price: number) => {
          const decimalPart = price % 1;
          if (decimalPart > 0.05) {
            return Math.ceil(price);
          } else {
            return Math.floor(price);
          }
        };

        if (product.product_type === 'simple') {
          if (sale.type === FlashSaleType.FIXRATE) {
            product.sale_price = Math.max(0, product.sale_price - sale.rate);
          } else if (sale.type === FlashSaleType.PERCENTAGE) {
            product.sale_price = Math.max(
              0,
              product.sale_price * ((100 - sale.rate) / 100),
            );
          }
          product.sale_price = roundPrice(product.sale_price);
        } else if (
          product.product_type === 'variable' &&
          product.variationOptions?.length
        ) {
          product.variationOptions = product.variationOptions.map(
            (variation) => {
              if (sale.type === FlashSaleType.FIXRATE) {
                variation.sale_price = Math.max(
                  0,
                  variation.sale_price - sale.rate,
                );
              } else if (sale.type === FlashSaleType.PERCENTAGE) {
                variation.sale_price = Math.max(
                  0,
                  variation.sale_price * ((100 - sale.rate) / 100),
                );
              }
              variation.sale_price = roundPrice(variation.sale_price);
              return variation;
            },
          );
        }
      }
    }
    return product;
  }
}
