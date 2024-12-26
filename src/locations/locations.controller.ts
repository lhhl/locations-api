import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ERROR_MESSAGES } from 'constants/message';
import { ResourceNotFoundInterceptor } from 'src/common/interceptors/resource-not-found.interceptor';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ResourceNotFoundInterceptor)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.locationsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(ResourceNotFoundInterceptor)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const childrenCount = await this.locationsService.countChildren(id);
    if (childrenCount > 0) {
      throw new BadRequestException(
        ERROR_MESSAGES.DELETE_RESOURCE_WITH_CHILDREN,
      );
    }
    return this.locationsService.remove(id);
  }
}
