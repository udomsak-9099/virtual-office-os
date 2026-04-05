import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuditService } from './audit.service';

@ApiTags('Audit')
@ApiBearerAuth()
@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('audit-logs')
  @ApiOperation({ summary: 'List audit logs with filters' })
  getAuditLogs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('entity_type') entityType?: string,
    @Query('entity_id') entityId?: string,
    @Query('user_id') userId?: string,
    @Query('action') action?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.auditService.getAuditLogs({
      page,
      limit,
      entity_type: entityType,
      entity_id: entityId,
      user_id: userId,
      action,
      from,
      to,
    });
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get activity feed' })
  getActivity(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('user_id') userId?: string,
  ) {
    return this.auditService.getActivity({ page, limit, user_id: userId });
  }
}
