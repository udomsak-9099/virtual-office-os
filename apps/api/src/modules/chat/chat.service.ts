import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChannels(orgId: string, userId: string) {
    const channels = await this.prisma.chatChannel.findMany({
      where: {
        orgId,
        status: 'active',
        members: { some: { userId } },
      },
      include: {
        members: {
          include: { user: { include: { employeeProfile: true } } },
          take: 5,
        },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return {
      data: channels.map((ch: any) => ({
        id: ch.id,
        name: ch.name || ch.members.map((m: any) => m.user.employeeProfile?.displayName || m.user.email).join(', '),
        channelType: ch.channelType,
        memberCount: ch.members.length,
        messageCount: ch._count.messages,
        members: ch.members.map((m: any) => ({
          id: m.user.id,
          displayName: m.user.employeeProfile?.displayName || m.user.email,
        })),
      })),
    };
  }

  async createChannel(orgId: string, userId: string, dto: { name: string; type?: string; memberIds?: string[] }) {
    const channel = await this.prisma.chatChannel.create({
      data: {
        orgId,
        name: dto.name,
        channelType: (dto.type as any) || 'group',
        createdBy: userId,
        members: {
          create: [
            { userId },
            ...(dto.memberIds || []).filter((id: string) => id !== userId).map((id: string) => ({ userId: id })),
          ],
        },
      },
      include: { members: { include: { user: { include: { employeeProfile: true } } } } },
    });
    return { data: channel };
  }

  async getMessages(channelId: string, page = 1, limit = 50) {
    const [messages, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where: { channelId, deletedAt: null },
        include: { sender: { include: { employeeProfile: true } } },
        orderBy: { sentAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.chatMessage.count({ where: { channelId, deletedAt: null } }),
    ]);

    return {
      data: messages.map((m: any) => ({
        id: m.id,
        text: m.messageText,
        sender: {
          id: m.sender.id,
          displayName: m.sender.employeeProfile?.displayName || m.sender.email,
        },
        sentAt: m.sentAt,
        messageType: m.messageType,
      })),
      meta: { total, page, limit },
    };
  }

  async sendMessage(channelId: string, userId: string, dto: { body: string }) {
    const message = await this.prisma.chatMessage.create({
      data: {
        channelId,
        senderUserId: userId,
        messageText: dto.body,
        messageType: 'text',
      },
      include: { sender: { include: { employeeProfile: true } } },
    });

    await this.prisma.chatChannel.update({
      where: { id: channelId },
      data: { updatedAt: new Date() },
    });

    return {
      data: {
        id: message.id,
        text: message.messageText,
        sender: {
          id: message.sender.id,
          displayName: message.sender.employeeProfile?.displayName || message.sender.email,
        },
        sentAt: message.sentAt,
      },
    };
  }
}
