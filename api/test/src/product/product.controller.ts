import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PermissionGuard } from 'src/guard/permission.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(PermissionGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name?: string,
    @Query('categories') categories?: string,
    @Query('product_type') product_type?: string,
  ) {
    const filterParams = {
      name,
      categories: categories ? categories.split(',') : undefined,
      product_type,
    };
    return this.productService.findAll(page, limit, filterParams);
  }

  @Get('stock-status')
  @UseGuards(PermissionGuard)
  findLowAndOutOfStock(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name?: string,
    @Query('categories') categories?: string,
    @Query('product_type') product_type?: string,
  ) {
    const filterParams = {
      name,
      categories: categories ? categories.split(',') : undefined,
      product_type,
    };
    return this.productService.findLowAndOutOfStock(page, limit, filterParams);
  }

  @Get('draft-products')
  findDrafts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name?: string
  ) {
    return this.productService.findDrafts(page, limit, name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
