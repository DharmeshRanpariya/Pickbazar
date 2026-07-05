import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { PermissionGuard } from 'src/guard/permission.guard';

@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  @UseGuards(PermissionGuard)
  async create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributesService.create(createAttributeDto);
  }

  @Get()
  @UseGuards(PermissionGuard)
  async findAll() {
    return this.attributesService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  async findOne(@Param('id') id: string) {
    return this.attributesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  async update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    return this.attributesService.update(id, updateAttributeDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  async remove(@Param('id') id: string) {
    return this.attributesService.remove(id);
  }
}
