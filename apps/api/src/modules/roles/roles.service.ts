import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; org_id?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.org_id) {
      where.orgId = query.org_id;
    }

    const [data, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { rolePermissions: true },
          },
        },
      }),
      this.prisma.role.count({ where }),
    ]);

    return { data, meta: { page, limit, total } };
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role ${id} not found`);
    }

    return { data: role };
  }

  async create(dto: any) {
    const role = await this.prisma.role.create({
      data: {
        orgId: dto.org_id ?? dto.orgId,
        code: dto.code,
        name: dto.name,
        roleType: dto.role_type ?? dto.roleType ?? 'human',
        description: dto.description,
        status: dto.status,
      },
    });

    return { data: role };
  }

  async update(id: string, dto: any) {
    await this.findOne(id);

    const role = await this.prisma.role.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.code !== undefined && { code: dto.code }),
        ...((dto.role_type ?? dto.roleType) !== undefined && {
          roleType: dto.role_type ?? dto.roleType,
        }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });

    return { data: role };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.role.delete({
      where: { id },
    });

    return { data: { id, deleted: true } };
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    await this.findOne(roleId);

    const data = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    await this.prisma.rolePermission.createMany({
      data,
      skipDuplicates: true,
    });

    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });

    return { data: role };
  }
}
