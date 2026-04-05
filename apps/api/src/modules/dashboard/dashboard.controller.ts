import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('home')
  @ApiOperation({ summary: 'Get role-based home dashboard' })
  getHome(@CurrentUser() user: any) {
    return this.dashboardService.getHome(user.org_id, user.id);
  }

  @Get('dashboards/executive')
  @ApiOperation({ summary: 'Get executive dashboard with KPIs' })
  getExecutiveDashboard(@CurrentUser() user: any) {
    return this.dashboardService.getExecutiveDashboard(user.org_id);
  }

  @Get('dashboards/operations')
  @ApiOperation({ summary: 'Get operations dashboard with task metrics' })
  getOperationsDashboard(@CurrentUser() user: any) {
    return this.dashboardService.getOperationsDashboard(user.org_id);
  }

  @Get('dashboards/finance')
  @ApiOperation({ summary: 'Get finance dashboard with budget data' })
  getFinanceDashboard(@CurrentUser() user: any) {
    return this.dashboardService.getFinanceDashboard(user.org_id);
  }
}
