import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, isDeleted: false },
      include: {
        userRoleAssignments: {
          where: { status: 'active' },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        employeeProfile: true,
      },
    });

    if (!user) return null;

    const roles = user.userRoleAssignments.map((ura: any) => ura.role.code);
    const permissions = [
      ...new Set(
        user.userRoleAssignments.flatMap((ura: any) =>
          ura.role.rolePermissions
            .filter((rp: any) => rp.effect === 'allow')
            .map((rp: any) => rp.permission.code),
        ),
      ),
    ];

    return {
      ...user,
      roles,
      permissions,
      password_hash: user.passwordHash,
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, isDeleted: false },
      include: {
        userRoleAssignments: {
          where: { status: 'active' },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        employeeProfile: true,
      },
    });

    if (!user) return null;

    const roles = user.userRoleAssignments.map((ura: any) => ura.role.code);
    const permissions = [
      ...new Set(
        user.userRoleAssignments.flatMap((ura: any) =>
          ura.role.rolePermissions
            .filter((rp: any) => rp.effect === 'allow')
            .map((rp: any) => rp.permission.code),
        ),
      ),
    ];

    return {
      id: user.id,
      email: user.email,
      orgId: user.orgId,
      displayName: user.employeeProfile?.displayName || user.email,
      userType: user.userType,
      status: user.status,
      mfaEnabled: user.mfaEnabled,
      roles,
      permissions,
      profile: user.employeeProfile,
    };
  }

  async findAll(orgId: string, page = 1, pageSize = 20) {
    const where = { orgId, isDeleted: false };
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: { employeeProfile: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u: any) => ({
        id: u.id,
        email: u.email,
        displayName: u.employeeProfile?.displayName || u.email,
        userType: u.userType,
        status: u.status,
      })),
      meta: { page, page_size: pageSize, total, has_next: page * pageSize < total },
    };
  }
}
