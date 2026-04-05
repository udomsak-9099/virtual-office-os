import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global keyword search across all entities' })
  search(
    @CurrentUser() user: any,
    @Query('q') q: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.search(user.org_id, { q, type, page, limit });
  }

  @Post('semantic')
  @ApiOperation({ summary: 'AI-powered semantic search' })
  semanticSearch(@CurrentUser() user: any, @Body() dto: { query: string }) {
    return this.searchService.semanticSearch(user.org_id, dto);
  }
}
