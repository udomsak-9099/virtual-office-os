import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels')
  @ApiOperation({ summary: 'List chat channels' })
  getChannels(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getChannels({ page, limit });
  }

  @Post('channels')
  @ApiOperation({ summary: 'Create a new chat channel' })
  createChannel(@Body() dto: { name: string; type?: string; member_ids?: string[] }) {
    return this.chatService.createChannel(dto);
  }

  @Get('channels/:id/messages')
  @ApiOperation({ summary: 'Get messages for a chat channel' })
  getMessages(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('before') before?: string,
  ) {
    return this.chatService.getMessages(id, { page, limit, before });
  }

  @Post('channels/:id/messages')
  @ApiOperation({ summary: 'Send a message to a chat channel' })
  sendMessage(
    @Param('id') id: string,
    @Body() dto: { body: string; attachments?: any[] },
  ) {
    return this.chatService.sendMessage(id, dto);
  }
}
