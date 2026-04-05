import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MeetingsService } from './meetings.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Meetings')
@ApiBearerAuth()
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all meetings' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('page_size') pageSize?: number,
    @Query('status') status?: string,
  ) {
    return this.meetingsService.findAll(user.org_id, {
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 20,
      status,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new meeting' })
  create(@CurrentUser() user: any, @Body() dto: any) {
    return this.meetingsService.create(user.org_id, user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meeting by ID with attendees and notes' })
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }

  @Get(':id/action-items')
  @ApiOperation({ summary: 'Get action items for a meeting' })
  getActionItems(@Param('id') id: string) {
    return this.meetingsService.getActionItems(id);
  }

  @Post(':id/action-items/:actionItemId/convert-to-task')
  @ApiOperation({ summary: 'Convert a meeting action item into a task' })
  convertActionItemToTask(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Param('actionItemId') actionItemId: string,
  ) {
    return this.meetingsService.convertActionItemToTask(id, actionItemId, user.id);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add a note to a meeting' })
  addNote(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: { content: string },
  ) {
    return this.meetingsService.addNote(id, user.id, dto.content);
  }
}
