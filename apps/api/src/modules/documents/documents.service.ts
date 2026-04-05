import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    orgId: string,
    filters: { page?: number; pageSize?: number; status?: string; documentType?: string } = {},
  ) {
    const { page = 1, pageSize = 20, status, documentType } = filters;

    const where: any = { orgId, isDeleted: false };
    if (status) where.status = status;
    if (documentType) where.documentType = documentType;

    const [items, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        include: {
          owner: { include: { employeeProfile: true } },
          currentVersion: true,
          department: { select: { id: true, name: true } },
          project: { select: { id: true, name: true, code: true } },
          _count: { select: { versions: true, tags: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      data: items.map((d) => ({
        id: d.id,
        title: d.title,
        documentType: d.documentType,
        status: d.status,
        classification: d.classification,
        isControlled: d.isControlled,
        owner: d.owner
          ? {
              id: d.owner.id,
              displayName:
                d.owner.employeeProfile?.displayName || d.owner.email,
            }
          : null,
        currentVersion: d.currentVersion
          ? {
              id: d.currentVersion.id,
              versionNo: d.currentVersion.versionNo,
              fileName: d.currentVersion.fileName,
              uploadedAt: d.currentVersion.uploadedAt,
            }
          : null,
        department: d.department,
        project: d.project,
        versionsCount: d._count.versions,
        tagsCount: d._count.tags,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
      meta: { page, pageSize, total, hasNext: page * pageSize < total },
    };
  }

  async findOne(id: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id, isDeleted: false },
      include: {
        owner: { include: { employeeProfile: true } },
        currentVersion: true,
        versions: {
          orderBy: { versionNo: 'desc' },
          take: 10,
        },
        tags: true,
        accessRules: true,
        department: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, code: true } },
      },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return { data: doc };
  }

  async create(
    orgId: string,
    userId: string,
    dto: {
      title: string;
      documentType?: string;
      departmentId?: string;
      projectId?: string;
      classification?: string;
      isControlled?: boolean;
    },
  ) {
    const doc = await this.prisma.document.create({
      data: {
        orgId,
        title: dto.title,
        documentType: dto.documentType || 'general',
        departmentId: dto.departmentId || null,
        projectId: dto.projectId || null,
        ownerUserId: userId,
        classification: (dto.classification as any) || 'internal',
        isControlled: dto.isControlled || false,
        status: 'draft',
        createdBy: userId,
        updatedBy: userId,
      },
      include: {
        owner: { include: { employeeProfile: true } },
        department: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, code: true } },
      },
    });
    return { data: doc };
  }

  async createVersion(
    documentId: string,
    userId: string,
    dto: {
      fileName: string;
      storageObjectKey: string;
      mimeType?: string;
      fileSizeBytes?: number;
    },
  ) {
    const doc = await this.prisma.document.findFirst({
      where: { id: documentId, isDeleted: false },
      include: { versions: { orderBy: { versionNo: 'desc' }, take: 1 } },
    });
    if (!doc) throw new NotFoundException('Document not found');

    const nextVersionNo =
      doc.versions.length > 0 ? doc.versions[0].versionNo + 1 : 1;

    // Mark previous current version as superseded
    if (doc.currentVersionId) {
      await this.prisma.documentVersion.update({
        where: { id: doc.currentVersionId },
        data: { versionStatus: 'superseded' },
      });
    }

    const version = await this.prisma.documentVersion.create({
      data: {
        documentId,
        versionNo: nextVersionNo,
        fileName: dto.fileName,
        storageObjectKey: dto.storageObjectKey,
        mimeType: dto.mimeType || null,
        fileSizeBytes: dto.fileSizeBytes ? BigInt(dto.fileSizeBytes) : null,
        uploadedBy: userId,
        versionStatus: 'current',
      },
    });

    // Update document to point to new current version
    await this.prisma.document.update({
      where: { id: documentId },
      data: { currentVersionId: version.id, updatedBy: userId },
    });

    return { data: version };
  }

  async getVersions(documentId: string) {
    const versions = await this.prisma.documentVersion.findMany({
      where: { documentId },
      include: {
        uploader: { include: { employeeProfile: true } },
      },
      orderBy: { versionNo: 'desc' },
    });
    return { data: versions };
  }

  async routeForApproval(documentId: string, userId: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id: documentId, isDeleted: false },
    });
    if (!doc) throw new NotFoundException('Document not found');
    if (!doc.isControlled) {
      throw new BadRequestException('Only controlled documents require approval routing');
    }

    // Create a workflow instance for the document
    const workflow = await this.prisma.workflowInstance.create({
      data: {
        orgId: doc.orgId,
        workflowType: 'document_approval',
        sourceType: 'document',
        sourceId: documentId,
        currentState: 'pending_approval',
        status: 'active',
        initiatedBy: userId,
      },
    });

    // Create the approval request linked to the workflow
    const approvalRequest = await this.prisma.approvalRequest.create({
      data: {
        orgId: doc.orgId,
        requestType: 'document_approval',
        workflowInstanceId: workflow.id,
        sourceType: 'document',
        sourceId: documentId,
        requesterUserId: userId,
        status: 'submitted',
        currentStepNo: 1,
        submittedAt: new Date(),
      },
    });

    // Update document status
    await this.prisma.document.update({
      where: { id: documentId },
      data: { status: 'under_review', updatedBy: userId },
    });

    return {
      data: {
        workflowInstanceId: workflow.id,
        approvalRequestId: approvalRequest.id,
        documentId,
        status: 'under_review',
      },
    };
  }
}
