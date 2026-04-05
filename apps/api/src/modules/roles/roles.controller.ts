import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'List all roles' })
  findAll(
    @CurrentUser() user: { org_id: string },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.rolesService.findAll({ page, limit, org_id: user.org_id });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  create(@CurrentUser() user: { org_id: string }, @Body() dto: any) {
    return this.rolesService.create({ ...dto, org_id: user.org_id });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Post(':id/permissions')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  assignPermissions(
    @Param('id') id: string,
    @Body() dto: { permission_ids: string[] },
  ) {
    return this.rolesService.assignPermissions(id, dto.permission_ids);
  }
}
