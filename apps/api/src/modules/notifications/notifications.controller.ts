import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for current user' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('page_size') pageSize?: number,
    @Query('unread_only') unreadOnly?: string,
  ) {
    return this.notificationsService.findAll(user.id, {
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 20,
      unreadOnly: unreadOnly === 'true',
    });
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllRead(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a notification (internal use)' })
  create(
    @CurrentUser() user: any,
    @Body()
    dto: {
      userId: string;
      notificationType: string;
      title: string;
      body?: string;
      deepLinkType?: string;
      deepLinkId?: string;
      priority?: string;
    },
  ) {
    return this.notificationsService.create(user.org_id, dto.userId, dto);
  }
}
