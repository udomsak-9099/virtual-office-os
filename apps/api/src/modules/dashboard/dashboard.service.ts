import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getHome(orgId: string, userId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [pendingApprovals, myTasksCount, meetingsToday, recentTasks, upcomingMeetings] =
      await Promise.all([
        this.prisma.approvalRequest.count({
          where: {
            orgId,
            status: { in: ['submitted', 'in_review'] },
            isDeleted: false,
          },
        }),
        this.prisma.task.count({
          where: {
            orgId,
            status: { in: ['open', 'in_progress', 'draft', 'blocked', 'review'] },
            isDeleted: false,
          },
        }),
        this.prisma.meeting.count({
          where: {
            orgId,
            isDeleted: false,
            startAt: { gte: todayStart, lte: todayEnd },
          },
        }),
        this.prisma.task.findMany({
          where: { orgId, isDeleted: false, status: { not: 'archived' } },
          include: {
            assignee: { include: { employeeProfile: true } },
            department: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 8,
        }),
        this.prisma.meeting.findMany({
          where: { orgId, isDeleted: false, startAt: { gte: todayStart } },
          orderBy: { startAt: 'asc' },
          take: 5,
        }),
      ]);

    return {
      data: {
        pendingApprovals,
        myTasksCount,
        meetingsToday,
        tasks: recentTasks.map((t: any) => ({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          dueAt: t.dueAt,
          assignee: t.assignee ? {
            id: t.assignee.id,
            displayName: t.assignee.employeeProfile?.displayName || t.assignee.email,
          } : null,
          department: t.department,
        })),
        meetings: upcomingMeetings.map((m: any) => ({
          id: m.id,
          title: m.title,
          startAt: m.startAt,
          endAt: m.endAt,
          status: m.status,
        })),
      },
    };
  }

  async getExecutiveDashboard(orgId: string) {
    const [totalEmployees, activeProjects, pendingApprovals, departmentSummaries] =
      await Promise.all([
        this.prisma.user.count({ where: { orgId, status: 'active', isDeleted: false } }),
        this.prisma.project.count({ where: { orgId, status: 'active', isDeleted: false } }),
        this.prisma.approvalRequest.count({
          where: { orgId, status: { in: ['submitted', 'in_review'] }, isDeleted: false },
        }),
        this.prisma.department.findMany({
          where: { orgId, status: 'active' },
          select: {
            id: true, name: true,
            _count: { select: { employeeProfiles: true, tasks: true, projects: true } },
          },
        }),
      ]);

    return {
      data: {
        totalEmployees, activeProjects, pendingApprovals,
        departmentSummaries: departmentSummaries.map((d: any) => ({
          id: d.id, name: d.name,
          employeeCount: d._count.employeeProfiles,
          taskCount: d._count.tasks,
          projectCount: d._count.projects,
        })),
      },
    };
  }

  async getOperationsDashboard(orgId: string) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [tasksCompletedThisWeek, tasksOverdue, totalOpenTasks, tasksByStatus] =
      await Promise.all([
        this.prisma.task.count({
          where: { orgId, status: 'completed', completedAt: { gte: oneWeekAgo }, isDeleted: false },
        }),
        this.prisma.task.count({
          where: { orgId, status: { in: ['open', 'in_progress'] }, dueAt: { lt: new Date() }, isDeleted: false },
        }),
        this.prisma.task.count({
          where: { orgId, status: { in: ['open', 'in_progress', 'blocked', 'review'] }, isDeleted: false },
        }),
        this.prisma.task.groupBy({
          by: ['status'],
          where: { orgId, isDeleted: false },
          _count: { id: true },
        }),
      ]);

    return {
      data: {
        tasksCompletedThisWeek, tasksOverdue, totalOpenTasks,
        tasksByStatus: tasksByStatus.map((g: any) => ({ status: g.status, count: g._count.id })),
      },
    };
  }

  async getFinanceDashboard(orgId: string) {
    const [pendingExpenseApprovals, totalDocumentsUnderReview, approvalsByStatus] =
      await Promise.all([
        this.prisma.approvalRequest.count({
          where: { orgId, requestType: { in: ['expense', 'expense_approval'] }, status: { in: ['submitted', 'in_review'] }, isDeleted: false },
        }),
        this.prisma.document.count({ where: { orgId, status: 'under_review', isDeleted: false } }),
        this.prisma.approvalRequest.groupBy({
          by: ['status'],
          where: { orgId, isDeleted: false },
          _count: { id: true },
        }),
      ]);

    return {
      data: {
        pendingExpenseApprovals, totalDocumentsUnderReview,
        approvalsByStatus: approvalsByStatus.map((g: any) => ({ status: g.status, count: g._count.id })),
      },
    };
  }
}
