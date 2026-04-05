import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    orgId: string,
    filters: {
      status?: string;
      requesterUserId?: string;
      approverScope?: string;
      page?: number;
      pageSize?: number;
    } = {},
  ) {
    const { status, requesterUserId, page = 1, pageSize = 20 } = filters;

    const where: any = { orgId, isDeleted: false };
    if (status) where.status = status;
    if (requesterUserId) where.requesterUserId = requesterUserId;

    const [items, total] = await Promise.all([
      this.prisma.approvalRequest.findMany({
        where,
        include: {
          requester: { include: { employeeProfile: true } },
          steps: {
            include: { decisions: true },
            orderBy: { stepNo: 'asc' },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.approvalRequest.count({ where }),
    ]);

    return {
      data: items.map((r) => ({
        id: r.id,
        requestType: r.requestType,
        sourceType: r.sourceType,
        sourceId: r.sourceId,
        status: r.status,
        currentStepNo: r.currentStepNo,
        submittedAt: r.submittedAt,
        requester: r.requester
          ? {
              id: r.requester.id,
              displayName:
                r.requester.employeeProfile?.displayName ||
                r.requester.email,
            }
          : null,
        stepsCount: r.steps.length,
        createdAt: r.createdAt,
      })),
      meta: { page, pageSize, total, hasNext: page * pageSize < total },
    };
  }

  async findOne(id: string) {
    const request = await this.prisma.approvalRequest.findFirst({
      where: { id, isDeleted: false },
      include: {
        requester: { include: { employeeProfile: true } },
        workflowInstance: true,
        steps: {
          include: {
            decisions: {
              include: {
                decidedBy: { include: { employeeProfile: true } },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
          orderBy: { stepNo: 'asc' },
        },
      },
    });
    if (!request) throw new NotFoundException('Approval request not found');
    return { data: request };
  }

  async create(
    orgId: string,
    userId: string,
    dto: { requestType: string; sourceType: string; sourceId: string },
  ) {
    const request = await this.prisma.approvalRequest.create({
      data: {
        orgId,
        requestType: dto.requestType,
        sourceType: dto.sourceType,
        sourceId: dto.sourceId,
        requesterUserId: userId,
        status: 'draft',
        currentStepNo: 1,
      },
      include: {
        requester: { include: { employeeProfile: true } },
        steps: true,
      },
    });
    return { data: request };
  }

  async submit(id: string, userId: string) {
    const request = await this.prisma.approvalRequest.findFirst({
      where: { id, isDeleted: false },
    });
    if (!request) throw new NotFoundException('Approval request not found');
    if (request.status !== 'draft') {
      throw new BadRequestException('Only draft requests can be submitted');
    }

    const updated = await this.prisma.approvalRequest.update({
      where: { id },
      data: {
        status: 'submitted',
        submittedAt: new Date(),
      },
      include: { steps: true },
    });
    return { data: updated };
  }

  async approve(id: string, userId: string, comment?: string) {
    const request = await this.prisma.approvalRequest.findFirst({
      where: { id, isDeleted: false },
      include: { steps: { orderBy: { stepNo: 'asc' } } },
    });
    if (!request) throw new NotFoundException('Approval request not found');
    if (!['submitted', 'in_review'].includes(request.status)) {
      throw new BadRequestException('Request is not in a reviewable state');
    }

    const currentStep = request.steps.find(
      (s) => s.stepNo === request.currentStepNo,
    );
    if (!currentStep) throw new BadRequestException('No current step found');

    // Record the decision
    await this.prisma.approvalDecision.create({
      data: {
        approvalStepId: currentStep.id,
        decisionType: 'approve',
        decidedByUserId: userId,
        decisionComment: comment || null,
      },
    });

    // Mark step as approved
    await this.prisma.approvalStep.update({
      where: { id: currentStep.id },
      data: { decisionStatus: 'approved', decidedAt: new Date() },
    });

    // Check if there is a next step
    const nextStep = request.steps.find(
      (s) => s.stepNo === (request.currentStepNo || 0) + 1,
    );

    let newStatus: string;
    let newStepNo: number | null;
    if (nextStep) {
      newStatus = 'in_review';
      newStepNo = nextStep.stepNo;
    } else {
      newStatus = 'approved';
      newStepNo = request.currentStepNo;
    }

    const updated = await this.prisma.approvalRequest.update({
      where: { id },
      data: { status: newStatus as any, currentStepNo: newStepNo },
      include: {
        requester: { include: { employeeProfile: true } },
        steps: { include: { decisions: true }, orderBy: { stepNo: 'asc' } },
      },
    });
    return { data: updated };
  }

  async reject(id: string, userId: string, comment?: string) {
    const request = await this.prisma.approvalRequest.findFirst({
      where: { id, isDeleted: false },
      include: { steps: { orderBy: { stepNo: 'asc' } } },
    });
    if (!request) throw new NotFoundException('Approval request not found');
    if (!['submitted', 'in_review'].includes(request.status)) {
      throw new BadRequestException('Request is not in a reviewable state');
    }

    const currentStep = request.steps.find(
      (s) => s.stepNo === request.currentStepNo,
    );
    if (!currentStep) throw new BadRequestException('No current step found');

    await this.prisma.approvalDecision.create({
      data: {
        approvalStepId: currentStep.id,
        decisionType: 'reject',
        decidedByUserId: userId,
        decisionComment: comment || null,
      },
    });

    await this.prisma.approvalStep.update({
      where: { id: currentStep.id },
      data: { decisionStatus: 'rejected', decidedAt: new Date() },
    });

    const updated = await this.prisma.approvalRequest.update({
      where: { id },
      data: { status: 'rejected' },
      include: {
        requester: { include: { employeeProfile: true } },
        steps: { include: { decisions: true }, orderBy: { stepNo: 'asc' } },
      },
    });
    return { data: updated };
  }

  async returnForRevision(id: string, userId: string, comment?: string) {
    const request = await this.prisma.approvalRequest.findFirst({
      where: { id, isDeleted: false },
      include: { steps: { orderBy: { stepNo: 'asc' } } },
    });
    if (!request) throw new NotFoundException('Approval request not found');
    if (!['submitted', 'in_review'].includes(request.status)) {
      throw new BadRequestException('Request is not in a reviewable state');
    }

    const currentStep = request.steps.find(
      (s) => s.stepNo === request.currentStepNo,
    );
    if (!currentStep) throw new BadRequestException('No current step found');

    await this.prisma.approvalDecision.create({
      data: {
        approvalStepId: currentStep.id,
        decisionType: 'return_request',
        decidedByUserId: userId,
        decisionComment: comment || null,
      },
    });

    await this.prisma.approvalStep.update({
      where: { id: currentStep.id },
      data: { decisionStatus: 'returned', decidedAt: new Date() },
    });

    const updated = await this.prisma.approvalRequest.update({
      where: { id },
      data: { status: 'returned' },
      include: {
        requester: { include: { employeeProfile: true } },
        steps: { include: { decisions: true }, orderBy: { stepNo: 'asc' } },
      },
    });
    return { data: updated };
  }
}
