import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('page_size') pageSize?: number,
    @Query('status') status?: string,
  ) {
    return this.projectsService.findAll(user.org_id, {
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 20,
      status,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@CurrentUser() user: any, @Body() dto: any) {
    return this.projectsService.create(user.org_id, user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Get(':id/tasks')
  @ApiOperation({ summary: 'Get tasks linked to a project' })
  getProjectTasks(@Param('id') id: string) {
    return this.projectsService.getProjectTasks(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a member to a project' })
  addMember(
    @Param('id') id: string,
    @Body() dto: { userId: string; role?: string },
  ) {
    return this.projectsService.addMember(id, dto.userId, dto.role);
  }
}
