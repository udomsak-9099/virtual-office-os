import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global keyword search across all entities' })
  search(
    @Query('q') q: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.search({ q, type, page, limit });
  }

  @Post('semantic')
  @ApiOperation({ summary: 'AI-powered semantic search' })
  semanticSearch(@Body() dto: { query: string; filters?: Record<string, any> }) {
    return this.searchService.semanticSearch(dto);
  }
}
