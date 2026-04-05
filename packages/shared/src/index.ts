// ============================================================
// Virtual Office OS — Shared Types and Constants
// ============================================================

// ---------- Common Types ----------

export type UUID = string;

export interface BaseEntity {
  id: UUID;
  created_at: string;
  updated_at: string;
}

export interface OrgScopedEntity extends BaseEntity {
  org_id: UUID;
}

export interface SoftDeletable {
  is_deleted: boolean;
  deleted_at: string | null;
}

// ---------- Auth ----------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  mfa_required: boolean;
}

// ---------- User Types ----------

export type UserType = 'human' | 'external' | 'system';
export type UserStatus = 'invited' | 'active' | 'suspended' | 'deactivated';

export interface User extends OrgScopedEntity {
  email: string;
  user_type: UserType;
  status: UserStatus;
  display_name: string;
  mfa_enabled: boolean;
  roles: string[];
  permissions: string[];
}

// ---------- Task Types ----------

export type TaskStatus = 'draft' | 'open' | 'in_progress' | 'blocked' | 'review' | 'completed' | 'cancelled' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Task extends OrgScopedEntity {
  title: string;
  description: string | null;
  task_type: string;
  priority: Priority;
  status: TaskStatus;
  project_id: UUID | null;
  department_id: UUID | null;
  owner_user_id: UUID | null;
  assignee_user_id: UUID | null;
  due_at: string | null;
  completed_at: string | null;
  ai_generated: boolean;
  requires_review: boolean;
}

// ---------- Project Types ----------

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

export interface Project extends OrgScopedEntity {
  code: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  owner_user_id: UUID;
  start_date: string | null;
  end_date: string | null;
}

// ---------- Meeting Types ----------

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Meeting extends OrgScopedEntity {
  title: string;
  description: string | null;
  meeting_type: string;
  organizer_user_id: UUID;
  start_at: string;
  end_at: string;
  location_type: 'virtual' | 'physical' | 'hybrid';
  status: MeetingStatus;
}

// ---------- Document Types ----------

export type DocumentStatus = 'draft' | 'active' | 'under_review' | 'approved' | 'superseded' | 'archived';
export type Classification = 'public' | 'internal' | 'confidential' | 'restricted';

export interface Document extends OrgScopedEntity {
  title: string;
  document_type: string;
  status: DocumentStatus;
  classification: Classification;
  is_controlled: boolean;
  owner_user_id: UUID;
}

// ---------- Approval Types ----------

export type ApprovalStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'returned' | 'cancelled';

export interface ApprovalRequest extends OrgScopedEntity {
  request_type: string;
  source_type: string;
  source_id: UUID;
  requester_user_id: UUID;
  current_step_no: number;
  status: ApprovalStatus;
}

// ---------- Department Types ----------

export type DepartmentType =
  | 'executive' | 'sales' | 'marketing' | 'customer_service'
  | 'operations' | 'procurement' | 'accounting' | 'finance'
  | 'hr' | 'administration' | 'legal' | 'it' | 'data_bi'
  | 'rd' | 'international' | 'general';

// ---------- Role Types ----------

export type RoleType = 'human' | 'ai' | 'external' | 'admin' | 'system';

// ---------- API Response Types ----------

export interface ApiResponse<T> {
  data: T;
  meta?: {
    request_id: string;
    timestamp: string;
  };
}

export interface ApiListResponse<T> {
  data: T[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    has_next: boolean;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// ---------- Standard Permission Codes ----------

export const PERMISSIONS = {
  // Tasks
  TASK_VIEW_OWN: 'TASK_VIEW_OWN',
  TASK_VIEW_DEPT: 'TASK_VIEW_DEPT',
  TASK_VIEW_ALL: 'TASK_VIEW_ALL',
  TASK_CREATE: 'TASK_CREATE',
  TASK_EDIT_OWN: 'TASK_EDIT_OWN',
  TASK_ASSIGN: 'TASK_ASSIGN',

  // Documents
  DOC_VIEW_OWN: 'DOC_VIEW_OWN',
  DOC_VIEW_ALL: 'DOC_VIEW_ALL',
  DOC_UPLOAD: 'DOC_UPLOAD',
  DOC_APPROVE_CONTROLLED: 'DOC_APPROVE_CONTROLLED',

  // Approvals
  APPROVAL_CREATE: 'APPROVAL_CREATE',
  APPROVAL_APPROVE_STANDARD: 'APPROVAL_APPROVE_STANDARD',
  APPROVAL_APPROVE_FINANCIAL: 'APPROVAL_APPROVE_FINANCIAL',
  APPROVAL_APPROVE_EXECUTIVE: 'APPROVAL_APPROVE_EXECUTIVE',

  // Finance
  FIN_PAYMENT_APPROVE: 'FIN_PAYMENT_APPROVE',
  FIN_PAYMENT_RELEASE: 'FIN_PAYMENT_RELEASE',

  // AI
  AI_ASK: 'AI_ASK',
  AI_REVIEW: 'AI_REVIEW',

  // Admin
  SETTINGS_ORG: 'SETTINGS_ORG',
  AUDIT_VIEW: 'AUDIT_VIEW',
} as const;

// ---------- Human Role Codes ----------

export const ROLES = {
  H1_CEO: 'H1_CEO',
  H2_OPS_COMMERCIAL: 'H2_OPS_COMMERCIAL',
  H3_FIN_COMPLIANCE: 'H3_FIN_COMPLIANCE',
} as const;
