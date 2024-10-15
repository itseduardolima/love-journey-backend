import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, ParseUUIDPipe, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { Memory } from './entities/memory.entity';
import { Response } from 'express';

@ApiTags('memories')
@Controller('memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new memory with photo upload' })
  @ApiResponse({ status: 201, description: 'The memory has been successfully created.', type: Memory })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        date: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        photo: {
          type: 'string',
          format: 'binary',
        },
        journeyId: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() createMemoryDto: CreateMemoryDto,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<Memory> {
    return await this.memoriesService.create(createMemoryDto, photo);
  }

  @Get()
  @ApiOperation({ summary: 'Get all memories' })
  @ApiResponse({ status: 200, description: 'Return all memories.', type: [Memory] })
  async findAll(): Promise<Memory[]> {
    return await this.memoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a memory by id' })
  @ApiResponse({ status: 200, description: 'Return the memory.', type: Memory })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Memory> {
    return await this.memoriesService.findOne(id);
  }

  @Get(':id/photo')
  @ApiOperation({ summary: 'Get the photo of a memory' })
  @ApiResponse({ status: 200, description: 'Return the photo of the memory.' })
  async getPhoto(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const { buffer, mimeType } = await this.memoriesService.getPhoto(id);
    res.set({
      'Content-Type': mimeType,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}