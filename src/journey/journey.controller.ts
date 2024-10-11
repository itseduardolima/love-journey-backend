import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JourneyService } from './journey.service';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Journey } from './entities/journey.entity';
import { ApiFile } from 'src/common/decorators/api-file.decorator';


@ApiTags('journey')
@Controller('journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new journey' })
  @ApiResponse({
    status: 201,
    description: 'The journey has been successfully created.',
    type: Journey,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createJourneyDto: CreateJourneyDto): Promise<Journey> {
    return await this.journeyService.create(createJourneyDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a journey by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The found journey.',
    type: Journey,
  })
  @ApiResponse({ status: 404, description: 'Journey not found.' })
  async findOne(@Param('id') id: string): Promise<Journey> {
    return await this.journeyService.findOne(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload an image' })
  @ApiFile()
  uploadFile(@UploadedFile() file) {
    return { filename: file.filename };
  }
}
