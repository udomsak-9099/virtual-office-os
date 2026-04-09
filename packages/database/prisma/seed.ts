import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const PASSWORD = "1234";

/**
 * LAWI Energy Holding — Real Data Seed
 * Source: Project Lawi Investment Opportunity (April 2026)
 *
 * Company: Lawi Energy Holding
 * Shareholders: Thai 51% / Malaysian 49%
 * Project Cost: 4,900 MB | Equity 2,450 MB | Debt 2,450 MB
 * Returns: PIRR 10.5-12.0% | EIRR 14.5-16.0% | Payback 7-10 years
 *
 * Business Units:
 * - BU1: Renewable Energy (Biomass / WTE)
 * - BU2: Alternative Fuel (RDF Plants)
 * - BU3: Advanced Material (Activated Carbon)
 */

async function truncateAll() {
  console.log("Truncating all existing data...");
  // CASCADE takes care of FK order; only reference actual tables that exist
  const tables = [
    "approval_decisions",
    "approval_steps",
    "approval_requests",
    "workflow_events",
    "workflow_instances",
    "document_access_rules",
    "document_tags",
    "document_versions",
    "documents",
    "action_items",
    "meeting_notes",
    "meeting_attendees",
    "meetings",
    "task_comments",
    "task_checklist_items",
    "tasks",
    "project_members",
    "projects",
    "chat_messages",
    "chat_channel_members",
    "chat_channels",
    "notifications",
    "audit_logs",
    "ai_outputs",
    "ai_requests",
    "user_role_assignments",
    "sessions",
    "role_permissions",
    "permissions",
    "roles",
    "employee_profiles",
    "users",
    "departments",
    "organizations",
  ];
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables.join(", ")} RESTART IDENTITY CASCADE`);
  console.log("  All tables truncated");
}

async function main() {
  console.log("=== LAWI Energy Holding — Production Seed ===\n");

  await truncateAll();

  // ============================================================
  // 1. Organization
  // ============================================================
  const org = await prisma.organization.create({
    data: {
      name: "Lawi Energy Holding",
      code: "LAWI",
      status: "active",
      defaultTimezone: "Asia/Bangkok",
      defaultLocale: "th",
    },
  });
  console.log(`\nOrganization: ${org.name}`);

  // ============================================================
  // 2. Departments — Business Units per PDF structure
  // ============================================================
  const depts = await Promise.all([
    prisma.department.create({
      data: {
        orgId: org.id,
        name: "Executive Office",
        code: "EXEC",
        departmentType: "executive",
        status: "active",
      },
    }),
    prisma.department.create({
      data: {
        orgId: org.id,
        name: "BU1 — Renewable Energy",
        code: "BU1",
        departmentType: "operations",
        status: "active",
      },
    }),
    prisma.department.create({
      data: {
        orgId: org.id,
        name: "BU2 — Alternative Fuel",
        code: "BU2",
        departmentType: "operations",
        status: "active",
      },
    }),
    prisma.department.create({
      data: {
        orgId: org.id,
        name: "BU3 — Advanced Material",
        code: "BU3",
        departmentType: "operations",
        status: "active",
      },
    }),
    prisma.department.create({
      data: {
        orgId: org.id,
        name: "Engineering & EPC",
        code: "ENG",
        departmentType: "operations",
        status: "active",
      },
    }),
    prisma.department.create({
      data: {
        orgId: org.id,
        name: "Finance & Investment",
        code: "FIN",
        departmentType: "finance",
        status: "active",
      },
    }),
    prisma.department.create({
      data: {
        orgId: org.id,
        name: "Legal & Compliance",
        code: "LEGAL",
        departmentType: "legal",
        status: "active",
      },
    }),
    prisma.department.create({
      data: {
        orgId: org.id,
        name: "Project Development",
        code: "PD",
        departmentType: "operations",
        status: "active",
      },
    }),
    prisma.department.create({
      data: {
        orgId: org.id,
        name: "International Business",
        code: "INTL",
        departmentType: "international",
        status: "active",
      },
    }),
  ]);
  const [execDept, bu1, bu2, bu3, engDept, finDept, legalDept, pdDept, intlDept] = depts;
  console.log(`Departments: ${depts.length} created`);

  // ============================================================
  // 3. Roles
  // ============================================================
  const ceoRole = await prisma.role.create({
    data: {
      orgId: org.id,
      code: "CEO_EXECUTIVE",
      name: "CEO / Executive",
      roleType: "human",
      description: "Chief Executive — full access",
      status: "active",
    },
  });
  const directorRole = await prisma.role.create({
    data: {
      orgId: org.id,
      code: "DIRECTOR",
      name: "Director",
      roleType: "human",
      description: "Business unit director",
      status: "active",
    },
  });
  const managerRole = await prisma.role.create({
    data: {
      orgId: org.id,
      code: "MANAGER",
      name: "Manager",
      roleType: "human",
      description: "Department manager",
      status: "active",
    },
  });
  const staffRole = await prisma.role.create({
    data: {
      orgId: org.id,
      code: "STAFF",
      name: "Staff",
      roleType: "human",
      description: "Team member",
      status: "active",
    },
  });
  console.log("Roles: 4 created");

  // ============================================================
  // 4. Permissions & Role-Permission mappings
  // ============================================================
  const permissionCodes = [
    ["USER_VIEW_ALL", "users", "view", "global"],
    ["USER_CREATE", "users", "create", "global"],
    ["ROLE_MANAGE", "roles", "manage", "global"],
    ["TASK_VIEW_ALL", "tasks", "view", "global"],
    ["TASK_CREATE", "tasks", "create", "global"],
    ["TASK_ASSIGN", "tasks", "assign", "global"],
    ["PROJECT_VIEW_ALL", "projects", "view", "global"],
    ["PROJECT_CREATE", "projects", "create", "global"],
    ["PROJECT_MANAGE", "projects", "manage", "global"],
    ["MEETING_CREATE", "meetings", "create", "global"],
    ["DOC_VIEW_ALL", "documents", "view", "global"],
    ["DOC_UPLOAD", "documents", "upload", "global"],
    ["DOC_APPROVE_CONTROLLED", "documents", "approve", "global"],
    ["APPROVAL_CREATE", "approvals", "create", "global"],
    ["APPROVAL_APPROVE_STANDARD", "approvals", "approve", "standard"],
    ["APPROVAL_APPROVE_FINANCIAL", "approvals", "approve", "financial"],
    ["APPROVAL_APPROVE_EXECUTIVE", "approvals", "approve", "executive"],
    ["FIN_VIEW_DETAIL", "finance", "view", "detail"],
    ["FIN_PAYMENT_APPROVE", "finance", "approve", "global"],
    ["FIN_PAYMENT_RELEASE", "finance", "release", "global"],
    ["AI_ASK", "ai", "ask", "global"],
    ["AUDIT_VIEW", "audit", "view", "global"],
    ["DASHBOARD_EXECUTIVE", "dashboard", "view", "executive"],
    ["SETTINGS_ORG", "settings", "manage_org", "global"],
  ];

  const perms = await Promise.all(
    permissionCodes.map(([code, module_name, action_name, scope_type]) =>
      prisma.permission.create({
        data: { code, moduleName: module_name, actionName: action_name, scopeType: scope_type, description: code },
      })
    )
  );
  console.log(`Permissions: ${perms.length} created`);

  // CEO gets all permissions
  await prisma.rolePermission.createMany({
    data: perms.map((p) => ({ roleId: ceoRole.id, permissionId: p.id, effect: "allow" })),
  });
  // Director gets most except settings/user management
  const directorPerms = perms.filter((p) => !["ROLE_MANAGE", "SETTINGS_ORG", "FIN_PAYMENT_RELEASE"].includes(p.code));
  await prisma.rolePermission.createMany({
    data: directorPerms.map((p) => ({ roleId: directorRole.id, permissionId: p.id, effect: "allow" })),
  });
  // Manager gets operational permissions
  const managerPerms = perms.filter((p) =>
    ["TASK_VIEW_ALL", "TASK_CREATE", "TASK_ASSIGN", "PROJECT_VIEW_ALL", "PROJECT_CREATE", "MEETING_CREATE", "DOC_VIEW_ALL", "DOC_UPLOAD", "APPROVAL_CREATE", "AI_ASK"].includes(p.code)
  );
  await prisma.rolePermission.createMany({
    data: managerPerms.map((p) => ({ roleId: managerRole.id, permissionId: p.id, effect: "allow" })),
  });
  // Staff gets view + task create
  const staffPerms = perms.filter((p) =>
    ["TASK_VIEW_ALL", "TASK_CREATE", "PROJECT_VIEW_ALL", "MEETING_CREATE", "DOC_VIEW_ALL", "DOC_UPLOAD", "APPROVAL_CREATE", "AI_ASK"].includes(p.code)
  );
  await prisma.rolePermission.createMany({
    data: staffPerms.map((p) => ({ roleId: staffRole.id, permissionId: p.id, effect: "allow" })),
  });
  console.log("Role-permission mappings created");

  // ============================================================
  // 5. Users — Real Lawi Team from PDF page 3
  // ============================================================
  const pwdHash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

  // Admin user (system)
  const adminUser = await prisma.user.create({
    data: {
      orgId: org.id,
      email: "admin",
      passwordHash: pwdHash,
      authProvider: "local",
      userType: "human",
      status: "active",
      mfaEnabled: false,
    },
  });
  await prisma.employeeProfile.create({
    data: {
      orgId: org.id,
      userId: adminUser.id,
      employeeCode: "ADM-001",
      firstName: "System",
      lastName: "Administrator",
      displayName: "Admin",
      jobTitle: "System Administrator",
      departmentId: execDept.id,
      employmentType: "full_time",
    },
  });
  await prisma.userRoleAssignment.create({
    data: { userId: adminUser.id, roleId: ceoRole.id, status: "active" },
  });

  // Dr. Udomsak Kaewsiri — Technical & Policy Lead
  const udomsakUser = await prisma.user.create({
    data: {
      orgId: org.id,
      email: "udomsak@lawi.energy",
      passwordHash: pwdHash,
      authProvider: "local",
      userType: "human",
      status: "active",
      mfaEnabled: false,
    },
  });
  await prisma.employeeProfile.create({
    data: {
      orgId: org.id,
      userId: udomsakUser.id,
      employeeCode: "EXEC-001",
      firstName: "Udomsak",
      lastName: "Kaewsiri",
      displayName: "Dr. Udomsak Kaewsiri",
      jobTitle: "Founder & Executive Director — Technical & Policy Lead",
      departmentId: execDept.id,
      employmentType: "full_time",
    },
  });
  await prisma.userRoleAssignment.create({
    data: { userId: udomsakUser.id, roleId: ceoRole.id, status: "active" },
  });

  // Rathakrishnan Arumugam — EPC & Engineering Lead (Malaysia)
  const rathaUser = await prisma.user.create({
    data: {
      orgId: org.id,
      email: "rathakrishnan@lawi.energy",
      passwordHash: pwdHash,
      authProvider: "local",
      userType: "human",
      status: "active",
      mfaEnabled: false,
    },
  });
  await prisma.employeeProfile.create({
    data: {
      orgId: org.id,
      userId: rathaUser.id,
      employeeCode: "ENG-001",
      firstName: "Rathakrishnan",
      lastName: "Arumugam",
      displayName: "Rathakrishnan Arumugam",
      jobTitle: "Project Director — Lawi Engineering (Malaysia)",
      departmentId: engDept.id,
      employmentType: "full_time",
      workLocation: "Kuala Lumpur, Malaysia",
    },
  });
  await prisma.userRoleAssignment.create({
    data: { userId: rathaUser.id, roleId: directorRole.id, status: "active" },
  });

  // Suntad Yingyong — Project Development Lead
  const suntadUser = await prisma.user.create({
    data: {
      orgId: org.id,
      email: "suntad@lawi.energy",
      passwordHash: pwdHash,
      authProvider: "local",
      userType: "human",
      status: "active",
      mfaEnabled: false,
    },
  });
  await prisma.employeeProfile.create({
    data: {
      orgId: org.id,
      userId: suntadUser.id,
      employeeCode: "PD-001",
      firstName: "Suntad",
      lastName: "Yingyong",
      displayName: "Suntad Yingyong",
      jobTitle: "Managing Director — Global Green Holding / Project Development Lead",
      departmentId: pdDept.id,
      employmentType: "full_time",
    },
  });
  await prisma.userRoleAssignment.create({
    data: { userId: suntadUser.id, roleId: directorRole.id, status: "active" },
  });

  // Manaphat Asakit — Finance & Strategy Lead
  const manaphatUser = await prisma.user.create({
    data: {
      orgId: org.id,
      email: "manaphat@lawi.energy",
      passwordHash: pwdHash,
      authProvider: "local",
      userType: "human",
      status: "active",
      mfaEnabled: false,
    },
  });
  await prisma.employeeProfile.create({
    data: {
      orgId: org.id,
      userId: manaphatUser.id,
      employeeCode: "FIN-001",
      firstName: "Manaphat",
      lastName: "Asakit",
      displayName: "Manaphat Asakit",
      jobTitle: "Strategic Advisor — Finance & Strategy Lead",
      departmentId: finDept.id,
      employmentType: "full_time",
    },
  });
  await prisma.userRoleAssignment.create({
    data: { userId: manaphatUser.id, roleId: directorRole.id, status: "active" },
  });

  console.log("Users: 5 created (admin + 4 real team members)");

  // ============================================================
  // 6. Projects — Real from PDF (Investment Pipeline)
  // ============================================================

  // BU1-1: UPT Biomass Power Plant Acquisition (Operating)
  const upt = await prisma.project.create({
    data: {
      orgId: org.id,
      code: "BU1-UPT-ACQ",
      name: "UPT Biomass Power Plant Acquisition",
      description:
        "Acquisition of operating 9.9 MW biomass power plant in Nakhon Ratchasima. Operating since May 2019 with 13 years remaining PPA. Woodchip biomass feedstock. Project Cost: 800 MB, Equity: 400 MB, PIRR 10-12%, EIRR 13-17%. Annual Generation: 66 GWh, Revenue: 308 MB, EBITDA: 144 MB. Delivers Day-1 cash flow with zero construction risk.",
      departmentId: bu1.id,
      ownerUserId: suntadUser.id,
      status: "active",
      priority: "high",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2039-05-31"),
    },
  });

  // BU1-2: WTE Development Nonthaburi (Greenfield)
  const wteNon = await prisma.project.create({
    data: {
      orgId: org.id,
      code: "BU1-WTE-NON",
      name: "WTE Development — Nonthaburi (Greenfield)",
      description:
        "Development of 30 MW Waste-to-Energy power plant in Nonthaburi (24 MW contracted capacity). Municipal Solid Waste (MSW) feedstock. 20-year Long-Term PPA. Project Cost: 3,500 MB, Equity: 1,750 MB, PIRR 10-13%, EIRR 16-21%. Target: 160 GWh/year, Revenue 637 MB, EBITDA 480 MB. Located near major urban waste sources for stable feedstock.",
      departmentId: bu1.id,
      ownerUserId: rathaUser.id,
      status: "planning",
      priority: "critical",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2046-12-31"),
    },
  });

  // BU2-1: RDF Plant Surat Thani (GP4)
  const rdfSurat = await prisma.project.create({
    data: {
      orgId: org.id,
      code: "BU2-RDF-SRT",
      name: "RDF Plant — Surat Thani (GP4)",
      description:
        "RDF (Refuse-Derived Fuel) plant in Surat Thani supplying GP4 WTE Plant. 250K tons/year capacity. Processing: Crushing, Drying, Sieving, Pelletizing. COD: End of 2026. Integrated waste-to-fuel value chain securing feedstock for downstream WTE operations.",
      departmentId: bu2.id,
      ownerUserId: rathaUser.id,
      status: "planning",
      priority: "high",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-12-31"),
    },
  });

  // BU2-2: RDF Plant Nonthaburi (TPCH)
  const rdfNon = await prisma.project.create({
    data: {
      orgId: org.id,
      code: "BU2-RDF-NON",
      name: "RDF Plant — Nonthaburi (TPCH)",
      description:
        "RDF plant in Nonthaburi supplying TPCH WTE 24MW. Long-term contract. COD: End of 2027. Project Cost: 500 MB, Equity: 250 MB. Expected PIRR 10-14%, EIRR 12-18%. Annual Output 250K tons at 80KB/ton, Revenue 300 MB, EBITDA 64 MB (21.3%).",
      departmentId: bu2.id,
      ownerUserId: suntadUser.id,
      status: "planning",
      priority: "high",
      startDate: new Date("2026-06-01"),
      endDate: new Date("2027-12-31"),
    },
  });

  // BU3-1: Activated Carbon Surat Thani (GP4)
  const acSurat = await prisma.project.create({
    data: {
      orgId: org.id,
      code: "BU3-AC-SRT",
      name: "Activated Carbon — Surat Thani (GP4)",
      description:
        "Activated carbon production from wood/PKS biomass in Surat Thani. End-user: GP4 WTE Plant. Long-term contract. COD: End of 2026. Part of BU3 Advanced Material portfolio transforming low-value biomass into high-margin industrial inputs.",
      departmentId: bu3.id,
      ownerUserId: rathaUser.id,
      status: "planning",
      priority: "medium",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-12-31"),
    },
  });

  // BU3-2: Activated Carbon Ayutthaya (GULF/BWG)
  const acAyu = await prisma.project.create({
    data: {
      orgId: org.id,
      code: "BU3-AC-AYU",
      name: "Activated Carbon — Ayutthaya (GULF/BWG)",
      description:
        "Activated carbon production from coconut biomass in Ayutthaya. End-users: GULF, BWG. Long-term contract. COD: End of 2027. Project Cost: 100 MB, Equity: 50 MB. Expected PIRR 12-20%, EIRR 15-25%. Annual Output: 1,000 tons at 70KB/ton, Revenue 70 MB, EBITDA 25 MB (28.5%). Modular 100 kg/hr capacity.",
      departmentId: bu3.id,
      ownerUserId: suntadUser.id,
      status: "planning",
      priority: "medium",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-12-31"),
    },
  });

  // Future: Biomass + Solar + BESS for Data Center
  const hybridDC = await prisma.project.create({
    data: {
      orgId: org.id,
      code: "BU1-HYBRID-DC",
      name: "Hybrid Biomass+Solar+BESS — Data Center (Kanchanaburi)",
      description:
        "Western Economic Corridor project: 24/7 firm renewable power for data centers. Biomass Power Plant 2x10 MW + Solar Farm 50-60 MW + BESS 50-60 MW. Location: Kanchanaburi Dry Port — Laem Chabang — Dawei corridor. 22 kV substation and distribution infrastructure. Transforms intermittent solar into premium 24/7 contracted power below grid parity.",
      departmentId: bu1.id,
      ownerUserId: udomsakUser.id,
      status: "planning",
      priority: "high",
      startDate: new Date("2027-01-01"),
      endDate: new Date("2047-12-31"),
    },
  });

  console.log("Projects: 7 created (real Lawi investment pipeline)");

  // Project members
  const allProjects = [upt, wteNon, rdfSurat, rdfNon, acSurat, acAyu, hybridDC];
  for (const p of allProjects) {
    await prisma.projectMember.createMany({
      data: [
        { projectId: p.id, userId: udomsakUser.id, projectRole: "sponsor", accessLevel: "full" },
        { projectId: p.id, userId: rathaUser.id, projectRole: "technical_lead", accessLevel: "full" },
        { projectId: p.id, userId: suntadUser.id, projectRole: "development_lead", accessLevel: "full" },
        { projectId: p.id, userId: manaphatUser.id, projectRole: "finance_lead", accessLevel: "full" },
      ],
      skipDuplicates: true,
    });
  }

  // ============================================================
  // 7. Tasks — Real work items from investment process
  // ============================================================
  const tasks = [
    // UPT Acquisition tasks
    {
      title: "Complete Due Diligence on UPT Biomass Power Plant",
      description: "Technical, financial, legal, and environmental DD on operating 9.9MW biomass plant in Nakhon Ratchasima. Review 2019-2025 operating data, PPA compliance, maintenance records.",
      projectId: upt.id,
      departmentId: bu1.id,
      assignee: manaphatUser.id,
      owner: udomsakUser.id,
      priority: "critical",
      status: "in_progress",
      dueAt: "2026-05-15",
    },
    {
      title: "Negotiate UPT Share Purchase Agreement (SPA)",
      description: "Draft and negotiate SPA for UPT acquisition. Target closing Q2 2026. Price c. 800 MB equity 400 MB.",
      projectId: upt.id,
      departmentId: legalDept.id,
      assignee: manaphatUser.id,
      owner: udomsakUser.id,
      priority: "critical",
      status: "open",
      dueAt: "2026-05-30",
    },
    {
      title: "Prepare UPT Acquisition Financing (50% Debt)",
      description: "Arrange debt financing 400 MB for UPT acquisition. Engage banks — BBL, KBANK, SCB. Target sustainability-linked loan.",
      projectId: upt.id,
      departmentId: finDept.id,
      assignee: manaphatUser.id,
      owner: manaphatUser.id,
      priority: "high",
      status: "open",
      dueAt: "2026-06-15",
    },
    // WTE Nonthaburi tasks
    {
      title: "Secure WTE Nonthaburi Land and Permits",
      description: "Identify and secure 30 MW WTE site in Nonthaburi. Obtain EIA, construction permit, MSW offtake agreement with local municipality.",
      projectId: wteNon.id,
      departmentId: bu1.id,
      assignee: suntadUser.id,
      owner: udomsakUser.id,
      priority: "critical",
      status: "open",
      dueAt: "2026-08-31",
    },
    {
      title: "WTE Nonthaburi — Apply for PPA with PEA/GULF",
      description: "Submit 24 MW PPA application under Feed-in Tariff + adjustment. Target 20-year long-term PPA with PEA or corporate off-taker.",
      projectId: wteNon.id,
      departmentId: bu1.id,
      assignee: udomsakUser.id,
      owner: udomsakUser.id,
      priority: "critical",
      status: "open",
      dueAt: "2026-07-01",
    },
    {
      title: "WTE Nonthaburi — Preliminary Engineering Design",
      description: "Complete FEED (Front-End Engineering Design) for 30 MW WTE plant. Include combustion system, emission control, grid connection. Lawi Engineering Malaysia as technical advisor.",
      projectId: wteNon.id,
      departmentId: engDept.id,
      assignee: rathaUser.id,
      owner: rathaUser.id,
      priority: "high",
      status: "open",
      dueAt: "2026-09-30",
    },
    // RDF tasks
    {
      title: "RDF Surat Thani — Equipment Procurement (Crushing/Drying/Pelletizing)",
      description: "Source and procure RDF processing equipment for 250K tons/year capacity. Coordinate with Lawi Engineering Malaysia on technology selection.",
      projectId: rdfSurat.id,
      departmentId: bu2.id,
      assignee: rathaUser.id,
      owner: rathaUser.id,
      priority: "high",
      status: "open",
      dueAt: "2026-07-15",
    },
    {
      title: "RDF Nonthaburi — Secure Waste Supply Agreements",
      description: "Negotiate multi-source waste feedstock supply contracts. Target MSW, industrial waste, agricultural residues. Ensure volume and quality stability.",
      projectId: rdfNon.id,
      departmentId: bu2.id,
      assignee: suntadUser.id,
      owner: suntadUser.id,
      priority: "high",
      status: "open",
      dueAt: "2026-10-31",
    },
    // Activated Carbon tasks
    {
      title: "Activated Carbon Ayutthaya — Pilot Plant Commissioning",
      description: "Commission 100 kg/hr modular activated carbon pilot plant at Ayutthaya site. Validate quality for GULF/BWG offtake.",
      projectId: acAyu.id,
      departmentId: bu3.id,
      assignee: rathaUser.id,
      owner: rathaUser.id,
      priority: "medium",
      status: "open",
      dueAt: "2027-03-31",
    },
    // Finance / Investment tasks
    {
      title: "Prepare Investor Pitch Deck (Rev4)",
      description: "Update Project Lawi investment opportunity presentation with latest DD findings, financial model, and capital structure. For Thai and Malaysian investors.",
      projectId: null,
      departmentId: finDept.id,
      assignee: manaphatUser.id,
      owner: udomsakUser.id,
      priority: "high",
      status: "in_progress",
      dueAt: "2026-04-30",
    },
    {
      title: "Set up Lawi Energy Holding SPV Structure",
      description: "Incorporate holding company and SPV structure per PDF page 15. Thai 51% / Malaysian 49% ownership. Ring-fence projects by BU.",
      projectId: null,
      departmentId: legalDept.id,
      assignee: manaphatUser.id,
      owner: udomsakUser.id,
      priority: "critical",
      status: "in_progress",
      dueAt: "2026-05-15",
    },
    {
      title: "Green Financing — Engage with TSB/EXIM on Sustainability-Linked Loan",
      description: "Explore green bond / sustainability-linked loan options for 2,450 MB debt portion. Align with PDP 2024 and net-zero roadmap.",
      projectId: null,
      departmentId: finDept.id,
      assignee: manaphatUser.id,
      owner: manaphatUser.id,
      priority: "high",
      status: "open",
      dueAt: "2026-06-30",
    },
    // Executive / strategic
    {
      title: "Board Meeting — Q2 2026 Investment Committee",
      description: "Review investment pipeline, approve UPT acquisition, align on greenfield prioritization. Present risk mitigation framework.",
      projectId: null,
      departmentId: execDept.id,
      assignee: udomsakUser.id,
      owner: udomsakUser.id,
      priority: "critical",
      status: "open",
      dueAt: "2026-05-20",
    },
    {
      title: "ESG Impact Measurement Framework",
      description: "Define measurable ESG KPIs across waste diversion, coal displacement, CO2 reduction, and local jobs. Baseline for integrated platform reporting.",
      projectId: null,
      departmentId: execDept.id,
      assignee: udomsakUser.id,
      owner: udomsakUser.id,
      priority: "medium",
      status: "open",
      dueAt: "2026-07-31",
    },
    {
      title: "Quarterly Risk Review — Feedstock, Revenue, Execution",
      description: "Review key risks per PDF page 16: feedstock supply, revenue/offtake, technology, execution, price/market. Update mitigation matrix.",
      projectId: null,
      departmentId: execDept.id,
      assignee: udomsakUser.id,
      owner: udomsakUser.id,
      priority: "high",
      status: "open",
      dueAt: "2026-06-30",
    },
  ];

  for (const t of tasks) {
    await prisma.task.create({
      data: {
        orgId: org.id,
        projectId: t.projectId,
        departmentId: t.departmentId,
        title: t.title,
        description: t.description,
        priority: t.priority as any,
        status: t.status as any,
        ownerUserId: t.owner,
        assigneeUserId: t.assignee,
        dueAt: new Date(t.dueAt),
        createdBy: udomsakUser.id,
        updatedBy: udomsakUser.id,
      },
    });
  }
  console.log(`Tasks: ${tasks.length} created`);

  // ============================================================
  // 8. Meetings
  // ============================================================
  const meetings = [
    {
      title: "Q2 2026 Investment Committee Meeting",
      description: "Quarterly review of investment pipeline. Approve UPT acquisition. Review WTE Nonthaburi development plan and greenfield projects.",
      type: "board",
      startAt: "2026-05-20T09:00:00Z",
      endAt: "2026-05-20T12:00:00Z",
      organizer: udomsakUser.id,
    },
    {
      title: "UPT Acquisition — DD Review Meeting",
      description: "Final due diligence review for UPT Biomass Power Plant acquisition. Technical, financial, legal presentation.",
      type: "project",
      startAt: "2026-05-12T14:00:00Z",
      endAt: "2026-05-12T17:00:00Z",
      organizer: manaphatUser.id,
      project: upt.id,
    },
    {
      title: "WTE Nonthaburi Kick-off — Engineering & Development",
      description: "Project kick-off for 30 MW WTE Nonthaburi greenfield development. Coordinate FEED, permits, PPA application.",
      type: "project",
      startAt: "2026-04-28T10:00:00Z",
      endAt: "2026-04-28T12:00:00Z",
      organizer: rathaUser.id,
      project: wteNon.id,
    },
    {
      title: "Thai-Malaysian Shareholder Alignment",
      description: "Quarterly alignment between Thai (51%) and Malaysian (49%) shareholders. Review governance, execution progress, strategic direction.",
      type: "executive",
      startAt: "2026-05-05T10:00:00Z",
      endAt: "2026-05-05T12:00:00Z",
      organizer: udomsakUser.id,
    },
    {
      title: "Green Financing Roadshow — Banks & Funds",
      description: "Meetings with potential financiers: BBL, KBANK, SCB, ADB Green Fund. Present Project Lawi and financing requirement 2,450 MB.",
      type: "external",
      startAt: "2026-06-10T09:00:00Z",
      endAt: "2026-06-10T16:00:00Z",
      organizer: manaphatUser.id,
    },
  ];

  for (const m of meetings) {
    const meeting = await prisma.meeting.create({
      data: {
        orgId: org.id,
        title: m.title,
        description: m.description,
        meetingType: m.type,
        organizerUserId: m.organizer,
        relatedProjectId: (m as any).project || null,
        startAt: new Date(m.startAt),
        endAt: new Date(m.endAt),
        locationType: "hybrid",
        status: "scheduled",
      },
    });
    // Add all 4 team members as attendees
    await prisma.meetingAttendee.createMany({
      data: [
        { meetingId: meeting.id, userId: udomsakUser.id, attendeeRole: "organizer", responseStatus: "accepted" },
        { meetingId: meeting.id, userId: rathaUser.id, attendeeRole: "attendee", responseStatus: "accepted" },
        { meetingId: meeting.id, userId: suntadUser.id, attendeeRole: "attendee", responseStatus: "accepted" },
        { meetingId: meeting.id, userId: manaphatUser.id, attendeeRole: "attendee", responseStatus: "accepted" },
      ],
    });
  }
  console.log(`Meetings: ${meetings.length} created`);

  // ============================================================
  // 9. Documents — Investment Opportunity PDF as master doc
  // ============================================================
  const investmentDoc = await prisma.document.create({
    data: {
      orgId: org.id,
      ownerUserId: udomsakUser.id,
      title: "Project Lawi — Investment Opportunity (Rev 3) April 2026",
      documentType: "investment_memo",
      status: "approved",
      classification: "confidential",
      isControlled: true,
      departmentId: execDept.id,
      createdBy: udomsakUser.id,
      updatedBy: udomsakUser.id,
    },
  });
  const invVersion = await prisma.documentVersion.create({
    data: {
      documentId: investmentDoc.id,
      versionNo: 3,
      storageObjectKey: "documents/lawi/20260403_Investment_Opportunity_Rev3.pdf",
      fileName: "20260403_Investment_Opportunity_Rev3.pdf",
      mimeType: "application/pdf",
      fileSizeBytes: 1273441,
      checksum: "pending",
      uploadedBy: udomsakUser.id,
      versionStatus: "current",
      aiSummaryText:
        "Project Lawi is an integrated renewable energy platform with three business units: BU1 Renewable Energy (Biomass/WTE), BU2 Alternative Fuel (RDF), BU3 Advanced Material (Activated Carbon). Total project cost 4,900 MB with 50/50 equity/debt split. Expected PIRR 10.5-12.0%, EIRR 14.5-16.0%, Payback 7-10 years. Strategy: M&A for immediate cash flow (UPT acquisition) + greenfield development (WTE Nonthaburi, RDF plants, AC plants). Thai/Malaysian JV with 51/49 ownership.",
    },
  });
  await prisma.document.update({
    where: { id: investmentDoc.id },
    data: { currentVersionId: invVersion.id },
  });
  await prisma.documentTag.createMany({
    data: [
      { documentId: investmentDoc.id, tagName: "investment" },
      { documentId: investmentDoc.id, tagName: "confidential" },
      { documentId: investmentDoc.id, tagName: "master-deck" },
      { documentId: investmentDoc.id, tagName: "2026" },
    ],
  });

  // Additional docs
  const additionalDocs = [
    { title: "UPT Biomass — Technical Due Diligence Report", type: "dd_report", dept: bu1.id, classification: "confidential" },
    { title: "WTE Nonthaburi — EIA Application Draft", type: "regulatory", dept: bu1.id, classification: "internal" },
    { title: "RDF Surat Thani — GP4 Offtake Agreement Term Sheet", type: "contract", dept: bu2.id, classification: "confidential" },
    { title: "Activated Carbon Ayutthaya — Feasibility Study", type: "feasibility", dept: bu3.id, classification: "internal" },
    { title: "Lawi Energy Holding — Group Organization Chart", type: "corporate", dept: execDept.id, classification: "internal" },
    { title: "ESG Framework & KPI Scorecard v1", type: "policy", dept: execDept.id, classification: "internal" },
    { title: "Thai-Malaysian JV Shareholders Agreement Draft", type: "contract", dept: legalDept.id, classification: "restricted" },
  ];

  for (const d of additionalDocs) {
    const doc = await prisma.document.create({
      data: {
        orgId: org.id,
        ownerUserId: udomsakUser.id,
        title: d.title,
        documentType: d.type,
        status: "draft",
        classification: d.classification as any,
        isControlled: d.classification !== "internal",
        departmentId: d.dept,
        createdBy: udomsakUser.id,
        updatedBy: udomsakUser.id,
      },
    });
    const ver = await prisma.documentVersion.create({
      data: {
        documentId: doc.id,
        versionNo: 1,
        storageObjectKey: `documents/lawi/${doc.id}.pdf`,
        fileName: `${d.title}.pdf`,
        mimeType: "application/pdf",
        fileSizeBytes: 0,
        checksum: "pending",
        uploadedBy: udomsakUser.id,
        versionStatus: "current",
      },
    });
    await prisma.document.update({
      where: { id: doc.id },
      data: { currentVersionId: ver.id },
    });
  }
  console.log(`Documents: ${additionalDocs.length + 1} created`);

  // ============================================================
  // 10. Approval Requests — Real investment decisions
  // ============================================================
  const approvals = [
    {
      requestType: "investment_approval",
      sourceType: "project",
      sourceId: upt.id,
      requester: manaphatUser.id,
      status: "in_review",
    },
    {
      requestType: "investment_approval",
      sourceType: "project",
      sourceId: wteNon.id,
      requester: suntadUser.id,
      status: "submitted",
    },
    {
      requestType: "contract_approval",
      sourceType: "document",
      sourceId: investmentDoc.id,
      requester: udomsakUser.id,
      status: "approved",
    },
  ];

  for (const a of approvals) {
    const req = await prisma.approvalRequest.create({
      data: {
        orgId: org.id,
        requestType: a.requestType,
        sourceType: a.sourceType,
        sourceId: a.sourceId,
        requesterUserId: a.requester,
        currentStepNo: a.status === "approved" ? 2 : 1,
        status: a.status as any,
        submittedAt: new Date("2026-04-01"),
      },
    });
    // Step 1: Manager review
    await prisma.approvalStep.create({
      data: {
        approvalRequestId: req.id,
        stepNo: 1,
        approverType: "user",
        approverReferenceId: manaphatUser.id,
        decisionStatus: a.status === "submitted" ? "pending" : "approved",
        decidedAt: a.status === "submitted" ? null : new Date("2026-04-03"),
      },
    });
    // Step 2: Executive sign-off
    await prisma.approvalStep.create({
      data: {
        approvalRequestId: req.id,
        stepNo: 2,
        approverType: "executive",
        approverReferenceId: udomsakUser.id,
        decisionStatus: a.status === "approved" ? "approved" : "pending",
        decidedAt: a.status === "approved" ? new Date("2026-04-05") : null,
      },
    });
  }
  console.log(`Approval Requests: ${approvals.length} created`);

  // ============================================================
  // 11. Notifications — real pending items
  // ============================================================
  await prisma.notification.createMany({
    data: [
      {
        orgId: org.id,
        userId: udomsakUser.id,
        notificationType: "approval_pending",
        title: "UPT Acquisition — Investment Approval Pending",
        body: "Review and approve UPT Biomass Power Plant acquisition (800 MB)",
        deepLinkType: "approval_request",
        priority: "high",
        status: "unread",
      },
      {
        orgId: org.id,
        userId: udomsakUser.id,
        notificationType: "meeting_reminder",
        title: "Q2 Investment Committee — May 20, 2026",
        body: "Quarterly investment review meeting upcoming",
        deepLinkType: "meeting",
        priority: "normal",
        status: "unread",
      },
      {
        orgId: org.id,
        userId: manaphatUser.id,
        notificationType: "task_assigned",
        title: "UPT Financing — Debt Arrangement",
        body: "Arrange 400 MB debt financing for UPT acquisition",
        deepLinkType: "task",
        priority: "high",
        status: "unread",
      },
    ],
  });

  // ============================================================
  // DONE
  // ============================================================
  console.log("\n=== SEED COMPLETE ===");
  console.log("Login credentials:");
  console.log("  admin / 1234                        — System Admin (CEO role)");
  console.log("  udomsak@lawi.energy / 1234          — Dr. Udomsak Kaewsiri");
  console.log("  rathakrishnan@lawi.energy / 1234    — Rathakrishnan Arumugam");
  console.log("  suntad@lawi.energy / 1234           — Suntad Yingyong");
  console.log("  manaphat@lawi.energy / 1234         — Manaphat Asakit");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
