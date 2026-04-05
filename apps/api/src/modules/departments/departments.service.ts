import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
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
      this.prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          parentDepartment: {
            select: { id: true, name: true },
          },
          _count: {
            select: { employeeProfiles: true },
          },
        },
      }),
      this.prisma.department.count({ where }),
    ]);

    return { data, meta: { page, limit, total } };
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        parentDepartment: {
          select: { id: true, name: true },
        },
        childDepartments: {
          select: { id: true, name: true, code: true, status: true },
        },
        employeeProfiles: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            jobTitle: true,
            userId: true,
          },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department ${id} not found`);
    }

    return { data: department };
  }

  async create(dto: any) {
    const department = await this.prisma.department.create({
      data: {
        orgId: dto.org_id ?? dto.orgId,
        name: dto.name,
        code: dto.code,
        parentDepartmentId: dto.parent_department_id ?? dto.parentDepartmentId,
        departmentType: dto.department_type ?? dto.departmentType ?? 'general',
        status: dto.status,
      },
    });

    return { data: department };
  }

  async update(id: string, dto: any) {
    await this.findOne(id);

    const department = await this.prisma.department.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.code !== undefined && { code: dto.code }),
        ...((dto.parent_department_id ?? dto.parentDepartmentId) !== undefined && {
          parentDepartmentId: dto.parent_department_id ?? dto.parentDepartmentId,
        }),
        ...((dto.department_type ?? dto.departmentType) !== undefined && {
          departmentType: dto.department_type ?? dto.departmentType,
        }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });

    return { data: department };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.department.delete({
      where: { id },
    });

    return { data: { id, deleted: true } };
  }
}
