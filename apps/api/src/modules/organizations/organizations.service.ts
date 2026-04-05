import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.organization.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.organization.count(),
    ]);

    return { data, meta: { page, limit, total } };
  }

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: { departments: true },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    return { data: organization };
  }

  async create(dto: any) {
    const organization = await this.prisma.organization.create({
      data: {
        name: dto.name,
        code: dto.code,
        status: dto.status,
        defaultTimezone: dto.default_timezone ?? dto.defaultTimezone,
        defaultLocale: dto.default_locale ?? dto.defaultLocale,
        logoUrl: dto.logo_url ?? dto.logoUrl,
      },
    });

    return { data: organization };
  }

  async update(id: string, dto: any) {
    await this.findOne(id);

    const organization = await this.prisma.organization.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...((dto.default_timezone ?? dto.defaultTimezone) !== undefined && {
          defaultTimezone: dto.default_timezone ?? dto.defaultTimezone,
        }),
        ...((dto.default_locale ?? dto.defaultLocale) !== undefined && {
          defaultLocale: dto.default_locale ?? dto.defaultLocale,
        }),
        ...((dto.logo_url ?? dto.logoUrl) !== undefined && {
          logoUrl: dto.logo_url ?? dto.logoUrl,
        }),
      },
    });

    return { data: organization };
  }

  async remove(id: string) {
    await this.findOne(id);

    const organization = await this.prisma.organization.update({
      where: { id },
      data: { status: 'inactive' },
    });

    return { data: organization };
  }
}
