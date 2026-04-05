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

    const [pendingApprovals, myTasksToday, meetingsToday, recentNotifications] =
      await Promise.all([
        // Pending approvals where user is the requester
        this.prisma.approvalRequest.count({
          where: {
            orgId,
            requesterUserId: userId,
            status: { in: ['submitted', 'in_review'] },
            isDeleted: false,
          },
        }),
        // Tasks assigned to user that are open/in_progress and due today or overdue
        this.prisma.task.count({
          where: {
            orgId,
            assigneeUserId: userId,
            status: { in: ['open', 'in_progress'] },
            isDeleted: false,
            OR: [
              { dueAt: { lte: todayEnd } },
              { dueAt: null },
            ],
          },
        }),
        // Meetings today
        this.prisma.meeting.count({
          where: {
            orgId,
            isDeleted: false,
            startAt: { gte: todayStart, lte: todayEnd },
            OR: [
              { organizerUserId: userId },
              { attendees: { some: { userId } } },
            ],
          },
        }),
        // Recent notifications
        this.prisma.notification.findMany({
          where: { userId, orgId },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ]);

    return {
      data: {
        pendingApprovals,
        myTasksToday,
        meetingsToday,
        recentNotifications,
      },
    };
  }

  async getExecutiveDashboard(orgId: string) {
    const [
      totalEmployees,
      activeProjects,
      pendingApprovals,
      departmentSummaries,
    ] = await Promise.all([
      this.prisma.user.count({
        where: { orgId, status: 'active', isDeleted: false },
      }),
      this.prisma.project.count({
        where: { orgId, status: 'active', isDeleted: false },
      }),
      this.prisma.approvalRequest.count({
        where: {
          orgId,
          status: { in: ['submitted', 'in_review'] },
          isDeleted: false,
        },
      }),
      this.prisma.department.findMany({
        where: { orgId, status: 'active' },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              employeeProfiles: true,
              tasks: true,
              projects: true,
            },
          },
        },
      }),
    ]);

    return {
      data: {
        totalEmployees,
        activeProjects,
        pendingApprovals,
        departmentSummaries: departmentSummaries.map((d) => ({
          id: d.id,
          name: d.name,
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

    const [
      tasksCompletedThisWeek,
      tasksOverdue,
      totalOpenTasks,
      tasksByStatus,
    ] = await Promise.all([
      this.prisma.task.count({
        where: {
          orgId,
          status: 'completed',
          completedAt: { gte: oneWeekAgo },
          isDeleted: false,
        },
      }),
      this.prisma.task.count({
        where: {
          orgId,
          status: { in: ['open', 'in_progress'] },
          dueAt: { lt: new Date() },
          isDeleted: false,
        },
      }),
      this.prisma.task.count({
        where: {
          orgId,
          status: { in: ['open', 'in_progress', 'blocked', 'review'] },
          isDeleted: false,
        },
      }),
      this.prisma.task.groupBy({
        by: ['status'],
        where: { orgId, isDeleted: false },
        _count: { id: true },
      }),
    ]);

    return {
      data: {
        tasksCompletedThisWeek,
        tasksOverdue,
        totalOpenTasks,
        tasksByStatus: tasksByStatus.map((g) => ({
          status: g.status,
          count: g._count.id,
        })),
      },
    };
  }

  async getFinanceDashboard(orgId: string) {
    const [
      pendingExpenseApprovals,
      totalDocumentsUnderReview,
      approvalsByStatus,
    ] = await Promise.all([
      this.prisma.approvalRequest.count({
        where: {
          orgId,
          requestType: { in: ['expense', 'budget', 'purchase'] },
          status: { in: ['submitted', 'in_review'] },
          isDeleted: false,
        },
      }),
      this.prisma.document.count({
        where: { orgId, status: 'under_review', isDeleted: false },
      }),
      this.prisma.approvalRequest.groupBy({
        by: ['status'],
        where: { orgId, isDeleted: false },
        _count: { id: true },
      }),
    ]);

    return {
      data: {
        pendingExpenseApprovals,
        totalDocumentsUnderReview,
        approvalsByStatus: approvalsByStatus.map((g) => ({
          status: g.status,
          count: g._count.id,
        })),
      },
    };
  }
}
