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
import { DepartmentsService } from './departments.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Departments')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all departments' })
  findAll(
    @CurrentUser() user: { org_id: string },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.departmentsService.findAll({ page, limit, org_id: user.org_id });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  create(@CurrentUser() user: { org_id: string }, @Body() dto: any) {
    return this.departmentsService.create({ ...dto, org_id: user.org_id });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID' })
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a department' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.departmentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a department' })
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }
}
