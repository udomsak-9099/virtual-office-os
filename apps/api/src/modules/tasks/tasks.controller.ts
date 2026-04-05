import {
  Controller, Get, Post, Patch, Body, Param, Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List tasks with optional filters' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('page_size') pageSize?: number,
    @Query('status') status?: string,
    @Query('assignee_user_id') assigneeUserId?: string,
    @Query('project_id') projectId?: string,
    @Query('department_id') departmentId?: string,
  ) {
    return this.tasksService.findAll(user.org_id, {
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 20,
      status,
      assigneeUserId,
      projectId,
      departmentId,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@CurrentUser() user: any, @Body() dto: any) {
    return this.tasksService.create(user.org_id, user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: any) {
    return this.tasksService.update(id, user.id, dto);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark a task as complete' })
  complete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tasksService.complete(id, user.id);
  }

  @Post(':id/reopen')
  @ApiOperation({ summary: 'Reopen a completed task' })
  reopen(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tasksService.reopen(id, user.id);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign a task to a user' })
  assign(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: { assignee_id: string }) {
    return this.tasksService.assign(id, dto.assignee_id, user.id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a task' })
  getComments(@Param('id') id: string) {
    return this.tasksService.getComments(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  addComment(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: { body: string }) {
    return this.tasksService.addComment(id, { body: dto.body, author_id: user.id });
  }
}
