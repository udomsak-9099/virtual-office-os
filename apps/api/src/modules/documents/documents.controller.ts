import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all documents' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('page_size') pageSize?: number,
    @Query('status') status?: string,
    @Query('document_type') documentType?: string,
  ) {
    return this.documentsService.findAll(user.org_id, {
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 20,
      status,
      documentType,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  create(
    @CurrentUser() user: any,
    @Body()
    dto: {
      title: string;
      documentType?: string;
      departmentId?: string;
      projectId?: string;
      classification?: string;
      isControlled?: boolean;
    },
  ) {
    return this.documentsService.create(user.org_id, user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID with metadata and access rules' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Post(':id/versions')
  @ApiOperation({ summary: 'Add a new version to a document' })
  createVersion(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body()
    dto: {
      fileName: string;
      storageObjectKey: string;
      mimeType?: string;
      fileSizeBytes?: number;
    },
  ) {
    return this.documentsService.createVersion(id, user.id, dto);
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Get version history for a document' })
  getVersions(@Param('id') id: string) {
    return this.documentsService.getVersions(id);
  }

  @Post(':id/route-for-approval')
  @ApiOperation({ summary: 'Route document for approval' })
  routeForApproval(@CurrentUser() user: any, @Param('id') id: string) {
    return this.documentsService.routeForApproval(id, user.id);
  }
}
