import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() request: any, @Body() createCartDto: CreateCartDto) {
    const userId = request.user.sub;
    return this.cartService.addToCart(userId, createCartDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() request: any) {
    const userId = request.user.sub;
    return this.cartService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    let productId: string;
    let variationOptionsId: string | undefined;
    if (id.includes('.')) {
      [productId, variationOptionsId] = id.split('.');
    } else {
      productId = id;
    }
    return this.cartService.remove(productId, variationOptionsId);
  }
}
