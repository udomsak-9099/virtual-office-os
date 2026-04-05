import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';

@ApiTags('Workflows')
@ApiBearerAuth()
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow instance by ID' })
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(id);
  }

  @Get(':id/events')
  @ApiOperation({ summary: 'Get events / history for a workflow instance' })
  getEvents(@Param('id') id: string) {
    return this.workflowsService.getEvents(id);
  }
}
