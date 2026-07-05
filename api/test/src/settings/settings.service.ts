import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting, SettingDocument } from './entities/setting.entity';
import { join } from 'path';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name)
    private readonly settingModel: Model<SettingDocument>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const createdSetting = new this.settingModel(createSettingDto);
    const product = await createdSetting.save();

    return product;
  }

  async findAll(): Promise<{ options: any }> {
    const settings = await this.settingModel.find().exec();
    return { options: settings[0] };
  }


  async update(
    id: string,
    updateSettingDto: UpdateSettingDto,
  ): Promise<Setting> {
    const updatedSetting = await this.settingModel
      .findByIdAndUpdate(id, updateSettingDto, {
        new: true,
      })
      .exec();
    if (!updatedSetting) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }
    return updatedSetting;
  }
}
