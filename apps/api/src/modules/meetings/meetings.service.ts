import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    orgId: string,
    filters: { page?: number; pageSize?: number; status?: string } = {},
  ) {
    const { page = 1, pageSize = 20, status } = filters;

    const where: any = { orgId, isDeleted: false };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.meeting.findMany({
        where,
        include: {
          organizer: { include: { employeeProfile: true } },
          relatedProject: { select: { id: true, name: true, code: true } },
          _count: { select: { attendees: true, notes: true, actionItems: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { startAt: 'desc' },
      }),
      this.prisma.meeting.count({ where }),
    ]);

    return {
      data: items.map((m) => ({
        id: m.id,
        title: m.title,
        meetingType: m.meetingType,
        startAt: m.startAt,
        endAt: m.endAt,
        locationType: m.locationType,
        status: m.status,
        organizer: m.organizer
          ? {
              id: m.organizer.id,
              displayName:
                m.organizer.employeeProfile?.displayName ||
                m.organizer.email,
            }
          : null,
        project: m.relatedProject,
        attendeeCount: m._count.attendees,
        noteCount: m._count.notes,
        actionItemCount: m._count.actionItems,
        createdAt: m.createdAt,
      })),
      meta: { page, pageSize, total, hasNext: page * pageSize < total },
    };
  }

  async findOne(id: string) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id, isDeleted: false },
      include: {
        organizer: { include: { employeeProfile: true } },
        relatedProject: { select: { id: true, name: true, code: true } },
        relatedDepartment: { select: { id: true, name: true } },
        attendees: {
          include: {
            user: { include: { employeeProfile: true } },
          },
        },
        notes: {
          include: {
            creator: { include: { employeeProfile: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        actionItems: {
          include: {
            owner: { include: { employeeProfile: true } },
            linkedTask: { select: { id: true, title: true, status: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!meeting) throw new NotFoundException('Meeting not found');
    return { data: meeting };
  }

  async create(
    orgId: string,
    userId: string,
    dto: {
      title: string;
      description?: string;
      meetingType?: string;
      startAt: string;
      endAt: string;
      locationType?: string;
      externalLink?: string;
      relatedProjectId?: string;
      relatedDepartmentId?: string;
      attendees?: { userId?: string; externalEmail?: string; attendeeRole?: string }[];
    },
  ) {
    const meeting = await this.prisma.meeting.create({
      data: {
        orgId,
        title: dto.title,
        description: dto.description,
        meetingType: dto.meetingType || 'general',
        organizerUserId: userId,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        locationType: (dto.locationType as any) || 'virtual',
        externalLink: dto.externalLink || null,
        relatedProjectId: dto.relatedProjectId || null,
        relatedDepartmentId: dto.relatedDepartmentId || null,
        status: 'scheduled',
        attendees: dto.attendees?.length
          ? {
              create: dto.attendees.map((a) => ({
                userId: a.userId || null,
                externalEmail: a.externalEmail || null,
                attendeeRole: a.attendeeRole || 'attendee',
                responseStatus: 'pending',
              })),
            }
          : undefined,
      },
      include: {
        organizer: { include: { employeeProfile: true } },
        attendees: { include: { user: { include: { employeeProfile: true } } } },
      },
    });
    return { data: meeting };
  }

  async addNote(meetingId: string, userId: string, noteBody: string) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id: meetingId, isDeleted: false },
    });
    if (!meeting) throw new NotFoundException('Meeting not found');

    const note = await this.prisma.meetingNote.create({
      data: {
        meetingId,
        noteBody,
        createdBy: userId,
      },
      include: {
        creator: { include: { employeeProfile: true } },
      },
    });
    return { data: note };
  }

  async getActionItems(meetingId: string) {
    const items = await this.prisma.actionItem.findMany({
      where: { meetingId },
      include: {
        owner: { include: { employeeProfile: true } },
        linkedTask: { select: { id: true, title: true, status: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return { data: items };
  }

  async convertActionItemToTask(
    meetingId: string,
    actionItemId: string,
    userId: string,
  ) {
    const actionItem = await this.prisma.actionItem.findFirst({
      where: { id: actionItemId, meetingId },
      include: { meeting: true },
    });
    if (!actionItem) throw new NotFoundException('Action item not found');
    if (actionItem.linkedTaskId) {
      throw new BadRequestException('Action item is already linked to a task');
    }

    const task = await this.prisma.task.create({
      data: {
        orgId: actionItem.meeting.orgId,
        title: actionItem.title,
        description: actionItem.description,
        assigneeUserId: actionItem.ownerUserId,
        ownerUserId: userId,
        dueAt: actionItem.dueAt,
        status: 'open',
        taskType: 'meeting_action',
        sourceType: 'meeting',
        sourceId: meetingId,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await this.prisma.actionItem.update({
      where: { id: actionItemId },
      data: { linkedTaskId: task.id, status: 'converted' },
    });

    return {
      data: {
        meetingId,
        actionItemId,
        taskId: task.id,
        taskTitle: task.title,
        taskStatus: task.status,
      },
    };
  }
}
