# DocuNexa — Enterprise Document Intelligence Platform

[![Build Status](https://img.shields.io/badge/Build-Passing%20(0%20Errors)-emerald?style=for-the-badge&logo=angular)](https://angular.io)
[![Framework](https://img.shields.io/badge/Angular-18%2F19%20Standalone-crimson?style=for-the-badge&logo=angular)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5%20Strict-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Design System](https://img.shields.io/badge/Design%20System-DocuNexa%20Enterprise-indigo?style=for-the-badge)](docs/DESIGN.md)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-success?style=for-the-badge)](docs/DESIGN.md)
[![Security](https://img.shields.io/badge/Governance-Separation%20of%20Duties%20(SoD)-blueviolet?style=for-the-badge)](docs/ARCHITECTURE.md)
[![Audit](https://img.shields.io/badge/Integrity-SHA--256%20Cryptographic%20Seals-black?style=for-the-badge)](docs/ARCHITECTURE.md)

---

## 📌 Executive Summary

**DocuNexa** is an enterprise-grade, cognitive Document Intelligence and Workflow Automation Platform engineered for high-throughput, mission-critical legal, financial, and compliance operations. 

The platform transforms complex, unstructured documents (multi-party contracts, master services agreements, statement of work documents, vendor invoices, regulatory compliance filings) into structured, cryptographically auditable, and human-in-the-loop (HITL) verified enterprise data assets.

Built on **Angular (v18/v19 Standalone)** with reactive Angular Signals and modern SCSS architecture, DocuNexa adheres to strict Tier-1 Enterprise B2B SaaS standards: high-density data presentation, instant visual comprehension ("*Ek Nazar Mein Samajh*"), zero cognitive clutter, and robust compliance mechanisms.

---

## 🏛️ Comprehensive Screen Catalog (14 BRD Screens)

The platform provides complete implementations for all 14 screens specified in the enterprise Business Requirements Document (BRD v1.0). Every screen has been visually verified at `1600x1000` resolution:

| Code | Screen Name | Route | Status | Key Capabilities & Visual Verification | Evidence |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **SCR-01** | **Authentication & Enterprise SSO** | `/login`, `/verify-email` | ✅ **Production** | One-click Enterprise SAML / Okta SSO, 6-role quick switcher, password regex, auto-advancing 6-digit OTP MFA. | [`01_login.png`](screenshots/01_login.png) |
| **SCR-02** | **Executive Operations Dashboard** | `/dashboard` | ✅ **Production** | SLA Breach Alert Banner (`<4h`), 6 KPI telemetry cards, throughput charts, actionable priority queue. | [`03_dashboard.png`](screenshots/03_dashboard.png) |
| **SCR-03** | **Ingestion & Quarantine Studio** | `/intake` | ✅ **Production** | 50MB batch upload dropzone, dual-tab stream, Quarantined Exceptions Queue (<150 DPI) with Retry OCR. | [`06_intake.png`](screenshots/06_intake.png) |
| **SCR-04** | **Document Repository & Export** | `/documents` | ✅ **Production** | Multi-faceted filter bar, dense table, Scoped Data Export Studio (CSV/JSON/PDF) with PII & Financial Masking. | [`04_documents.png`](screenshots/04_documents.png) |
| **SCR-05** | **Document Detail & Audit Viewer** | `/documents/:id` | ✅ **Production** | Multi-page canvas preview, extraction metadata inspector, chronological audit trail timeline, Compare deep-link. | [`05_document_detail.png`](screenshots/05_document_detail.png) |
| **SCR-06** | **HITL Split-Screen Review Workbench**| `/review/:id` | ✅ **Production** | 50/50 split-screen, interactive canvas with glowing bounding boxes synced to field inputs, zoom/rotate controls. | [`08_review_workbench.png`](screenshots/08_review_workbench.png) |
| **SCR-07** | **Invoice Line-Item Math Engine** | `/review/:id` *(Tab 2)* | ✅ **Production** | Deterministic arithmetic validator ($\sum(\text{Qty} \times \text{Rate}) + \text{Tax} = \text{Total}$), discrepancy alerts, 1-click math reconcile. | [`08_review_workbench.png`](screenshots/08_review_workbench.png) |
| **SCR-08** | **Version Diff & Clause Studio** | `/compare`, `/compare/:id` | ✅ **Production** | Master-Detail 2-column layout, compact 46px KPI strip, 2-row non-colliding header, AI Fallback clause, redlines. | [`09_compare_studio.png`](screenshots/09_compare_studio.png) |
| **SCR-09** | **Approval Center with SoD** | `/approvals` | ✅ **Production** | 4-stage pipeline stepper, Separation of Duties (`🛡️ SoD Protected`) blocking self-approval, standardized rejection codes. | [`10_approvals.png`](screenshots/10_approvals.png) |
| **SCR-10** | **Reviewer Tasks & SLA Worklist** | `/tasks` | ✅ **Production** | Priority queue, countdown SLA badges (`<4h`, `Overdue`), status filters, batch assignment actions. | [`11_tasks.png`](screenshots/11_tasks.png) |
| **SCR-11** | **Semantic & Hybrid Search** | `/search` | ✅ **Production** | Natural language and keyword search, relevance match percentages, highlighted snippets, faceted filters. | [`12_search.png`](screenshots/12_search.png) |
| **SCR-12** | **Grounded AI Q&A Assistant** | `/qa` | ✅ **Production** | Grounded conversational assistant, strict AI-004 anti-hallucination guardrails, verifiable page-level citations. | [`13_qa.png`](screenshots/13_qa.png) |
| **SCR-13** | **Admin: Tenants & RBAC Matrix** | `/admin` *(Users)* | ✅ **Production** | Multi-tenant organization switcher, user directory, 6-role visual permission matrix (View, Review, Approve, Admin). | [`14_admin.png`](screenshots/14_admin.png) |
| **SCR-14** | **Admin: Governance & ERP Webhooks** | `/admin` *(Settings)* | ✅ **Production** | Data retention policy rules, Legal Hold freeze toggle, custom extraction schema builder, outbound ERP webhooks. | [`14_admin.png`](screenshots/14_admin.png) |

---

## ⚡ Flagship Innovations & Core Platform Engines

### 1. Version Compare Studio & Semantic Diff Engine (`SCR-08`)
- **Master-Detail Two-Column Grid**: 310px sticky clause navigator paired with a fluid, zero-overflow comparison stage (`overflow-x: hidden`).
- **Two-Row Non-Colliding Stage Header**: Separates clause identity (Row 1) from navigation steppers and review action buttons (Row 2), guaranteeing zero element overlap across any display resolution or zoom factor.
- **Compact 46px Metric Strip**: Consolidates 4 comparative metrics into a streamlined horizontal bar, keeping the primary document comparison stages visible above the fold.
- **Executive Shift Summary Card**: Side-by-side comparative shift breakdown (`Baseline ➔ Delta ➔ Amendment`) with dual paragraph citations (`v1.0 Page 2, Para 4` ➔ `v2.0 Page 2, Para 3`).
- **AI Plain-English Impact & Counsel Advice**: Translates dense legal boilerplate into actionable business risks and specific attorney recommendations.
- **AI Recommended Counter-Proposal (Fallback Clause)**: Enterprise compromise clause with a 1-click clipboard copy feature (`navigator.clipboard.writeText`).
- **Synchronized Redline Panes**: Side-by-side split view and unified manuscript view with dedicated 32px monospace line numbers.
- **Statutory Reading Aid Disclaimer**: Prominent legal warning coupled with verifiable SHA-256 cryptographic hashes ensuring tamper-evident review states.

### 2. HITL Review Workbench & Coordinate Projection Matrix (`SCR-06`)
- **50/50 Synchronized Canvas & Form**: Original document rendering on the left and structured extraction forms on the right.
- **Interactive SVG Bounding Box Projection**: Extracted fields map to coordinates $[x, y, w, h]$. Focusing an input field immediately illuminates the corresponding bounding box on the canvas with an active glowing halo and scrolls it into view.
- **Viewport Manipulation**: Smooth zooming (75% to 150%), page navigation, and 90° canvas rotation without raster distortion.

### 3. Deterministic Invoice Arithmetic Engine (`SCR-07`)
- **Zero-Tolerance Math Validator**: Reconciles line-item totals client-side:
  $$\sum_{i=1}^{n} (\text{Quantity}_i \times \text{Unit Rate}_i) + \text{Tax (18\%)} = \text{Calculated Total}$$
- **Discrepancy Warning & Auto-Reconcile**: Activates an amber alert banner if calculated sums differ from OCR grand totals by $> ₹0.01$, with an instant "Apply Calculated Math" override button.

### 4. Enterprise Separation of Duties (SoD) & Approvals (`SCR-09`)
- **Self-Approval Prevention**: Enforces compliance policy blocking users from approving documents they uploaded (`🛡️ SoD Protected`).
- **Standardized Rejection Taxonomy**: Requires explicit reason codes (`ERR-MATH-01`, `ERR-CONTRACT-02`, `ERR-EXPIRED-PO`, `ERR-TAX-04`) and mandatory justification logs.

---

## 📚 Central Documentation Suite (`docs/`)

All exhaustive project documentation, architecture specifications, design systems, and compliance reports are organized within the [`docs/`](docs/) directory:

| Document File | Category | Description |
| :--- | :---: | :--- |
| **[`docs/PROJECT_EVERYTHING_EXPLAINED.md`](docs/PROJECT_EVERYTHING_EXPLAINED.md)** | **Master Guide** | Definitive encyclopedia explaining every file, directory, module, and engine in DocuNexa. |
| **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)** | **Architecture** | End-to-end multi-tiered platform architecture, component topology, diff engines, and data flow. |
| **[`docs/DESIGN.md`](docs/DESIGN.md)** | **Design System** | Enterprise visual guidelines, WCAG contrast palette, typography scale, and layout standards. |
| **[`docs/MEMORY.md`](docs/MEMORY.md)** | **Engineering Memory** | Key decisions, Angular standalone conventions, Signals reactivity, style budgets, and SSR gotchas. |
| **[`docs/PROJECT_GRAPHIFY.md`](docs/PROJECT_GRAPHIFY.md)** | **Visual Blueprints** | 8 standard Mermaid graphs (lifecycles, SPA routing, Compare Studio flows, and SoD logic). |
| **[`docs/WHOLE_UI.md`](docs/WHOLE_UI.md)** | **Screen Catalog** | Exhaustive master catalog covering all 14 screens, layout anatomy, and interaction states. |
| **[`docs/DOCUMENT_INTELLIGENCE_PLATFORM_BRD_ANALYSIS.md`](docs/DOCUMENT_INTELLIGENCE_PLATFORM_BRD_ANALYSIS.md)** | **BRD Traceability** | Complete gap audit against the 11-page BRD v1.0 enterprise requirements specification. |
| **[`docs/TODAYS_WORK_REPORT.md`](docs/TODAYS_WORK_REPORT.md)** | **Engineering Audit** | Daily technical audit detailing deliverables, bug fixes, layout refactors, and build logs. |
| **[`docs/DocNexaReport.md`](docs/DocNexaReport.md)** | **Executive Audit** | High-level stakeholder verification deliverable and visual evidence report. |
| **[`docs/01-project-overview.md`](docs/01-project-overview.md)** | **Requirements** | Project vision, problem statements, business justification, and target KPIs. |
| **[`docs/02-product-overview.md`](docs/02-product-overview.md)** | **Requirements** | Target enterprise personas, document classes, and core functional modules. |
| **[`docs/03-business-requirements.md`](docs/03-business-requirements.md)** | **Requirements** | BRD business requirements mapping, SLA expectations, and compliance ceilings. |
| **[`docs/04-functional-requirements.md`](docs/04-functional-requirements.md)** | **Requirements** | Detailed specifications for FR-001 through FR-023 functional requirements. |
| **[`docs/05-non-functional-requirements.md`](docs/05-non-functional-requirements.md)** | **Requirements** | Security, 99.9% availability, latency thresholds, and scalability standards. |
| **[`docs/architecture/`](docs/architecture/)** | **System Architecture** | Deep-dive specs: System, App, Backend, Frontend, Mobile, Database, AI, Security, Deployment. |
| **[`docs/frontend/`](docs/frontend/)** | **Frontend Engineering** | Web application specs, routing tables, component catalogs, state management, and validations. |

---

## 📂 Repository File Tree

```
document_intelligence_platform-main/
├── README.md                           # [THIS FILE] Master enterprise project overview
├── .gitignore                          # Git exclusion rules
├── docs/                               # 📁 Central documentation folder for all MD files
│   ├── README.md                       # Documentation index
│   ├── PROJECT_EVERYTHING_EXPLAINED.md  # Master codebase encyclopedia
│   ├── ARCHITECTURE.md                 # Multi-tiered architecture blueprint
│   ├── DESIGN.md                       # Enterprise visual design system
│   ├── MEMORY.md                       # Engineering conventions & lessons learned
│   ├── PROJECT_GRAPHIFY.md             # 8 Mermaid architecture & process graphs
│   ├── WHOLE_UI.md                     # Master catalog of all 14 screens
│   ├── DOCUMENT_INTELLIGENCE_PLATFORM_BRD_ANALYSIS.md # BRD audit
│   ├── TODAYS_WORK_REPORT.md           # Engineering work report
│   ├── DocNexaReport.md                # Executive stakeholder report
│   ├── 01-project-overview.md ... 05-non-functional-requirements.md
│   ├── architecture/                   # 10 Detailed system architecture specs
│   └── frontend/                       # 9 Frontend technical specifications
├── screenshots/                        # 📸 High-resolution (1600x1000) verification PNGs
│   ├── 01_login.png ... 14_admin.png
├── DocNexaReport/                      # Stakeholder delivery bundle
└── document_intelligence_platform-main/
    └── document-intelligence-ui/      # 💻 Angular 18/19 Standalone Web Application
        ├── angular.json                # Workspace build targets & style budgets
        ├── package.json                # NPM dependencies & build scripts
        ├── take-screenshots.mjs        # Automated headless Chrome capture script
        ├── tsconfig.json               # TypeScript compiler options
        └── src/
            ├── main.ts                 # Client application bootstrap
            ├── server.ts               # Node SSR Express server
            ├── styles.scss             # Global design tokens & utility styles
            └── app/
                ├── app.config.ts       # Application providers & routing
                ├── app.routes.ts       # Typed SPA route definitions
                ├── app.component.ts    # Main shell layout component
                ├── core/               # Singleton services, guards, and models
                ├── shared/             # UI primitives, headers, sidebars, and pipes
                └── features/           # All 14 screen components & feature modules
```

---

## 🚀 Quickstart & Developer Guide

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **NPM**: `v10.x` or higher
- **Google Chrome**: Installed at standard path for automated screenshot testing

### 2. Local Development Setup
```bash
# Clone the repository
git clone https://github.com/Abhishek7y2/DocuNexa1.git

# Navigate to the Angular web UI directory
cd "document_intelligence_platform-main/document_intelligence_platform-main/document-intelligence-ui"

# Install dependencies
npm install

# Start the Vite development server
npm start
# -> Access the platform at http://localhost:4200
```

### 3. Production Build & Static Prerendering Verification
```bash
# Execute production build (verifies AOT compilation, style budgets & SSR)
npm run build
# Output: 0 Errors, 0 Warnings, 27 static routes prerendered
```

### 4. Automated Headless Visual Verification
```bash
# Run headless Chrome Puppeteer capture script
node take-screenshots.mjs
# -> Automatically captures and verifies all 14 screens at 1600x1000 resolution in screenshots/
```

---

## 🔒 Enterprise Security & Governance

1. **Role-Based Access Control (RBAC)**: 6 pre-configured enterprise roles (`Super Admin`, `Compliance Officer`, `Finance Approver`, `Legal Reviewer`, `Intake Operator`, `Auditor`).
2. **Separation of Duties (SoD)**: Deterministic policy enforcement preventing self-approval of documents and financial statements.
3. **Cryptographic Integrity**: SHA-256 tamper-proof hash generation embedded on every comparison and audit report.
4. **Data Sanitization & Redaction**: Scoped export studio with toggles for PII and confidential financial rate masking.
5. **AI Safety & Groundedness**: Strict AI-004 guardrails requiring verifiable source citations and preventing out-of-context hallucinations.

---

## 📄 License & Attribution

Copyright © 2026 **DocuNexa Inc.** All rights reserved.  
Proprietary enterprise document intelligence and automation software.
