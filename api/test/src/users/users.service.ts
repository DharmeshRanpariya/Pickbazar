import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './entities/user.entity';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as twilio from 'twilio';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address, AddressDocument } from './entities/address.entity';
import { pagination } from 'src/common/pagination/pagination';

@Injectable()
export class UsersService {
  private twilioClient: twilio.Twilio;
  private verificationSid: string;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
    private readonly configService: ConfigService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.verificationSid = this.configService.get<string>(
      'TWILIO_VERIFICATION_SERVICE_ID',
    );

    if (!accountSid || !authToken || !this.verificationSid) {
      throw new Error(
        'Twilio credentials are not set properly in environment variables.',
      );
    }

    this.twilioClient = twilio(accountSid, authToken);
  }

  async findCurrentUser(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .populate('address')
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findAll(
    page: number,
    limit: number,
    name: string,
    orderBy: string,
    sortedBy: string,
  ): Promise<any> {
    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }
    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));

    const filter: any = {};
    if (name) {
      filter.name = new RegExp(name, 'i');
    }

    const sort: any = {};
    if (orderBy) {
      sort[orderBy] = sortedBy === 'desc' ? -1 : 1;
    }

    const totalItems = await this.userModel.countDocuments(filter).exec();

    const users = await this.userModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .exec();
    return {
      data: users,
      ...pagination(totalItems, page, limit, users.length),
    };
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<{
    success: string;
    is_contact_exist: boolean;
    phoneNumber: string;
  }> {
    const { phoneNumber } = sendOtpDto;
    const formattedContact = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+${phoneNumber}`;

    try {
      await this.twilioClient.verify.v2
        .services(this.verificationSid)
        .verifications.create({
          to: formattedContact,
          channel: 'sms',
        });

      return {
        success: 'verify Number',
        is_contact_exist: true,
        phoneNumber,
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new BadRequestException('Failed to send OTP');
    }
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
    userId: string,
  ): Promise<{ success: string }> {
    const { phoneNumber, code } = verifyOtpDto;

    try {
      const result = await this.twilioClient.verify.v2
        .services(this.verificationSid)
        .verificationChecks.create({
          to: phoneNumber,
          code,
        });

      if (result.status === 'approved') {
        await this.userModel.findByIdAndUpdate(userId, {
          phoneNumber: phoneNumber,
        });
        return { success: 'Number verified and saved' };
      } else {
        throw new BadRequestException('Invalid OTP');
      }
    } catch (error) {
      throw new BadRequestException('Failed to verify OTP');
    }
  }

  async addAddress(
    userId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }
    const newAddress = new this.addressModel(createAddressDto);
    try {
      const savedAddress = await newAddress.save();
      user.address.push(savedAddress._id as any);
      await user.save();
      return user;
    } catch (error) {
      console.error('Error saving address:', error);
      throw new BadRequestException('Failed to save address');
    }
  }

  async updateAddressById(
    addressId: string,
    updateAddressDto: CreateAddressDto,
  ): Promise<Address> {
    const address = await this.addressModel.findById(addressId).exec();
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    address.title = updateAddressDto.title;
    address.city = updateAddressDto.city;
    address.state = updateAddressDto.state;
    address.zip = updateAddressDto.zip;
    address.street_address = updateAddressDto.street_address;
    address.type = updateAddressDto.type;
    return address.save();
  }

  async deleteAddressById(userId: string, addressId: string): Promise<Address> {
    if (!Types.ObjectId.isValid(addressId)) {
      throw new BadRequestException('Invalid address ID');
    }
    const objectId = new Types.ObjectId(addressId);
    const address = await this.addressModel.findById(objectId).exec();
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    await this.userModel
      .updateOne({ _id: userId }, { $pull: { address: objectId } })
      .exec();
    return this.addressModel.findByIdAndDelete(objectId).exec();
  }

  async isActive(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isActive = !user.isActive;
    return user.save();
  }
}
