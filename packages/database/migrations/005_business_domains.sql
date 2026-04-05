-- ============================================================
-- Migration 005: Business Domains
-- Sales, Marketing, Procurement, Finance, HR, Legal/Compliance
-- ============================================================

-- ============================================================
-- Sales & Marketing
-- ============================================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    source_channel VARCHAR(50),
    company_name VARCHAR(255),
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    country VARCHAR(100),
    industry VARCHAR(100),
    lead_score INT,
    status VARCHAR(30) NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'qualified', 'nurturing', 'proposal_pending', 'won', 'lost', 'archived')),
    owner_user_id UUID REFERENCES users(id),
    assigned_to_user_id UUID REFERENCES users(id),
    ai_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_leads_status_owner ON leads(status, owner_user_id);

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50),
    country VARCHAR(100),
    industry VARCHAR(100),
    owner_user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    lead_id UUID REFERENCES leads(id),
    account_id UUID REFERENCES accounts(id),
    title VARCHAR(500) NOT NULL,
    stage VARCHAR(30) NOT NULL DEFAULT 'discovery'
        CHECK (stage IN ('discovery', 'qualification', 'proposal', 'negotiation', 'won', 'lost')),
    estimated_value_amount DECIMAL(15, 2),
    currency_code VARCHAR(3) DEFAULT 'THB',
    expected_close_date DATE,
    owner_user_id UUID NOT NULL REFERENCES users(id),
    probability_percent INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    opportunity_id UUID REFERENCES opportunities(id),
    lead_id UUID REFERENCES leads(id),
    proposal_no VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    version_no INT DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'under_review', 'approved', 'sent', 'accepted', 'rejected', 'superseded')),
    total_amount DECIMAL(15, 2),
    currency_code VARCHAR(3) DEFAULT 'THB',
    document_id UUID REFERENCES documents(id),
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(50),
    target_segment VARCHAR(255),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    owner_user_id UUID REFERENCES users(id),
    budget_amount DECIMAL(15, 2),
    currency_code VARCHAR(3) DEFAULT 'THB',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    content_type VARCHAR(50) NOT NULL,
    channel_name VARCHAR(100),
    title VARCHAR(500),
    body_text TEXT,
    publishing_status VARCHAR(20) DEFAULT 'draft'
        CHECK (publishing_status IN ('draft', 'pending_approval', 'approved', 'published', 'archived')),
    scheduled_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Procurement
-- ============================================================
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    vendor_name VARCHAR(255) NOT NULL,
    vendor_type VARCHAR(50),
    tax_id_encrypted TEXT,
    country VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    primary_contact_name VARCHAR(255),
    primary_contact_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE purchase_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    requester_user_id UUID NOT NULL REFERENCES users(id),
    department_id UUID REFERENCES departments(id),
    project_id UUID REFERENCES projects(id),
    title VARCHAR(500) NOT NULL,
    justification TEXT,
    need_by_date DATE,
    estimated_amount DECIMAL(15, 2),
    currency_code VARCHAR(3) DEFAULT 'THB',
    status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'converted_to_rfq', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE purchase_request_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_request_id UUID NOT NULL REFERENCES purchase_requests(id) ON DELETE CASCADE,
    item_description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_of_measure VARCHAR(50),
    estimated_unit_price DECIMAL(15, 2),
    line_total_estimate DECIMAL(15, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    purchase_request_id UUID REFERENCES purchase_requests(id),
    rfq_no VARCHAR(50) NOT NULL,
    issued_at TIMESTAMPTZ,
    due_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'closed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rfq_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    invited_at TIMESTAMPTZ,
    response_status VARCHAR(20) DEFAULT 'pending'
        CHECK (response_status IN ('pending', 'submitted', 'declined', 'no_response')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vendor_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    quote_no VARCHAR(50),
    total_amount DECIMAL(15, 2),
    currency_code VARCHAR(3) DEFAULT 'THB',
    lead_time_days INT,
    commercial_terms_jsonb JSONB,
    submitted_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'shortlisted', 'selected', 'rejected')),
    document_id UUID REFERENCES documents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    purchase_request_id UUID REFERENCES purchase_requests(id),
    vendor_quote_id UUID REFERENCES vendor_quotes(id),
    po_no VARCHAR(50) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'THB',
    status VARCHAR(30) DEFAULT 'draft'
        CHECK (status IN ('draft', 'pending_approval', 'approved', 'issued', 'partially_received', 'completed', 'cancelled')),
    issued_at TIMESTAMPTZ,
    approved_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Finance
-- ============================================================
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    vendor_id UUID REFERENCES vendors(id),
    purchase_order_id UUID REFERENCES purchase_orders(id),
    invoice_no VARCHAR(100) NOT NULL,
    invoice_date DATE,
    due_date DATE,
    amount_total DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'THB',
    extracted_status VARCHAR(20) DEFAULT 'pending'
        CHECK (extracted_status IN ('pending', 'extracted', 'failed')),
    match_status VARCHAR(20) DEFAULT 'unmatched'
        CHECK (match_status IN ('unmatched', 'matched', 'exception')),
    status VARCHAR(30) NOT NULL DEFAULT 'received'
        CHECK (status IN ('received', 'under_validation', 'matched', 'exception', 'approved', 'paid', 'cancelled')),
    document_id UUID REFERENCES documents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_due_status ON invoices(due_date, status);

CREATE TABLE expense_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    claimant_user_id UUID NOT NULL REFERENCES users(id),
    department_id UUID REFERENCES departments(id),
    claim_no VARCHAR(50) NOT NULL,
    claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_amount DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'THB',
    status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'paid')),
    policy_check_status VARCHAR(20) DEFAULT 'unchecked'
        CHECK (policy_check_status IN ('unchecked', 'passed', 'warning', 'failed')),
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE expense_claim_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_claim_id UUID NOT NULL REFERENCES expense_claims(id) ON DELETE CASCADE,
    expense_date DATE NOT NULL,
    category_code VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    amount DECIMAL(15, 2) NOT NULL,
    receipt_document_id UUID REFERENCES documents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('invoice', 'expense_claim', 'other')),
    source_id UUID NOT NULL,
    payee_type VARCHAR(30),
    payee_reference_id UUID,
    payment_amount DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'THB',
    due_date DATE,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (payment_status IN ('draft', 'pending_release_approval', 'approved_for_release', 'released', 'failed', 'cancelled')),
    release_approved_by UUID REFERENCES users(id),
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE budget_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    fiscal_year INT NOT NULL,
    department_id UUID REFERENCES departments(id),
    project_id UUID REFERENCES projects(id),
    budget_code VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    allocated_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    consumed_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    committed_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency_code VARCHAR(3) DEFAULT 'THB',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cashflow_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    snapshot_date DATE NOT NULL,
    opening_balance DECIMAL(15, 2),
    inflow_estimate DECIMAL(15, 2),
    outflow_estimate DECIMAL(15, 2),
    closing_estimate DECIMAL(15, 2),
    generated_by_ai BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- HR
-- ============================================================
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    position_applied VARCHAR(255),
    source_channel VARCHAR(100),
    current_stage VARCHAR(30) DEFAULT 'new'
        CHECK (current_stage IN ('new', 'screening', 'interview', 'offer', 'hired', 'rejected', 'withdrawn')),
    ai_fit_summary TEXT,
    document_id UUID REFERENCES documents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE onboarding_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    candidate_id UUID REFERENCES candidates(id),
    employee_profile_id UUID REFERENCES employee_profiles(id),
    start_date DATE NOT NULL,
    onboarding_status VARCHAR(30) DEFAULT 'pending'
        CHECK (onboarding_status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    owner_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE onboarding_checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onboarding_case_id UUID NOT NULL REFERENCES onboarding_cases(id) ON DELETE CASCADE,
    item_name VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
    due_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    employee_profile_id UUID NOT NULL REFERENCES employee_profiles(id),
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(4, 1) NOT NULL,
    reason_text TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'cancelled')),
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE training_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    employee_profile_id UUID NOT NULL REFERENCES employee_profiles(id),
    training_title VARCHAR(500) NOT NULL,
    assignment_type VARCHAR(50) DEFAULT 'mandatory',
    due_at TIMESTAMPTZ,
    completion_status VARCHAR(20) DEFAULT 'assigned'
        CHECK (completion_status IN ('assigned', 'in_progress', 'completed', 'overdue')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE policy_acknowledgements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    employee_profile_id UUID NOT NULL REFERENCES employee_profiles(id),
    policy_document_id UUID NOT NULL REFERENCES documents(id),
    acknowledged_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'overdue')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Legal & Compliance
-- ============================================================
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    counterparty_name VARCHAR(255) NOT NULL,
    contract_no VARCHAR(100),
    contract_type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    effective_date DATE,
    expiry_date DATE,
    renewal_notice_days INT,
    contract_status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (contract_status IN ('draft', 'under_review', 'active', 'expired', 'terminated', 'archived')),
    owner_user_id UUID REFERENCES users(id),
    document_id UUID REFERENCES documents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE contract_clause_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    clause_type VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    flag_text TEXT NOT NULL,
    ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    reviewed_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE compliance_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    alert_type VARCHAR(50) NOT NULL,
    source_type VARCHAR(50),
    source_id UUID,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'acknowledged', 'in_resolution', 'resolved', 'closed')),
    due_at TIMESTAMPTZ,
    owner_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    pack_name VARCHAR(255) NOT NULL,
    scope_description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'ready', 'released')),
    generated_at TIMESTAMPTZ,
    generated_by_user_id UUID REFERENCES users(id),
    storage_object_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apply updated_at triggers for all business domain tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON purchase_requests FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON rfqs FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vendor_quotes FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON expense_claims FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON payment_requests FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON budget_lines FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON onboarding_cases FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON training_assignments FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON compliance_alerts FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON audit_packs FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
