import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { Memory } from './entities/memory.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
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
}