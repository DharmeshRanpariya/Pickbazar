import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post("toggle")
  async create(@Req() req: any, @Body('product_id') product_id: string) {
    const userId = req.user.sub;
    if (!product_id) {
      throw new BadRequestException('Product ID is required');
    }
    return this.wishlistsService.create(userId, product_id);
  }

  @Get("my-wishlists")
  async findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.wishlistsService.findAll(userId);
  }

  @Get(':product_id')
  async findOne(@Req() req: any, @Param('product_id') product_id: string) {
    const userId = req.user.sub;
    return this.wishlistsService.findOne(userId, product_id);
  }
  

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    const userId = req.user.sub;
    return this.wishlistsService.remove(userId, id);
  }
}
