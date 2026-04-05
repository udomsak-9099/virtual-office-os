import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const DEMO_PASSWORD = "demo1234";

async function main() {
  console.log("Seeding Virtual Office OS database...");

  // ============================================================
  // 1. Organization
  // ============================================================
  const org = await prisma.organization.upsert({
    where: { code: "DEMO" },
    update: {},
    create: {
      name: "Demo Company",
      code: "DEMO",
      status: "active",
      defaultTimezone: "Asia/Bangkok",
      defaultLocale: "th",
    },
  });
  console.log(`  Organization: ${org.name} (${org.id})`);

  // ============================================================
  // 2. Departments (15 departments)
  // ============================================================
  const departmentDefs = [
    { code: "EXEC", name: "Executive Office", type: "executive" as const },
    { code: "SALES", name: "Sales", type: "sales" as const },
    { code: "MKT", name: "Marketing", type: "marketing" as const },
    { code: "CS", name: "Customer Service", type: "customer_service" as const },
    { code: "OPS", name: "Operations", type: "operations" as const },
    { code: "PROC", name: "Procurement", type: "procurement" as const },
    { code: "ACCT", name: "Accounting", type: "accounting" as const },
    { code: "FIN", name: "Finance", type: "finance" as const },
    { code: "HR", name: "Human Resources", type: "hr" as const },
    { code: "ADMIN", name: "Administration", type: "administration" as const },
    { code: "LEGAL", name: "Legal", type: "legal" as const },
    { code: "IT", name: "Information Technology", type: "it" as const },
    { code: "DATA", name: "Data & Business Intelligence", type: "data_bi" as const },
    { code: "RD", name: "Research & Development", type: "rd" as const },
    { code: "INTL", name: "International Business", type: "international" as const },
  ];

  const departments: Record<string, { id: string; name: string }> = {};
  for (const dept of departmentDefs) {
    const d = await prisma.department.upsert({
      where: { orgId_code: { orgId: org.id, code: dept.code } },
      update: {},
      create: {
        orgId: org.id,
        code: dept.code,
        name: dept.name,
        departmentType: dept.type,
        status: "active",
      },
    });
    departments[dept.code] = { id: d.id, name: d.name };
  }
  console.log(`  Departments: ${Object.keys(departments).length} created`);

  // ============================================================
  // 3. Roles — 3 human + AI roles per department
  // ============================================================
  const humanRoleDefs = [
    {
      code: "H1_CEO",
      name: "CEO / Managing Director",
      type: "human" as const,
      description: "Full executive access across all modules",
    },
    {
      code: "H2_OPS_COMMERCIAL",
      name: "Operations & Commercial Director",
      type: "human" as const,
      description: "Manages operations, sales, marketing, procurement, and customer service",
    },
    {
      code: "H3_FIN_COMPLIANCE",
      name: "Finance & Compliance Director",
      type: "human" as const,
      description: "Oversees finance, accounting, legal, HR, and audit functions",
    },
  ];

  const aiRoleDefs = departmentDefs.map((dept) => ({
    code: `AI_${dept.code}`,
    name: `AI Agent — ${dept.name}`,
    type: "ai" as const,
    description: `Autonomous AI agent for the ${dept.name} department`,
  }));

  const allRoleDefs = [...humanRoleDefs, ...aiRoleDefs];
  const roles: Record<string, string> = {};

  for (const r of allRoleDefs) {
    const role = await prisma.role.upsert({
      where: { orgId_code: { orgId: org.id, code: r.code } },
      update: {},
      create: {
        orgId: org.id,
        code: r.code,
        name: r.name,
        roleType: r.type,
        description: r.description,
        status: "active",
      },
    });
    roles[r.code] = role.id;
  }
  console.log(`  Roles: ${Object.keys(roles).length} created`);

  // ============================================================
  // 4. Permissions (core set)
  // ============================================================
  const permissionDefs = [
    { code: "USER_VIEW_OWN", module: "users", action: "view", scope: "own", desc: "View own profile" },
    { code: "USER_VIEW_ALL", module: "users", action: "view", scope: "global", desc: "View all users" },
    { code: "USER_CREATE", module: "users", action: "create", scope: "global", desc: "Create new users" },
    { code: "USER_DEACTIVATE", module: "users", action: "deactivate", scope: "global", desc: "Deactivate users" },
    { code: "ROLE_MANAGE", module: "roles", action: "manage", scope: "global", desc: "Manage roles" },
    { code: "TASK_VIEW_ALL", module: "tasks", action: "view", scope: "global", desc: "View all tasks" },
    { code: "TASK_CREATE", module: "tasks", action: "create", scope: "global", desc: "Create tasks" },
    { code: "TASK_ASSIGN", module: "tasks", action: "assign", scope: "global", desc: "Assign tasks" },
    { code: "PROJECT_VIEW_ALL", module: "projects", action: "view", scope: "global", desc: "View all projects" },
    { code: "PROJECT_CREATE", module: "projects", action: "create", scope: "global", desc: "Create projects" },
    { code: "PROJECT_MANAGE", module: "projects", action: "manage", scope: "global", desc: "Manage projects" },
    { code: "MEETING_CREATE", module: "meetings", action: "create", scope: "global", desc: "Create meetings" },
    { code: "DOC_VIEW_ALL", module: "documents", action: "view", scope: "global", desc: "View all documents" },
    { code: "DOC_UPLOAD", module: "documents", action: "upload", scope: "global", desc: "Upload documents" },
    { code: "APPROVAL_APPROVE_EXECUTIVE", module: "approvals", action: "approve", scope: "executive", desc: "Executive approval" },
    { code: "APPROVAL_APPROVE_FINANCIAL", module: "approvals", action: "approve", scope: "financial", desc: "Financial approval" },
    { code: "FIN_VIEW_DETAIL", module: "finance", action: "view", scope: "detail", desc: "View financial details" },
    { code: "FIN_PAYMENT_RELEASE", module: "finance", action: "release_payment", scope: "global", desc: "Release payments" },
    { code: "AI_ASK", module: "ai", action: "ask", scope: "global", desc: "Use AI assistant" },
    { code: "AUDIT_VIEW", module: "audit", action: "view", scope: "global", desc: "View audit logs" },
    { code: "DASHBOARD_EXECUTIVE", module: "dashboard", action: "view_executive", scope: "global", desc: "View executive dashboard" },
    { code: "SETTINGS_ORG", module: "settings", action: "manage_org", scope: "global", desc: "Manage org settings" },
  ];

  const permissions: Record<string, string> = {};
  for (const p of permissionDefs) {
    const perm = await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: {
        code: p.code,
        moduleName: p.module,
        actionName: p.action,
        scopeType: p.scope,
        description: p.desc,
      },
    });
    permissions[p.code] = perm.id;
  }
  console.log(`  Permissions: ${Object.keys(permissions).length} created`);

  // ============================================================
  // 5. Role-Permission mappings
  // ============================================================
  // CEO gets all permissions
  const ceoPermCodes = Object.keys(permissions);
  // Ops gets operational subset
  const opsPermCodes = [
    "USER_VIEW_OWN", "USER_VIEW_ALL", "TASK_VIEW_ALL", "TASK_CREATE", "TASK_ASSIGN",
    "PROJECT_VIEW_ALL", "PROJECT_CREATE", "PROJECT_MANAGE", "MEETING_CREATE",
    "DOC_VIEW_ALL", "DOC_UPLOAD", "AI_ASK",
  ];
  // Finance gets finance + compliance subset
  const finPermCodes = [
    "USER_VIEW_OWN", "USER_VIEW_ALL", "TASK_VIEW_ALL", "TASK_CREATE",
    "DOC_VIEW_ALL", "DOC_UPLOAD", "APPROVAL_APPROVE_FINANCIAL",
    "FIN_VIEW_DETAIL", "FIN_PAYMENT_RELEASE", "AUDIT_VIEW", "AI_ASK",
  ];

  const rolePermMappings: Array<{ roleCode: string; permCodes: string[] }> = [
    { roleCode: "H1_CEO", permCodes: ceoPermCodes },
    { roleCode: "H2_OPS_COMMERCIAL", permCodes: opsPermCodes },
    { roleCode: "H3_FIN_COMPLIANCE", permCodes: finPermCodes },
  ];

  let rpCount = 0;
  for (const mapping of rolePermMappings) {
    for (const permCode of mapping.permCodes) {
      const roleId = roles[mapping.roleCode];
      const permissionId = permissions[permCode];
      if (!roleId || !permissionId) continue;

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId } },
        update: {},
        create: { roleId, permissionId, effect: "allow" },
      });
      rpCount++;
    }
  }
  console.log(`  Role-Permission mappings: ${rpCount} created`);

  // ============================================================
  // 6. Demo Users
  // ============================================================
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS);

  const userDefs = [
    { email: "ceo@demo.com", roleCode: "H1_CEO", firstName: "Somchai", lastName: "Prasert", title: "CEO", deptCode: "EXEC", empCode: "EMP001" },
    { email: "ops@demo.com", roleCode: "H2_OPS_COMMERCIAL", firstName: "Nattaya", lastName: "Kittisak", title: "Operations Director", deptCode: "OPS", empCode: "EMP002" },
    { email: "finance@demo.com", roleCode: "H3_FIN_COMPLIANCE", firstName: "Wipada", lastName: "Suwannarat", title: "Finance Director", deptCode: "FIN", empCode: "EMP003" },
  ];

  const users: Record<string, string> = {};

  for (const u of userDefs) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        orgId: org.id,
        email: u.email,
        passwordHash,
        authProvider: "local",
        userType: "human",
        status: "active",
        mfaEnabled: false,
      },
    });
    users[u.email] = user.id;

    // Employee profile
    await prisma.employeeProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        orgId: org.id,
        userId: user.id,
        employeeCode: u.empCode,
        firstName: u.firstName,
        lastName: u.lastName,
        displayName: `${u.firstName} ${u.lastName}`,
        jobTitle: u.title,
        departmentId: departments[u.deptCode].id,
        employmentType: "full_time",
        startDate: new Date("2024-01-15"),
      },
    });

    // User-role assignment
    const roleId = roles[u.roleCode];
    // Check if assignment already exists
    const existing = await prisma.userRoleAssignment.findFirst({
      where: { userId: user.id, roleId, status: "active" },
    });
    if (!existing) {
      await prisma.userRoleAssignment.create({
        data: {
          userId: user.id,
          roleId,
          status: "active",
        },
      });
    }
  }
  console.log(`  Users: ${Object.keys(users).length} created with profiles and role assignments`);

  // ============================================================
  // 7. Sample Projects (2)
  // ============================================================
  const ceoId = users["ceo@demo.com"];
  const opsId = users["ops@demo.com"];
  const finId = users["finance@demo.com"];

  const project1 = await prisma.project.upsert({
    where: { orgId_code: { orgId: org.id, code: "PRJ-001" } },
    update: {},
    create: {
      orgId: org.id,
      code: "PRJ-001",
      name: "Digital Transformation Phase 1",
      description: "Modernize core business processes with AI-assisted workflows and digital document management",
      departmentId: departments["IT"].id,
      ownerUserId: ceoId,
      status: "active",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      priority: "critical",
    },
  });

  const project2 = await prisma.project.upsert({
    where: { orgId_code: { orgId: org.id, code: "PRJ-002" } },
    update: {},
    create: {
      orgId: org.id,
      code: "PRJ-002",
      name: "Q2 Sales Expansion — ASEAN Markets",
      description: "Expand sales operations across Southeast Asian markets with localized teams and AI-powered lead scoring",
      departmentId: departments["SALES"].id,
      ownerUserId: opsId,
      status: "planning",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-09-30"),
      priority: "high",
    },
  });

  // Add project members
  for (const pm of [
    { projectId: project1.id, userId: ceoId, projectRole: "sponsor", accessLevel: "contributor" },
    { projectId: project1.id, userId: opsId, projectRole: "lead", accessLevel: "contributor" },
    { projectId: project1.id, userId: finId, projectRole: "member", accessLevel: "contributor" },
    { projectId: project2.id, userId: opsId, projectRole: "lead", accessLevel: "contributor" },
    { projectId: project2.id, userId: ceoId, projectRole: "sponsor", accessLevel: "contributor" },
  ]) {
    await prisma.projectMember.upsert({
      where: { projectId_userId: { projectId: pm.projectId, userId: pm.userId } },
      update: {},
      create: pm,
    });
  }
  console.log(`  Projects: 2 created with members`);

  // ============================================================
  // 8. Sample Tasks (5)
  // ============================================================
  const taskDefs = [
    {
      title: "Set up Prisma ORM and database layer",
      description: "Configure Prisma schema, run migrations, and set up seed data for the Virtual Office OS project",
      projectId: project1.id,
      departmentId: departments["IT"].id,
      priority: "critical" as const,
      status: "in_progress" as const,
      ownerUserId: opsId,
      assigneeUserId: opsId,
      dueAt: new Date("2025-02-15"),
    },
    {
      title: "Review Q1 financial reports",
      description: "Consolidate and review quarterly financial statements, reconcile inter-department budget allocations",
      projectId: null,
      departmentId: departments["FIN"].id,
      priority: "high" as const,
      status: "open" as const,
      ownerUserId: finId,
      assigneeUserId: finId,
      dueAt: new Date("2025-04-10"),
    },
    {
      title: "Draft ASEAN market entry proposal",
      description: "Prepare market analysis and go-to-market strategy for Thailand, Vietnam, and Indonesia expansion",
      projectId: project2.id,
      departmentId: departments["SALES"].id,
      priority: "high" as const,
      status: "open" as const,
      ownerUserId: opsId,
      assigneeUserId: opsId,
      dueAt: new Date("2025-04-20"),
    },
    {
      title: "Implement role-based access control middleware",
      description: "Build RBAC middleware that checks permissions from Prisma-backed roles for every API endpoint",
      projectId: project1.id,
      departmentId: departments["IT"].id,
      priority: "critical" as const,
      status: "draft" as const,
      ownerUserId: ceoId,
      assigneeUserId: opsId,
      dueAt: new Date("2025-03-01"),
    },
    {
      title: "Onboard new compliance officer",
      description: "Complete all HR onboarding steps for the incoming compliance officer, including system access and training",
      projectId: null,
      departmentId: departments["HR"].id,
      priority: "medium" as const,
      status: "open" as const,
      ownerUserId: finId,
      assigneeUserId: finId,
      dueAt: new Date("2025-05-01"),
    },
  ];

  const tasks: string[] = [];
  for (const t of taskDefs) {
    const task = await prisma.task.create({
      data: {
        orgId: org.id,
        projectId: t.projectId,
        departmentId: t.departmentId,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        ownerUserId: t.ownerUserId,
        assigneeUserId: t.assigneeUserId,
        dueAt: t.dueAt,
        createdBy: t.ownerUserId,
      },
    });
    tasks.push(task.id);
  }
  console.log(`  Tasks: ${tasks.length} created`);

  // ============================================================
  // 9. Sample Meetings (3)
  // ============================================================
  const meeting1 = await prisma.meeting.create({
    data: {
      orgId: org.id,
      title: "Weekly Executive Standup",
      description: "Review key metrics, blockers, and upcoming milestones across all departments",
      meetingType: "standup",
      organizerUserId: ceoId,
      startAt: new Date("2025-04-07T09:00:00+07:00"),
      endAt: new Date("2025-04-07T09:30:00+07:00"),
      locationType: "virtual",
      externalLink: "https://meet.example.com/exec-standup",
      status: "scheduled",
    },
  });

  const meeting2 = await prisma.meeting.create({
    data: {
      orgId: org.id,
      title: "Digital Transformation Sprint Review",
      description: "Demo sprint deliverables for the DX Phase 1 project and gather stakeholder feedback",
      meetingType: "review",
      organizerUserId: opsId,
      relatedProjectId: project1.id,
      relatedDepartmentId: departments["IT"].id,
      startAt: new Date("2025-04-08T14:00:00+07:00"),
      endAt: new Date("2025-04-08T15:00:00+07:00"),
      locationType: "hybrid",
      status: "scheduled",
    },
  });

  const meeting3 = await prisma.meeting.create({
    data: {
      orgId: org.id,
      title: "Q2 Budget Planning Session",
      description: "Finalize department budgets and resource allocation for Q2 2025",
      meetingType: "planning",
      organizerUserId: finId,
      relatedDepartmentId: departments["FIN"].id,
      startAt: new Date("2025-04-09T10:00:00+07:00"),
      endAt: new Date("2025-04-09T12:00:00+07:00"),
      locationType: "physical",
      status: "scheduled",
    },
  });

  // Add attendees to meetings
  const attendeeDefs = [
    { meetingId: meeting1.id, userId: ceoId, attendeeRole: "organizer", responseStatus: "accepted" as const },
    { meetingId: meeting1.id, userId: opsId, attendeeRole: "attendee", responseStatus: "accepted" as const },
    { meetingId: meeting1.id, userId: finId, attendeeRole: "attendee", responseStatus: "accepted" as const },
    { meetingId: meeting2.id, userId: opsId, attendeeRole: "organizer", responseStatus: "accepted" as const },
    { meetingId: meeting2.id, userId: ceoId, attendeeRole: "attendee", responseStatus: "tentative" as const },
    { meetingId: meeting3.id, userId: finId, attendeeRole: "organizer", responseStatus: "accepted" as const },
    { meetingId: meeting3.id, userId: ceoId, attendeeRole: "attendee", responseStatus: "accepted" as const },
    { meetingId: meeting3.id, userId: opsId, attendeeRole: "attendee", responseStatus: "pending" as const },
  ];

  for (const a of attendeeDefs) {
    await prisma.meetingAttendee.create({ data: a });
  }
  console.log(`  Meetings: 3 created with attendees`);

  // ============================================================
  // 10. Sample Documents (2)
  // ============================================================
  const doc1 = await prisma.document.create({
    data: {
      orgId: org.id,
      projectId: project1.id,
      departmentId: departments["IT"].id,
      ownerUserId: opsId,
      documentType: "technical",
      title: "Virtual Office OS — Architecture Design Document",
      status: "active",
      classification: "internal",
      isControlled: true,
      createdBy: opsId,
    },
  });

  const doc1Version = await prisma.documentVersion.create({
    data: {
      documentId: doc1.id,
      versionNo: 1,
      storageObjectKey: "documents/prj-001/architecture-v1.pdf",
      fileName: "VOS_Architecture_v1.pdf",
      mimeType: "application/pdf",
      fileSizeBytes: 2_450_000,
      uploadedBy: opsId,
      versionStatus: "current",
    },
  });

  await prisma.document.update({
    where: { id: doc1.id },
    data: { currentVersionId: doc1Version.id },
  });

  await prisma.documentTag.createMany({
    data: [
      { documentId: doc1.id, tagName: "architecture" },
      { documentId: doc1.id, tagName: "technical" },
      { documentId: doc1.id, tagName: "phase-1" },
    ],
  });

  const doc2 = await prisma.document.create({
    data: {
      orgId: org.id,
      departmentId: departments["FIN"].id,
      ownerUserId: finId,
      documentType: "policy",
      title: "Expense Reimbursement Policy 2025",
      status: "approved",
      classification: "internal",
      isControlled: true,
      createdBy: finId,
    },
  });

  const doc2Version = await prisma.documentVersion.create({
    data: {
      documentId: doc2.id,
      versionNo: 1,
      storageObjectKey: "documents/policies/expense-policy-2025-v1.pdf",
      fileName: "Expense_Policy_2025_v1.pdf",
      mimeType: "application/pdf",
      fileSizeBytes: 850_000,
      uploadedBy: finId,
      versionStatus: "current",
    },
  });

  await prisma.document.update({
    where: { id: doc2.id },
    data: { currentVersionId: doc2Version.id },
  });

  await prisma.documentTag.createMany({
    data: [
      { documentId: doc2.id, tagName: "policy" },
      { documentId: doc2.id, tagName: "finance" },
      { documentId: doc2.id, tagName: "2025" },
    ],
  });

  console.log(`  Documents: 2 created with versions and tags`);

  // ============================================================
  // 11. Sample Approval Requests (2)
  // ============================================================
  const approval1 = await prisma.approvalRequest.create({
    data: {
      orgId: org.id,
      requestType: "document_approval",
      sourceType: "document",
      sourceId: doc1.id,
      requesterUserId: opsId,
      currentStepNo: 1,
      status: "submitted",
      submittedAt: new Date("2025-03-20T10:00:00+07:00"),
    },
  });

  await prisma.approvalStep.create({
    data: {
      approvalRequestId: approval1.id,
      stepNo: 1,
      approverType: "executive",
      approverReferenceId: ceoId,
      decisionStatus: "pending",
      dueAt: new Date("2025-03-27T17:00:00+07:00"),
    },
  });

  const approval2 = await prisma.approvalRequest.create({
    data: {
      orgId: org.id,
      requestType: "expense_approval",
      sourceType: "expense_claim",
      sourceId: doc2.id, // placeholder source
      requesterUserId: opsId,
      currentStepNo: 2,
      status: "in_review",
      submittedAt: new Date("2025-03-25T14:00:00+07:00"),
    },
  });

  const step2a = await prisma.approvalStep.create({
    data: {
      approvalRequestId: approval2.id,
      stepNo: 1,
      approverType: "department_head",
      approverReferenceId: opsId,
      decisionStatus: "approved",
      decidedAt: new Date("2025-03-25T16:30:00+07:00"),
    },
  });

  await prisma.approvalDecision.create({
    data: {
      approvalStepId: step2a.id,
      decisionType: "approve",
      decidedByUserId: ceoId,
      decisionComment: "Approved. Costs are within budget.",
    },
  });

  await prisma.approvalStep.create({
    data: {
      approvalRequestId: approval2.id,
      stepNo: 2,
      approverType: "finance",
      approverReferenceId: finId,
      decisionStatus: "pending",
      dueAt: new Date("2025-04-01T17:00:00+07:00"),
    },
  });

  console.log(`  Approval Requests: 2 created with steps and decisions`);

  console.log("\nSeed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
