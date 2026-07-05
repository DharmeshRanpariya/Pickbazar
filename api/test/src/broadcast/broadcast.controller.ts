import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';
import { UpdateBroadcastDto } from './dto/update-broadcast.dto';
@Controller('broadcast')
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Post('send-email')
  sendBroadcastEmail(
    @Body('subject') subject: string,
    @Body('message') message: string,
  ) {
    return this.broadcastService.sendBroadcastEmail(subject, message);
  }

  @Post()
  create(@Body() createBroadcastDto: CreateBroadcastDto) {
    return this.broadcastService.create(createBroadcastDto);
  }

  @Get()
  findAll() {
    return this.broadcastService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.broadcastService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBroadcastDto: UpdateBroadcastDto) {
    return this.broadcastService.update(id, updateBroadcastDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.broadcastService.remove(id);
  }
}
