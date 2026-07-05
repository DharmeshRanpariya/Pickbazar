import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { CreateTermsAndConditionDto } from './dto/create-terms-and-condition.dto';
import { UpdateTermsAndConditionDto } from './dto/update-terms-and-condition.dto';
import { PermissionGuard } from 'src/guard/permission.guard';

@Controller('terms-and-conditions')
export class TermsAndConditionsController {
  constructor(
    private readonly termsAndConditionsService: TermsAndConditionsService,
  ) {}

  @Post()
  @UseGuards(PermissionGuard)
  create(@Body() createTermsAndConditionDto: CreateTermsAndConditionDto) {
    return this.termsAndConditionsService.create(createTermsAndConditionDto);
  }

  @Get()
  findAll(
    @Query('title') title: string,
    @Query('sortedBy') sortedBy: string,
    @Query('orderBy') orderBy: 'asc' | 'desc',
  ) {
    return this.termsAndConditionsService.findAll(title, sortedBy, orderBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.termsAndConditionsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  update(
    @Param('id') id: string,
    @Body() updateTermsAndConditionDto: UpdateTermsAndConditionDto,
  ) {
    return this.termsAndConditionsService.update(
      id,
      updateTermsAndConditionDto,
    );
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  remove(@Param('id') id: string) {
    return this.termsAndConditionsService.remove(id);
  }
}
