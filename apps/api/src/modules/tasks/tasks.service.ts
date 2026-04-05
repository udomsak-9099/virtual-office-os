import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string, filters: {
    status?: string;
    assigneeUserId?: string;
    projectId?: string;
    departmentId?: string;
    page?: number;
    pageSize?: number;
  } = {}) {
    const { status, assigneeUserId, projectId, departmentId, page = 1, pageSize = 20 } = filters;

    const where: any = { orgId, isDeleted: false };
    if (status) where.status = status;
    if (assigneeUserId) where.assigneeUserId = assigneeUserId;
    if (projectId) where.projectId = projectId;
    if (departmentId) where.departmentId = departmentId;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          assignee: { include: { employeeProfile: true } },
          owner: { include: { employeeProfile: true } },
          project: { select: { id: true, name: true, code: true } },
          department: { select: { id: true, name: true } },
          checklistItems: true,
          _count: { select: { comments: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        taskType: t.taskType,
        dueAt: t.dueAt,
        completedAt: t.completedAt,
        aiGenerated: t.aiGenerated,
        assignee: t.assignee ? {
          id: t.assignee.id,
          displayName: t.assignee.employeeProfile?.displayName || t.assignee.email,
        } : null,
        owner: t.owner ? {
          id: t.owner.id,
          displayName: t.owner.employeeProfile?.displayName || t.owner.email,
        } : null,
        project: t.project,
        department: t.department,
        checklistProgress: {
          total: t.checklistItems.length,
          completed: t.checklistItems.filter((ci) => ci.isCompleted).length,
        },
        commentCount: t._count.comments,
        createdAt: t.createdAt,
      })),
      meta: { page, page_size: pageSize, total, has_next: page * pageSize < total },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, isDeleted: false },
      include: {
        assignee: { include: { employeeProfile: true } },
        owner: { include: { employeeProfile: true } },
        project: { select: { id: true, name: true, code: true } },
        department: { select: { id: true, name: true } },
        checklistItems: { orderBy: { sortOrder: 'asc' } },
        comments: {
          include: { author: { include: { employeeProfile: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return { data: task };
  }

  async create(orgId: string, userId: string, dto: {
    title: string;
    description?: string;
    projectId?: string;
    departmentId?: string;
    assigneeUserId?: string;
    priority?: string;
    dueAt?: string;
    taskType?: string;
    checklist?: { title: string }[];
  }) {
    const task = await this.prisma.task.create({
      data: {
        orgId,
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId || null,
        departmentId: dto.departmentId || null,
        ownerUserId: userId,
        assigneeUserId: dto.assigneeUserId || null,
        priority: (dto.priority as any) || 'medium',
        taskType: dto.taskType || 'general',
        status: 'open',
        dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
        createdBy: userId,
        updatedBy: userId,
        checklistItems: dto.checklist?.length
          ? { create: dto.checklist.map((item, idx) => ({ title: item.title, sortOrder: idx })) }
          : undefined,
      },
      include: { assignee: { include: { employeeProfile: true } }, checklistItems: true },
    });
    return { data: task };
  }

  async update(id: string, userId: string, dto: any) {
    const updateData: any = { updatedBy: userId };
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.assigneeUserId !== undefined) updateData.assigneeUserId = dto.assigneeUserId;
    if (dto.dueAt !== undefined) updateData.dueAt = dto.dueAt ? new Date(dto.dueAt) : null;

    const task = await this.prisma.task.update({
      where: { id },
      data: updateData,
      include: { assignee: { include: { employeeProfile: true } }, checklistItems: true },
    });
    return { data: task };
  }

  async complete(id: string, userId?: string) {
    const task = await this.prisma.task.update({
      where: { id },
      data: { status: 'completed', completedAt: new Date(), updatedBy: userId },
    });
    return { data: task };
  }

  async reopen(id: string, userId?: string) {
    const task = await this.prisma.task.update({
      where: { id },
      data: { status: 'open', completedAt: null, updatedBy: userId },
    });
    return { data: task };
  }

  async assign(id: string, assigneeId: string, userId?: string) {
    const task = await this.prisma.task.update({
      where: { id },
      data: { assigneeUserId: assigneeId, updatedBy: userId },
    });
    return { data: task };
  }

  async addComment(taskId: string, dto: { body: string; author_id: string }) {
    const comment = await this.prisma.taskComment.create({
      data: { taskId, authorUserId: dto.author_id, commentText: dto.body },
      include: { author: { include: { employeeProfile: true } } },
    });
    return { data: comment };
  }

  async getComments(taskId: string) {
    const comments = await this.prisma.taskComment.findMany({
      where: { taskId },
      include: { author: { include: { employeeProfile: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { data: comments };
  }
}
