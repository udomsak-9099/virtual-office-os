-- ============================================================
-- Seed: Initial Permissions
-- Virtual Office OS — Base permission codes
-- ============================================================

-- Identity & Access
INSERT INTO permissions (code, module_name, action_name, scope_type, description) VALUES
('USER_VIEW_OWN', 'users', 'view', 'own', 'View own profile'),
('USER_VIEW_DEPT', 'users', 'view', 'department', 'View users in own department'),
('USER_VIEW_ALL', 'users', 'view', 'global', 'View all users in organization'),
('USER_CREATE', 'users', 'create', 'global', 'Create new users'),
('USER_EDIT_OWN', 'users', 'edit', 'own', 'Edit own profile'),
('USER_DEACTIVATE', 'users', 'deactivate', 'global', 'Deactivate users'),
('ROLE_VIEW', 'roles', 'view', 'global', 'View roles'),
('ROLE_MANAGE', 'roles', 'manage', 'global', 'Create/edit/delete roles'),
('PERMISSION_MANAGE', 'permissions', 'manage', 'global', 'Manage permission assignments'),

-- Tasks
('TASK_VIEW_OWN', 'tasks', 'view', 'own', 'View own tasks'),
('TASK_VIEW_DEPT', 'tasks', 'view', 'department', 'View department tasks'),
('TASK_VIEW_ALL', 'tasks', 'view', 'global', 'View all tasks'),
('TASK_CREATE', 'tasks', 'create', 'global', 'Create tasks'),
('TASK_EDIT_OWN', 'tasks', 'edit', 'own', 'Edit own tasks'),
('TASK_EDIT_DEPT', 'tasks', 'edit', 'department', 'Edit department tasks'),
('TASK_ASSIGN', 'tasks', 'assign', 'global', 'Assign tasks to others'),
('TASK_DELETE', 'tasks', 'delete', 'global', 'Delete tasks'),

-- Projects
('PROJECT_VIEW_OWN', 'projects', 'view', 'own', 'View own projects'),
('PROJECT_VIEW_ALL', 'projects', 'view', 'global', 'View all projects'),
('PROJECT_CREATE', 'projects', 'create', 'global', 'Create projects'),
('PROJECT_MANAGE', 'projects', 'manage', 'global', 'Manage project settings and members'),

-- Meetings
('MEETING_VIEW_OWN', 'meetings', 'view', 'own', 'View own meetings'),
('MEETING_VIEW_ALL', 'meetings', 'view', 'global', 'View all meetings'),
('MEETING_CREATE', 'meetings', 'create', 'global', 'Create meetings'),
('MEETING_AI_SUMMARY', 'meetings', 'ai_summary', 'global', 'Generate AI meeting summaries'),

-- Documents
('DOC_VIEW_OWN', 'documents', 'view', 'own', 'View own documents'),
('DOC_VIEW_DEPT', 'documents', 'view', 'department', 'View department documents'),
('DOC_VIEW_ALL', 'documents', 'view', 'global', 'View all documents'),
('DOC_UPLOAD', 'documents', 'upload', 'global', 'Upload documents'),
('DOC_EDIT_META', 'documents', 'edit_meta', 'global', 'Edit document metadata'),
('DOC_APPROVE_CONTROLLED', 'documents', 'approve', 'global', 'Approve controlled documents'),
('DOC_DELETE', 'documents', 'delete', 'global', 'Delete documents'),
('DOC_EXPORT', 'documents', 'export', 'global', 'Export documents'),

-- Approvals
('APPROVAL_CREATE', 'approvals', 'create', 'global', 'Create approval requests'),
('APPROVAL_VIEW_OWN', 'approvals', 'view', 'own', 'View own approval requests'),
('APPROVAL_VIEW_DEPT', 'approvals', 'view', 'department', 'View department approvals'),
('APPROVAL_VIEW_ALL', 'approvals', 'view', 'global', 'View all approvals'),
('APPROVAL_APPROVE_STANDARD', 'approvals', 'approve', 'standard', 'Approve standard requests'),
('APPROVAL_APPROVE_FINANCIAL', 'approvals', 'approve', 'financial', 'Approve financial requests'),
('APPROVAL_APPROVE_EXECUTIVE', 'approvals', 'approve', 'executive', 'Executive-level approval'),
('APPROVAL_OVERRIDE', 'approvals', 'override', 'global', 'Override approval workflow'),

-- Finance
('FIN_VIEW_SUMMARY', 'finance', 'view', 'summary', 'View financial summaries'),
('FIN_VIEW_DETAIL', 'finance', 'view', 'detail', 'View detailed financial records'),
('FIN_EXPENSE_CREATE', 'finance', 'create_expense', 'global', 'Create expense claims'),
('FIN_PAYMENT_APPROVE', 'finance', 'approve_payment', 'global', 'Approve payment requests'),
('FIN_PAYMENT_RELEASE', 'finance', 'release_payment', 'global', 'Release payments'),
('FIN_BUDGET_VIEW', 'finance', 'view_budget', 'global', 'View budget information'),
('FIN_EXPORT', 'finance', 'export', 'global', 'Export financial reports'),

-- HR
('HR_VIEW_DIRECTORY', 'hr', 'view_directory', 'global', 'View employee directory'),
('HR_VIEW_PROFILE', 'hr', 'view_profile', 'department', 'View employee profiles'),
('HR_VIEW_SENSITIVE', 'hr', 'view_sensitive', 'global', 'View sensitive HR data'),
('HR_MANAGE_ONBOARDING', 'hr', 'manage_onboarding', 'global', 'Manage onboarding cases'),
('HR_APPROVE_LEAVE', 'hr', 'approve_leave', 'global', 'Approve leave requests'),
('HR_EXPORT', 'hr', 'export', 'global', 'Export HR records'),

-- Legal
('LEGAL_VIEW_CONTRACTS', 'legal', 'view', 'global', 'View contracts'),
('LEGAL_APPROVE_CONTRACT', 'legal', 'approve', 'global', 'Approve contracts'),
('LEGAL_VIEW_COMPLIANCE', 'legal', 'view_compliance', 'global', 'View compliance alerts'),

-- Sales
('SALES_VIEW_LEADS', 'sales', 'view_leads', 'global', 'View sales leads'),
('SALES_MANAGE_LEADS', 'sales', 'manage_leads', 'global', 'Manage leads and opportunities'),
('SALES_CREATE_PROPOSAL', 'sales', 'create_proposal', 'global', 'Create proposals'),
('SALES_EXPORT', 'sales', 'export', 'global', 'Export sales data'),

-- Procurement
('PROC_VIEW', 'procurement', 'view', 'global', 'View procurement records'),
('PROC_CREATE_PR', 'procurement', 'create_pr', 'global', 'Create purchase requests'),
('PROC_MANAGE_RFQ', 'procurement', 'manage_rfq', 'global', 'Manage RFQs'),
('PROC_CREATE_PO', 'procurement', 'create_po', 'global', 'Create purchase orders'),

-- AI
('AI_ASK', 'ai', 'ask', 'global', 'Use AI assistant'),
('AI_REVIEW', 'ai', 'review', 'global', 'Review AI outputs'),
('AI_CONFIG', 'ai', 'config', 'global', 'Configure AI agents'),

-- Search
('SEARCH_GLOBAL', 'search', 'search', 'global', 'Use global search'),

-- Audit
('AUDIT_VIEW', 'audit', 'view', 'global', 'View audit logs'),
('AUDIT_EXPORT', 'audit', 'export', 'global', 'Export audit logs'),

-- Dashboard
('DASHBOARD_EXECUTIVE', 'dashboard', 'view_executive', 'global', 'View executive dashboard'),
('DASHBOARD_OPERATIONS', 'dashboard', 'view_operations', 'global', 'View operations dashboard'),
('DASHBOARD_FINANCE', 'dashboard', 'view_finance', 'global', 'View finance dashboard'),

-- Settings
('SETTINGS_ORG', 'settings', 'manage_org', 'global', 'Manage organization settings'),
('SETTINGS_WORKFLOW', 'settings', 'manage_workflow', 'global', 'Configure workflows'),
('SETTINGS_AI_AGENTS', 'settings', 'manage_ai_agents', 'global', 'Configure AI agents');
