import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(orgId: string, query: { q: string; type?: string; page?: number; limit?: number }) {
    const q = query.q || '';
    if (!q) return { data: [], meta: { query: q, total: 0 } };

    const results: any[] = [];

    const [tasks, documents, projects, meetings] = await Promise.all([
      this.prisma.task.findMany({
        where: { orgId, isDeleted: false, title: { contains: q, mode: 'insensitive' } },
        select: { id: true, title: true, status: true, priority: true },
        take: 10,
      }),
      this.prisma.document.findMany({
        where: { orgId, isDeleted: false, title: { contains: q, mode: 'insensitive' } },
        select: { id: true, title: true, documentType: true, status: true },
        take: 10,
      }),
      this.prisma.project.findMany({
        where: { orgId, isDeleted: false, name: { contains: q, mode: 'insensitive' } },
        select: { id: true, name: true, code: true, status: true },
        take: 10,
      }),
      this.prisma.meeting.findMany({
        where: { orgId, isDeleted: false, title: { contains: q, mode: 'insensitive' } },
        select: { id: true, title: true, startAt: true, status: true },
        take: 10,
      }),
    ]);

    tasks.forEach((t: any) => results.push({ type: 'task', id: t.id, title: t.title, status: t.status, deepLink: `/tasks?id=${t.id}` }));
    documents.forEach((d: any) => results.push({ type: 'document', id: d.id, title: d.title, status: d.status, deepLink: `/documents?id=${d.id}` }));
    projects.forEach((p: any) => results.push({ type: 'project', id: p.id, title: p.name, status: p.status, deepLink: `/projects?id=${p.id}` }));
    meetings.forEach((m: any) => results.push({ type: 'meeting', id: m.id, title: m.title, status: m.status, deepLink: `/meetings?id=${m.id}` }));

    return { data: results, meta: { query: q, total: results.length } };
  }

  async semanticSearch(orgId: string, dto: { query: string }) {
    return this.search(orgId, { q: dto.query });
  }
}
