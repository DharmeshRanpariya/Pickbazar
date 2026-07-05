import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { PermissionGuard } from 'src/guard/permission.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMe(@Req() request: any): Promise<User> {
    const userId = request.user.sub;
    return this.usersService.findCurrentUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/update')
  updateMe(
    @Req() request: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const userId = request.user.sub;
    return this.usersService.update(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/delete')
  removeMe(@Req() request: any): Promise<User> {
    const userId = request.user.sub;
    return this.usersService.remove(userId);
  }

  @Get('findall')
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string,
    @Query('orderBy') orderBy: string,
    @Query('sortedBy') sortedBy: string,
  ): Promise<User[]> {
    return this.usersService.findAll(page, limit, name, orderBy, sortedBy);
  }

  @Get('findone/:id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }

  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<any> {
    return this.usersService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  @UseGuards(JwtAuthGuard)
  async verifyOtp(
    @Req() req: any,
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<any> {
    const userId = req.user.sub;
    return this.usersService.verifyOtp(verifyOtpDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-address')
  async addAddress(
    @Req() req: any,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<User> {
    const userId = req.user.sub;
    return this.usersService.addAddress(userId, createAddressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-address/:addressId')
  async updateAddressById(
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: CreateAddressDto,
  ): Promise<Address> {
    return this.usersService.updateAddressById(addressId, updateAddressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-address/:addressId')
  async deleteAddressById(
    @Req() req: any,
    @Param('addressId') addressId: string,
  ): Promise<Address> {
    const userId = req.user.sub;
    return this.usersService.deleteAddressById(userId, addressId);
  }

  @UseGuards(PermissionGuard)
  @Post('isActive')
  async isActive(@Body('id') userId: string): Promise<User> {
    return this.usersService.isActive(userId);
  }
}
