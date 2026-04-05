import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('AI')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  @ApiOperation({ summary: 'Send a prompt to the AI workspace' })
  ask(@Body() dto: { prompt: string; context?: Record<string, any> }) {
    return this.aiService.ask(dto);
  }

  @Get('review-queue')
  @ApiOperation({ summary: 'Get AI outputs pending human review' })
  getReviewQueue(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.aiService.getReviewQueue({ page, limit });
  }

  @Post('outputs/:id/approve')
  @ApiOperation({ summary: 'Approve an AI output' })
  approveOutput(@Param('id') id: string) {
    return this.aiService.approveOutput(id);
  }

  @Post('outputs/:id/reject')
  @ApiOperation({ summary: 'Reject an AI output' })
  rejectOutput(@Param('id') id: string, @Body() dto?: { reason?: string }) {
    return this.aiService.rejectOutput(id, dto);
  }
}
