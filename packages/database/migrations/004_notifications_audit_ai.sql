-- ============================================================
-- Migration 004: Notifications, Audit, AI
-- Virtual Office OS — Platform observability and AI layer
-- ============================================================

-- ============================================================
-- Notifications
-- ============================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    user_id UUID NOT NULL REFERENCES users(id),
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    body TEXT,
    deep_link_type VARCHAR(50),
    deep_link_id UUID,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_status ON notifications(user_id, status, created_at DESC);

CREATE TABLE notification_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    channel_type VARCHAR(20) NOT NULL CHECK (channel_type IN ('in_app', 'email', 'push')),
    delivery_status VARCHAR(20) DEFAULT 'pending'
        CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')),
    attempted_at TIMESTAMPTZ,
    provider_message_id VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Activity Events (user-facing feed)
-- ============================================================
CREATE TABLE activity_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    actor_user_id UUID REFERENCES users(id),
    actor_type VARCHAR(20) DEFAULT 'human' CHECK (actor_type IN ('human', 'ai', 'system')),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    summary_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_entity ON activity_events(entity_type, entity_id);
CREATE INDEX idx_activity_org_created ON activity_events(org_id, created_at DESC);

-- ============================================================
-- Audit Logs (immutable/append-only for compliance)
-- ============================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    actor_user_id UUID REFERENCES users(id),
    actor_type VARCHAR(20) DEFAULT 'human' CHECK (actor_type IN ('human', 'ai', 'system')),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    before_jsonb JSONB,
    after_jsonb JSONB,
    metadata_jsonb JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_occurred ON audit_logs(occurred_at);

-- ============================================================
-- AI Layer
-- ============================================================
CREATE TABLE prompt_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id),
    template_code VARCHAR(100) NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    template_body TEXT NOT NULL,
    version_no INT NOT NULL DEFAULT 1,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    requester_user_id UUID REFERENCES users(id),
    requester_type VARCHAR(20) DEFAULT 'human' CHECK (requester_type IN ('human', 'system', 'workflow')),
    ai_task_type VARCHAR(50) NOT NULL,
    source_type VARCHAR(50),
    source_id UUID,
    model_name VARCHAR(100),
    request_status VARCHAR(20) NOT NULL DEFAULT 'queued'
        CHECK (request_status IN ('queued', 'processing', 'completed', 'failed', 'review_required')),
    token_input_count INT,
    token_output_count INT,
    cost_estimate DECIMAL(10, 4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_ai_requests_status ON ai_requests(ai_task_type, request_status);
CREATE INDEX idx_ai_requests_source ON ai_requests(source_type, source_id);

CREATE TABLE ai_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ai_request_id UUID NOT NULL REFERENCES ai_requests(id) ON DELETE CASCADE,
    output_type VARCHAR(30) NOT NULL
        CHECK (output_type IN ('summary', 'draft', 'extraction', 'recommendation', 'classification', 'comparison')),
    output_text TEXT,
    output_jsonb JSONB,
    confidence_score DECIMAL(3, 2),
    requires_human_review BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by_user_id UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ai_output_id UUID NOT NULL REFERENCES ai_outputs(id) ON DELETE CASCADE,
    reviewer_user_id UUID NOT NULL REFERENCES users(id),
    review_action VARCHAR(30) NOT NULL
        CHECK (review_action IN ('approve', 'reject', 'regenerate', 'edit_and_approve')),
    review_comment TEXT,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE retrieval_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ai_request_id UUID NOT NULL REFERENCES ai_requests(id) ON DELETE CASCADE,
    source_entity_type VARCHAR(50) NOT NULL,
    source_entity_id UUID NOT NULL,
    source_version_id UUID,
    relevance_score DECIMAL(3, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE embeddings_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_entity_type VARCHAR(50) NOT NULL,
    source_entity_id UUID NOT NULL,
    source_version_hash VARCHAR(128),
    embedding_model VARCHAR(100),
    vector_status VARCHAR(20) DEFAULT 'pending'
        CHECK (vector_status IN ('pending', 'indexed', 'failed', 'stale')),
    indexed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Dashboard & Reporting
-- ============================================================
CREATE TABLE dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    role_id UUID REFERENCES roles(id),
    user_id UUID REFERENCES users(id),
    widget_code VARCHAR(100) NOT NULL,
    widget_config_jsonb JSONB DEFAULT '{}',
    sort_order INT DEFAULT 0,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE scheduled_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    report_code VARCHAR(100) NOT NULL,
    report_name VARCHAR(255) NOT NULL,
    schedule_cron VARCHAR(100),
    recipient_scope_type VARCHAR(30),
    recipient_scope_id UUID,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'inactive')),
    last_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE report_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheduled_report_id UUID NOT NULL REFERENCES scheduled_reports(id) ON DELETE CASCADE,
    run_status VARCHAR(20) DEFAULT 'pending'
        CHECK (run_status IN ('pending', 'running', 'completed', 'failed')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    output_storage_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON prompt_templates FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON dashboard_widgets FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON scheduled_reports FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
