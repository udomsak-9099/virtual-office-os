import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels')
  @ApiOperation({ summary: 'List chat channels' })
  getChannels(@CurrentUser() user: any) {
    return this.chatService.getChannels(user.org_id, user.id);
  }

  @Post('channels')
  @ApiOperation({ summary: 'Create a new chat channel' })
  createChannel(@CurrentUser() user: any, @Body() dto: { name: string; type?: string; memberIds?: string[] }) {
    return this.chatService.createChannel(user.org_id, user.id, dto);
  }

  @Get('channels/:id/messages')
  @ApiOperation({ summary: 'Get messages for a chat channel' })
  getMessages(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getMessages(id, page ? +page : 1, limit ? +limit : 50);
  }

  @Post('channels/:id/messages')
  @ApiOperation({ summary: 'Send a message to a chat channel' })
  sendMessage(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: { body: string }) {
    return this.chatService.sendMessage(id, user.id, dto);
  }
}
