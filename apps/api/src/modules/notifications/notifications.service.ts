import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: string,
    filters: { page?: number; pageSize?: number; unreadOnly?: boolean } = {},
  ) {
    const { page = 1, pageSize = 20, unreadOnly } = filters;

    const where: any = { userId };
    if (unreadOnly) where.status = 'unread';

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: items,
      meta: { page, pageSize, total, hasNext: page * pageSize < total },
    };
  }

  async markRead(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) throw new NotFoundException('Notification not found');

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { status: 'read', readAt: new Date() },
    });
    return { data: updated };
  }

  async markAllRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, status: 'unread' },
      data: { status: 'read', readAt: new Date() },
    });
    return { data: { updatedCount: result.count } };
  }

  async create(
    orgId: string,
    userId: string,
    dto: {
      notificationType: string;
      title: string;
      body?: string;
      deepLinkType?: string;
      deepLinkId?: string;
      priority?: string;
    },
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        orgId,
        userId,
        notificationType: dto.notificationType,
        title: dto.title,
        body: dto.body || null,
        deepLinkType: dto.deepLinkType || null,
        deepLinkId: dto.deepLinkId || null,
        priority: (dto.priority as any) || 'normal',
        status: 'unread',
      },
    });
    return { data: notification };
  }
}
