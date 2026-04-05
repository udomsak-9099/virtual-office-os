import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApprovalsService } from './approvals.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Approvals')
@ApiBearerAuth()
@Controller('approval-requests')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get()
  @ApiOperation({ summary: 'List approval requests' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('page_size') pageSize?: number,
    @Query('status') status?: string,
    @Query('requester_user_id') requesterUserId?: string,
    @Query('approver_scope') approverScope?: string,
  ) {
    return this.approvalsService.findAll(user.org_id, {
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 20,
      status,
      requesterUserId,
      approverScope,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new approval request' })
  create(
    @CurrentUser() user: any,
    @Body() dto: { requestType: string; sourceType: string; sourceId: string },
  ) {
    return this.approvalsService.create(user.org_id, user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get approval request by ID' })
  findOne(@Param('id') id: string) {
    return this.approvalsService.findOne(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit a draft approval request' })
  submit(@CurrentUser() user: any, @Param('id') id: string) {
    return this.approvalsService.submit(id, user.id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve an approval request' })
  approve(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto?: { comment?: string },
  ) {
    return this.approvalsService.approve(id, user.id, dto?.comment);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject an approval request' })
  reject(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto?: { comment?: string },
  ) {
    return this.approvalsService.reject(id, user.id, dto?.comment);
  }

  @Post(':id/return')
  @ApiOperation({ summary: 'Return an approval request for revision' })
  returnForRevision(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto?: { comment?: string },
  ) {
    return this.approvalsService.returnForRevision(id, user.id, dto?.comment);
  }
}
