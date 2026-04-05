-- ============================================================
-- Migration 003: Documents, Workflows, Approvals
-- Virtual Office OS — Document management and approval engine
-- ============================================================

-- ============================================================
-- Documents
-- ============================================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    project_id UUID REFERENCES projects(id),
    department_id UUID REFERENCES departments(id),
    owner_user_id UUID NOT NULL REFERENCES users(id),
    document_type VARCHAR(50) NOT NULL DEFAULT 'general',
    title VARCHAR(500) NOT NULL,
    current_version_id UUID,
    status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'active', 'under_review', 'approved', 'superseded', 'archived')),
    classification VARCHAR(30) DEFAULT 'internal'
        CHECK (classification IN ('public', 'internal', 'confidential', 'restricted')),
    is_controlled BOOLEAN NOT NULL DEFAULT FALSE,
    archived_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_documents_org_status ON documents(org_id, status);
CREATE INDEX idx_documents_project ON documents(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX idx_documents_department ON documents(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX idx_documents_owner ON documents(owner_user_id);

CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_no INT NOT NULL,
    storage_object_key TEXT NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    file_size_bytes BIGINT,
    checksum VARCHAR(128),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version_status VARCHAR(20) DEFAULT 'current'
        CHECK (version_status IN ('current', 'superseded', 'archived')),
    ai_summary_text TEXT,
    UNIQUE(document_id, version_no)
);

-- Add FK from documents to document_versions (deferred for circular reference)
ALTER TABLE documents ADD CONSTRAINT fk_documents_current_version
    FOREIGN KEY (current_version_id) REFERENCES document_versions(id);

CREATE TABLE document_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE document_access_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    access_subject_type VARCHAR(30) NOT NULL
        CHECK (access_subject_type IN ('user', 'role', 'department', 'project', 'external_party')),
    access_subject_id UUID NOT NULL,
    access_level VARCHAR(20) NOT NULL DEFAULT 'view'
        CHECK (access_level IN ('view', 'edit', 'approve', 'export')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Workflow Engine
-- ============================================================
CREATE TABLE workflow_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    workflow_type VARCHAR(100) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    source_id UUID NOT NULL,
    current_state VARCHAR(100) NOT NULL DEFAULT 'initiated',
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'cancelled', 'failed', 'escalated')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    initiated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workflow_source ON workflow_instances(source_type, source_id);
CREATE INDEX idx_workflow_state ON workflow_instances(current_state, status);

CREATE TABLE workflow_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_instance_id UUID NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    from_state VARCHAR(100),
    to_state VARCHAR(100),
    actor_user_id UUID REFERENCES users(id),
    actor_type VARCHAR(20) DEFAULT 'human' CHECK (actor_type IN ('human', 'ai', 'system')),
    payload_jsonb JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE controlled_document_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id),
    workflow_instance_id UUID REFERENCES workflow_instances(id),
    effective_date DATE,
    expiry_date DATE,
    superseded_by_document_id UUID REFERENCES documents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Approval Engine
-- ============================================================
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    request_type VARCHAR(50) NOT NULL,
    workflow_instance_id UUID REFERENCES workflow_instances(id),
    source_type VARCHAR(50) NOT NULL,
    source_id UUID NOT NULL,
    requester_user_id UUID NOT NULL REFERENCES users(id),
    current_step_no INT DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'in_review', 'approved', 'rejected', 'returned', 'cancelled')),
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_approval_requests_status ON approval_requests(org_id, status);
CREATE INDEX idx_approval_requests_requester ON approval_requests(requester_user_id, status);

CREATE TABLE approval_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    approval_request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
    step_no INT NOT NULL,
    approver_type VARCHAR(30) NOT NULL
        CHECK (approver_type IN ('user', 'role', 'department_head', 'finance', 'executive')),
    approver_reference_id UUID,
    decision_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (decision_status IN ('pending', 'approved', 'rejected', 'returned', 'skipped', 'escalated')),
    due_at TIMESTAMPTZ,
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE approval_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    approval_step_id UUID NOT NULL REFERENCES approval_steps(id) ON DELETE CASCADE,
    decision_type VARCHAR(20) NOT NULL CHECK (decision_type IN ('approve', 'reject', 'return')),
    decided_by_user_id UUID NOT NULL REFERENCES users(id),
    decision_comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE approval_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    approval_request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
    author_user_id UUID NOT NULL REFERENCES users(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON workflow_instances FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON approval_requests FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
