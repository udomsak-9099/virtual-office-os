import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string, filters: { page?: number; pageSize?: number; status?: string } = {}) {
    const { page = 1, pageSize = 20, status } = filters;

    const where: any = { orgId, isDeleted: false };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: {
          owner: { include: { employeeProfile: true } },
          department: { select: { id: true, name: true } },
          _count: { select: { members: true, tasks: true, documents: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: items.map((p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description,
        status: p.status,
        priority: p.priority,
        startDate: p.startDate,
        endDate: p.endDate,
        owner: p.owner
          ? {
              id: p.owner.id,
              displayName:
                p.owner.employeeProfile?.displayName || p.owner.email,
            }
          : null,
        department: p.department,
        memberCount: p._count.members,
        taskCount: p._count.tasks,
        documentCount: p._count.documents,
        createdAt: p.createdAt,
      })),
      meta: { page, pageSize, total, hasNext: page * pageSize < total },
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, isDeleted: false },
      include: {
        owner: { include: { employeeProfile: true } },
        department: { select: { id: true, name: true } },
        members: {
          include: {
            user: { include: { employeeProfile: true } },
          },
        },
        _count: { select: { tasks: true, documents: true, meetings: true } },
      },
    });
    if (!project) throw new NotFoundException('Project not found');

    // Get task stats for this project
    const taskStats = await this.prisma.task.groupBy({
      by: ['status'],
      where: { projectId: id, isDeleted: false },
      _count: { id: true },
    });

    return {
      data: {
        ...project,
        taskStats: taskStats.map((g) => ({
          status: g.status,
          count: g._count.id,
        })),
      },
    };
  }

  async create(
    orgId: string,
    userId: string,
    dto: {
      code: string;
      name: string;
      description?: string;
      departmentId?: string;
      status?: string;
      priority?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const project = await this.prisma.project.create({
      data: {
        orgId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        departmentId: dto.departmentId || null,
        ownerUserId: userId,
        status: (dto.status as any) || 'planning',
        priority: (dto.priority as any) || 'medium',
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
      include: {
        owner: { include: { employeeProfile: true } },
        department: { select: { id: true, name: true } },
      },
    });

    // Auto-add the creator as project lead
    await this.prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId,
        projectRole: 'lead',
        accessLevel: 'contributor',
      },
    });

    return { data: project };
  }

  async addMember(projectId: string, userId: string, role?: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, isDeleted: false },
    });
    if (!project) throw new NotFoundException('Project not found');

    const member = await this.prisma.projectMember.upsert({
      where: {
        projectId_userId: { projectId, userId },
      },
      create: {
        projectId,
        userId,
        projectRole: role || 'member',
        accessLevel: 'contributor',
      },
      update: {
        projectRole: role || 'member',
      },
      include: {
        user: { include: { employeeProfile: true } },
      },
    });
    return { data: member };
  }

  async getProjectTasks(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { projectId, isDeleted: false },
      include: {
        assignee: { include: { employeeProfile: true } },
        owner: { include: { employeeProfile: true } },
        _count: { select: { comments: true, checklistItems: true } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      data: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        taskType: t.taskType,
        dueAt: t.dueAt,
        assignee: t.assignee
          ? {
              id: t.assignee.id,
              displayName:
                t.assignee.employeeProfile?.displayName || t.assignee.email,
            }
          : null,
        owner: t.owner
          ? {
              id: t.owner.id,
              displayName:
                t.owner.employeeProfile?.displayName || t.owner.email,
            }
          : null,
        commentCount: t._count.comments,
        checklistCount: t._count.checklistItems,
        createdAt: t.createdAt,
      })),
    };
  }
}
