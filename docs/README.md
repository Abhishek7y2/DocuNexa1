# DocuNexa — Document Intelligence Platform Documentation

Welcome to the central documentation index for **DocuNexa (Document Intelligence Platform)**. This documentation system is authored to enterprise engineering, compliance, security, and architectural standards.

---

## 📑 Master Documentation Index

### 1. Core Enterprise Blueprints & Governance Compendium
* [Project Master Encyclopedia](PROJECT_EVERYTHING_EXPLAINED.md) — Comprehensive guide explaining every file, module, and engine in DocuNexa.
* [System Architecture](ARCHITECTURE.md) — Multi-tiered technical architecture, data pipelines, and compliance models.
* [Enterprise Design System](DESIGN.md) — Visual tokens, WCAG 2.1 AA palette, 46px compact metric strip, and layout rules.
* [Engineering Memory](MEMORY.md) — Institutional knowledge, Angular standalone conventions, SSR hydration, and budgets.
* [Project Graphify (Mermaid Diagrams)](PROJECT_GRAPHIFY.md) — 8 standard Mermaid lifecycle, routing, diffing, and SoD graphs.
* [Whole UI Screen Catalog](WHOLE_UI.md) — Comprehensive specifications and layout anatomy for all 14 screens.
* [BRD Gap Analysis](DOCUMENT_INTELLIGENCE_PLATFORM_BRD_ANALYSIS.md) — Audit against 11-page BRD v1.0 specifications.
* [Daily Work Report](TODAYS_WORK_REPORT.md) — Technical deliverable audit, bug fixes, and verification summary.
* [Executive Audit Report](DocNexaReport.md) — Stakeholder deliverable and enterprise verification report.

---

### 2. Executive & Requirements Baseline
* [01. Project Overview](01-project-overview.md) — Mission, problem statement, business value, and end-to-end lifecycle.
* [02. Product Overview](02-product-overview.md) — Target personas, document classes, and core feature suites.
* [03. Business Requirements (BRD Traceability)](03-business-requirements.md) — Formal BRD v1.0 mapping, SLA mandates, and commercial goals.
* [04. Functional Requirements (FR-001 - FR-023)](04-functional-requirements.md) — Exhaustive functional requirement specifications and implementation statuses.
* [05. Non-Functional Requirements](05-non-functional-requirements.md) — Performance SLAs, security standards, availability (99.9%), and compliance ceilings.

---

### 2. Architecture & System Engineering (`architecture/`)
* [System Architecture](architecture/system-architecture.md) — High-level enterprise topologies, microservices, and ingestion queues.
* [Application Architecture](architecture/application-architecture.md) — Monorepo design, state isolation, and component hierarchy.
* [Backend Architecture](architecture/backend-architecture.md) — Node.js service architecture, controllers, and domain services.
* [Frontend Architecture](architecture/frontend-architecture.md) — Angular standalone architecture, signals, and DocuNexa enterprise styling design tokens.
* [Mobile Architecture](architecture/mobile-architecture.md) — Native iOS Swift architectural blueprints, Combine/MVVM patterns.
* [Admin Architecture](architecture/admin-architecture.md) — Multi-tenant organization control, RBAC matrices, and policy management.
* [Database Architecture](architecture/database-architecture.md) — PostgreSQL relational schema, partitioning, and audit logging.
* [AI Architecture](architecture/ai-architecture.md) — Multi-stage OCR (PaddleOCR/LayoutLMv3), embeddings, and RAG pipelines.
* [Security Architecture](architecture/security-architecture.md) — Zero-trust access, envelope encryption, and Separation of Duties (SoD).
* [Deployment Architecture](architecture/deployment-architecture.md) — Docker containerization, Kubernetes orchestration, and cloud infrastructure.

---

### 3. Frontend Application System (`frontend/`)
* [Web Application Specification](frontend/web-application.md) — Angular single-page web portal specifications and view models.
* [Admin Application Specification](frontend/admin-application.md) — Governance portal, tenant management, and integration studio.
* [UI Architecture & Design Tokens](frontend/ui-architecture.md) — DocuNexa enterprise aesthetics, responsive breakpoints, and SCSS tokens.
* [Routing & Navigation](frontend/routing.md) — Route tables, auth guards, parameter resolvers, and SSR server routing.
* [Component Catalog](frontend/components.md) — Deep-dive into all 14 standalone screen components.
* [Frontend Services](frontend/services.md) — AuthService, DocumentService, UiState signals, and API gateways.
* [State Management](frontend/state-management.md) — Signal-driven reactive UI states and session persistence.
* [Forms & Enterprise Validations](frontend/forms-validation.md) — Centralized regex validators, arithmetic reconciliation, and error triggers.
* [Frontend Security](frontend/frontend-security.md) — CSP, XSS sanitization, PII masking, and JWT session handling.

---

### 4. Backend Engineering (`backend/`)
* [Backend Overview](backend/backend-overview.md) — Node.js runtime environment, Express/Fastify modular setup.
* [Modules](backend/modules.md) — Document, Ingestion, OCR, Verification, Approval, and Audit modules.
* [Controllers](backend/controllers.md) — RESTful request handlers, payload parsing, and response formatting.
* [Services](backend/services.md) — Core business logic, deterministic math calculation, and diff engines.
* [Middleware](backend/middleware.md) — Request validation, rate limiting, correlation IDs, and error wrapping.
* [Guards](backend/guards.md) — Token authentication guards and 6-role RBAC permission gates.
* [Authentication Service](backend/authentication.md) — OAuth2 / SAML SSO and Argon2 password hashing.
* [Authorization Service](backend/authorization.md) — Separation of Duties (SoD) enforcement and tenant data fencing.
* [Error Handling](backend/error-handling.md) — Standardized RFC-7807 problem details and exception handlers.
* [Logging System](backend/logging.md) — Structured Winston/Pino JSON logging with tamper-evident hashing.
* [Background Jobs](backend/background-jobs.md) — BullMQ Redis queues for asynchronous OCR and document conversions.
* [Integrations](backend/integrations.md) — ERP connectors (SAP, Oracle), webhook dispatchers, and S3/MinIO storage.

---

### 5. API Reference Catalog (`api/`)
* [API Catalog Index](api/README.md) — Master REST endpoint directory, versioning, and headers.
* [Authentication API](api/authentication-api.md) — `/api/v1/auth/*` endpoints.
* [User Management API](api/user-api.md) — `/api/v1/users/*` endpoints.
* [Document Repository API](api/document-api.md) — `/api/v1/documents/*` endpoints.
* [Upload & Ingestion API](api/upload-api.md) — `/api/v1/intake/*` endpoints.
* [Processing & OCR API](api/processing-api.md) — `/api/v1/processing/*` endpoints.
* [Review Queue API](api/review-api.md) — `/api/v1/review/*` endpoints.
* [QA & Grounded RAG API](api/qa-api.md) — `/api/v1/qa/*` endpoints.
* [Approval Workflow API](api/approval-api.md) — `/api/v1/approvals/*` endpoints.
* [Publication & Lock API](api/publication-api.md) — `/api/v1/publish/*` endpoints.
* [Version & Diff API](api/version-api.md) — `/api/v1/versions/*` endpoints.
* [Search & Semantic API](api/search-api.md) — `/api/v1/search/*` endpoints.
* [Admin & Tenant API](api/admin-api.md) — `/api/v1/admin/*` endpoints.
* [Notification API](api/notification-api.md) — `/api/v1/notifications/*` endpoints.
* [Integration & Webhook API](api/integration-api.md) — `/api/v1/integrations/*` endpoints.

---

### 6. Database & Persistence Layer (`database/`)
* [Database Overview](database/database-overview.md) — PostgreSQL 16 engine configuration, extensions (`uuid-ossp`, `pgcrypto`, `pgvector`).
* [Schema Definition](database/schema.md) — Complete DDL scripts, multi-tenant schemas, and constraints.
* [Tables Catalog](database/tables.md) — Detailed table dictionary: `tenants`, `users`, `documents`, `document_versions`, `extracted_fields`, `line_items`, `approvals`, `audit_logs`.
* [Relationships & ERD](database/relationships.md) — Entity-relationship diagrams and foreign key cascades.
* [Indexes & Performance](database/indexes.md) — B-Tree, GIN full-text indexes, and HNSW vector embedding indexes.
* [Database Migrations](database/migrations.md) — Liquibase/Knex migration files and versioning strategy.
* [Key Queries & Optimization](database/queries.md) — Optimized relational queries, aggregation views, and latency benchmarks.
* [Data Lifecycle Management](database/data-lifecycle.md) — Retention schedules, legal hold flags, and cryptographic purge mechanisms.

---

### 7. Mobile Application Architecture (`mobile/`)
* [iOS Overview](mobile/ios-overview.md) — Native Swift 6.0 iOS application specification.
* [Swift Architecture](mobile/swift-architecture.md) — Clean Architecture, MVVM + Coordinator pattern, Swift Concurrency (`async/await`).
* [Screens Catalog](mobile/screens.md) — Mobile dashboard, mobile scanner (VisionKit), review card swipe, and approvals.
* [Navigation](mobile/navigation.md) — UIKit / SwiftUI Coordinator navigation flows.
* [API Integration](mobile/api-integration.md) — URLSession networking layer, Combine publishers, and offline cache.
* [Mobile Authentication](mobile/authentication.md) — Biometric FaceID/TouchID and OAuth2 PKCE login.
* [Keychain Security](mobile/keychain-security.md) — Secure Enclave hardware token storage.
* [Offline & Networking](mobile/offline-and-networking.md) — Offline document capture, CoreData queue, and background upload sync.

---

### 8. Artificial Intelligence & Cognitive Engine (`ai/`)
* [AI Overview](ai/ai-overview.md) — Cognitive architecture, hybrid layout-aware transformers, and LLM orchestration.
* [AI Pipeline](ai/ai-pipeline.md) — Multi-stage document pipeline: Classification ➔ OCR ➔ Entity Extraction ➔ Math Check ➔ RAG.
* [OCR Processing](ai/ocr.md) — Dual-engine OCR (Tesseract / PaddleOCR / AWS Textract) with bounding box generation.
* [Document Classification](ai/classification.md) — Multi-modal document classifier (Supplier Contract, Purchase Invoice, Internal Policy).
* [Data Extraction](ai/extraction.md) — Key-value pair extraction with field-level confidence ratings.
* [Evidence Mapping](ai/evidence-mapping.md) — Page coordinates, bounding boxes, and citation anchoring.
* [AI Providers](ai/ai-providers.md) — Self-hosted open weights (LayoutLMv3, Mistral) vs Enterprise API fallback (Claude, GPT-4o).
* [AI Security](ai/ai-security.md) — Data isolation, prompt injection defense, and non-training data retention pledges.
* [AI Failure Handling](ai/ai-failure-handling.md) — Low confidence thresholds (<90%), OCR quarantine, and HITL escalation routes.

---

### 9. Workflows & Lifecycle (`workflows/`)
* [Document Lifecycle](workflows/document-lifecycle.md) — End-to-end lifecycle: Ingested ➔ In Review ➔ Pending Approval ➔ Published ➔ Archived.
* [Upload Workflow](workflows/upload-workflow.md) — Multi-file drag-drop, mime-type verification, and quarantine routing.
* [Processing Workflow](workflows/processing-workflow.md) — Preprocessing, binarization, OCR, and classification pipeline.
* [Review Workflow](workflows/review-workflow.md) — Human-in-the-loop split screen workbench and inline editing.
* [QA Workflow](workflows/qa-workflow.md) — Grounded conversational Q&A with citation verification.
* [Approval Workflow](workflows/approval-workflow.md) — Multi-tier sequential/parallel sign-offs with Separation of Duties.
* [Publication Workflow](workflows/publication-workflow.md) — Final record lockdown, immutable audit sealing, and ERP synchronization.
* [Version Comparison Workflow](workflows/version-comparison-workflow.md) — Automated clause diffing (Green added, Red deleted, Yellow modified).
* [Retention Workflow](workflows/retention-workflow.md) — Automated expiration timers and disposition scheduling.
* [Legal Hold Workflow](workflows/legal-hold-workflow.md) — Litigation holds, retention freeze, and compliance auditing.
* [Secure Purge Workflow](workflows/secure-purge-workflow.md) — Cryptographic erasure, zero-fill deletion, and destruction certificates.

---

### 10. Security, Compliance & Governance (`security/`)
* [Security Overview](security/security-overview.md) — Enterprise security posture, ISO 27001, SOC 2 Type II, and GDPR compliance.
* [Authentication Security](security/authentication-security.md) — MFA, enterprise SAML SSO, session timeouts, and brute force defenses.
* [Authorization Model](security/authorization-model.md) — Role-Based Access Control (RBAC) across 6 roles, tenant fencing, and SoD rules.
* [Data Security](security/data-security.md) — Encryption-at-rest (AES-256), encryption-in-transit (TLS 1.3), and envelope key management.
* [API Security](security/api-security.md) — Rate limiting, JWT validation, schema validation, and header security.
* [File Security](security/file-security.md) — ClamAV antivirus scanning, magic byte verification, and sandboxed processing.
* [AI Security](security/ai-security.md) — Data leakage prevention, no-training commitment, and guardrail enforcement.
* [Audit Logging](security/audit-logging.md) — Immutable append-only audit trail with cryptographic SHA-256 integrity checks.
* [Secrets Management](security/secrets-management.md) — HashiCorp Vault / AWS Secrets Manager integration.
* [Security Checklist](security/security-checklist.md) — OWASP Top 10 compliance checklist and verification report.

---

### 11. Testing & Quality Assurance (`testing/`)
* [Testing Strategy](testing/testing-strategy.md) — Testing pyramid, code coverage goals (>85%), and automated validation gates.
* [Unit Testing](testing/unit-testing.md) — Jest / Karma unit tests for validators, math engines, and components.
* [Integration Testing](testing/integration-testing.md) — API contract tests, database transactional tests, and workflow runs.
* [End-to-End Testing](testing/e2e-testing.md) — Playwright E2E test suites for login, review workbench, and approval journeys.
* [API Testing](testing/api-testing.md) — Postman / Newman test collections and automated regression runs.
* [Frontend Testing](testing/frontend-testing.md) — Angular component fixture testing and accessibility (WCAG 2.1 AA) checks.
* [Mobile Testing](testing/mobile-testing.md) — XCTest, XCUITest UI automation on iOS simulators and physical devices.
* [Security Testing](testing/security-testing.md) — SAST, DAST, dependency vulnerability scanning (Snyk, npm audit).
* [QA Checklist & UAT Scenarios](testing/qa-checklist.md) — Verification of UAT-01 through UAT-12 scenarios.

---

### 12. Deployment & Infrastructure (`deployment/`)
* [Local Development Guide](deployment/local-development.md) — Setting up Node, Angular, PostgreSQL, and local SSL.
* [Environment Setup](deployment/environment-setup.md) — Development, Staging, and Production environment definitions.
* [Environment Variables](deployment/environment-variables.md) — Exhaustive `.env.example` dictionary and secret parameters.
* [Docker Configuration](deployment/docker.md) — Dockerfile and Docker Compose specifications for multi-service stack.
* [Database Setup](deployment/database-setup.md) — PostgreSQL provisioning, extensions initialization, and seed data.
* [Backend Deployment](deployment/backend-deployment.md) — Node.js PM2 and Kubernetes deployment manifests.
* [Frontend Deployment](deployment/frontend-deployment.md) — Angular SSR and NGINX edge deployment architecture.
* [iOS Build & Deployment](deployment/ios-build-and-deployment.md) — Xcode Cloud, TestFlight, and App Store provisioning profiles.
* [Production Deployment](deployment/production-deployment.md) — Zero-downtime rolling deployments, blue-green deployment pipelines.
* [Troubleshooting Guide](deployment/troubleshooting.md) — Common error diagnostics, port conflicts, and database connection recovery.

---

### 13. Operations & Reliability (`operations/`)
* [Logging & Monitoring](operations/logging-and-monitoring.md) — Prometheus, Grafana, OpenTelemetry, and ELK stack integration.
* [Backup & Recovery](operations/backup-and-recovery.md) — Automated daily database snapshots, point-in-time recovery (PITR).
* [Incident Response](operations/incident-response.md) — Severity tiers (P1 to P4), escalation paths, and on-call runbooks.
* [Disaster Recovery](operations/disaster-recovery.md) — RTO (<1 hour) and RPO (<15 minutes) business continuity plan.
* [Performance & SLA](operations/performance.md) — Ingestion throughput (1.4 s/page), latency SLAs, and load test metrics.
* [System Maintenance](operations/maintenance.md) — Routine database vacuuming, index re-indexing, and key rotation.

---

### 14. Project Management & Delivery (`project-management/`)
* [Sprint History](project-management/sprint-history.md) — Development milestones from inception to current release.
* [Implementation Status](project-management/implementation-status.md) — Comprehensive requirement-by-requirement implementation matrix.
* [Feature Status](project-management/feature-status.md) — Screen inventory status and component completion metrics.
* [Requirement Traceability](project-management/requirement-traceability.md) — Traceability matrix linking BRD requirements to source files.
* [Known Issues](project-management/known-issues.md) — Current known defects, workarounds, and resolution targets.
* [Technical Debt](project-management/technical-debt.md) — Code refactoring priorities, test coverage improvements, and deprecations.
* [Future Roadmap](project-management/future-roadmap.md) — Target milestones for October 22, 2026 full backend integration and iOS release.

---

### 15. Team Review & Sign-Off (`review/`)
* [Team Review Guide](review/team-review-guide.md) — Stakeholder review checklist for Engineering, Product, and QA leads.
* [Architecture Review](review/architecture-review.md) — Architectural trade-off analysis, modularity, and scalability evaluation.
* [Code Review Guide](review/code-review-guide.md) — Coding conventions, TypeScript strictness, and style guide.
* [Security Review](review/security-review.md) — Threat modeling review, privacy audit, and compliance sign-off.
* [QA Review](review/qa-review.md) — Test verification sign-off and UAT pass rate analysis.
* [Production Readiness](review/production-readiness.md) — Go-live checklist, operational readiness review, and release criteria.
* [Review Checklist](review/review-checklist.md) — Executive sign-off table and stakeholder approvals.
