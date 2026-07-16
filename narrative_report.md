# Internship Narrative Report: Software Engineering Practicum

* **Intern:** [Your Name]
* **Company:** PurpleBug Inc.
* **Location:** Unit 806, Antel 2000 Corporate Center, Valero St., Salcedo Village, Makati City, 1226, Philippines
* **Practicum Track:** Full-Stack Software Engineering / Web Development
* **Duration:** April 27, 2026 – July 24, 2026
* **Total Hours Rendered:** 480 Hours
* **System Worked On:** **BeeConnected** — Human Resource Information System (HRIS)

---

## 1.0 Overview of the Practicum Engagement

### 1.1 Company Background

**PurpleBug Inc.** is a technology-first, data-driven marketing technology company founded in 2011. Headquartered in Makati City, Philippines (Unit 806, Antel 2000 Corporate Center, Valero St., Salcedo Village), PurpleBug specializes in providing a combined solution of strategy and technology to help businesses integrate their sales, marketing, customer service, and IT operations. The company has extensive experience across industries such as IT, telecommunications, manufacturing, and hospitality.

Beyond its digital marketing and SEO services, PurpleBug operates as an enterprise software solutions provider, developing proprietary platforms including:

| Product | Description |
|:---|:---|
| **Smicos** | AI-powered chatbot platform |
| **DocuMeant** | Document management system |
| **Zagidee** | Project management tool |
| **OnTarget** | Sales performance tracking tool |
| **BeeConnected** | Human Resource Information System (HRIS) |

### 1.2 Nature of Assignments and Tasks Given

As a Software Engineering Intern, the primary assignment was to develop, enhance, and maintain core backend and frontend modules for the **BeeConnected** HRIS portal — an enterprise-grade employee management system built on **Laravel 12, Vue 3, Inertia.js, and Tailwind CSS 4**.

Key responsibilities spanned 13 major feature areas:

1. **Authentication & Security** — Login flow, password reset, Google Authenticator 2FA
2. **Employee Self-Service (My Info)** — Personal info, contact info, password management, 2FA setup, emergency contacts
3. **Emergency Contacts Module** — CRUD operations with Philippine phone format validation
4. **Time Clock / Time In & Out** — Webcam photo capture, private storage, real-time status
5. **Leave Management** — Leave request creation, approval workflows, half-day support, calendar integration
6. **Overtime Requests** — Employee submission, admin approval/decline flow
7. **Timesheets** — Timesheet creation, submission, admin review and approval
8. **Attendance Records** — Manual entry creation, admin editing, employee record views
9. **Payroll & Payslip Module** — Admin payroll dashboard, payslip generation, earnings/deductions, mark-paid, PDF download, CSV export, employee self-service view
10. **Single Sign-On (SSO) Integration** — OAuth2/OIDC-based SSO with BeeConnected identity provider, SSO app management, user access control, consent screen
11. **Hiring & Careers Module** — Job listings CRUD, public careers page, application tracking with resume viewer, status pipeline
12. **Employee Directory** — Company-wide searchable employee directory with role-based avatar icons
13. **Executive Dashboard & Controls** — Super admin dashboard, role management, system configuration, audit logs

### 1.3 Tech Stack

| Layer | Technology |
|:---|:---|
| Backend | Laravel 12, PHP 8.2+ |
| Frontend | Vue 3, Inertia.js |
| Styling | Tailwind CSS 4 |
| Build Tool | Vite 7 |
| Frontend Routing | Ziggy |
| Database | MySQL |
| Audit Logging | spatie/laravel-activitylog |
| 2FA / TOTP | spomky-labs/otphp |
| QR Rendering | qrcode.vue |
| Date Handling | dayjs, flatpickr |
| SSO / OAuth2 | Laravel Socialite (custom BeeConnected provider) |

### 1.4 Total Hours Rendered

**480 hours** of practicum work rendered from **April 27, 2026 to July 24, 2026** (13 weeks).

---

## 2.0 Presentation of Output

Over the 480-hour engagement, the following modules were developed, tested, and integrated into the BeeConnected HRIS platform. Each section below provides a detailed discussion of the feature, its technical architecture, and a representative screenshot.

---

### 2.1 Employee Dashboard & Time Clock Widget

**Description:** The main landing page for all authenticated users. Features a real-time server clock (synced to Philippine Standard Time, GMT+8), the Time at Work widget for one-click clock in/out, and a Team Calendar displaying approved leaves and company events.

**Key Features:**
- Real-time server time display with `setInterval` polling
- Status indicator badge (Timed In / Timed Out)
- Latest log entry display with type and timestamp
- Integrated Team Calendar with admin event management (create/update/delete via `CalendarEventController`)
- Developer Time Travel controls for local testing

**Technical Details:** Built with `Dashboard.vue`, `TimeAtWork` widget, and `DashboardCalendar` widget. The calendar fetches approved leave data from `CalendarController` and admin-managed events from `AdminCalendarEventController`. The Time Clock queries `/time-logs/latest` to determine clock state.

![Employee Dashboard and Time Clock Widget](C:/Users/abcde/.gemini/antigravity/brain/6922c820-7c0f-44ee-a919-c2c43d4d837f/dashboard_mockup_1784131390535.png)

---

### 2.2 Authentication & Google Authenticator 2FA

**Description:** A comprehensive security system implementing multi-layered authentication: custom login flow mapping `work_email` to the database `email` column, OTP-based and TOTP-based password reset flows, and a full Google Authenticator Two-Factor Authentication setup with QR code scanning.

**Key Features:**
- Custom login with `work_email` field mapping
- Password reset branching: TOTP verification (for 2FA users) or OTP verification (for non-2FA users)
- Google Authenticator TOTP setup wizard with QR code, backup secret key, and 6-digit verification
- `Require2FA` middleware blocking access until verification is complete
- Session-based `2fa_verified` flag for post-login enforcement
- 2FA enable/disable/regenerate from My Info settings

**Technical Details:** Uses `spomky-labs/otphp` for TOTP generation and `qrcode.vue` for QR rendering. The `TwoFactorCode` model stores the user's secret, algorithm, and digits configuration. Three middleware layers (`auth`, `beeconnected`, `require2fa`) protect all application routes.

![Google Authenticator 2FA Setup Screen](C:/Users/abcde/.gemini/antigravity/brain/6922c820-7c0f-44ee-a919-c2c43d4d837f/two_factor_mockup_1784131402706.png)

---

### 2.3 Single Sign-On (SSO) Integration & App Management

**Description:** A full OAuth2/OIDC-based Single Sign-On system that enables employees to authenticate via the BeeConnected identity provider. Includes an admin dashboard for managing SSO application registrations, toggling app status, and controlling per-user access grants.

**Key Features:**
- Custom Laravel Socialite provider (`BeeconnectedProvider.php`) with configurable endpoints and field mappings
- Redirect-based OAuth2 login flow with callback processing
- Automatic local user creation/update from BeeConnected profile attributes
- Per-user access control via `beeconnected_access_enabled` flag
- Optional SSO-only mode disabling local password login
- `EnsureBeeconnectedAccess` middleware for enforcement
- SSO Consent screen (`SsoConsent.vue`) for authorization requests
- Admin SSO App management page with card grid, search/filter, status toggle, and **User Access Manager** for granting/revoking per-user access
- Bulk user access update support

**Technical Details:** The SSO server controller handles authorization, approval, and denial flows. The `SsoApplicationController` manages app CRUD with status toggling and per-user access via pivot relationships. The `SsoCard`, `SSoSearchFilter`, and `SsoUserAccessManager` components provide the admin UI.

![SSO Applications Management Dashboard](C:/Users/abcde/.gemini/antigravity/brain/6922c820-7c0f-44ee-a919-c2c43d4d837f/sso_apps_mockup_1784131974746.png)

---

### 2.4 Webcam Capture & Secure Photo Verification

**Description:** Captures a live webcam photo of the employee during clock in/out to prevent buddy-punching and verify attendance identity.

**Key Features:**
- HTML5 MediaDevices API (`navigator.mediaDevices.getUserMedia`) for camera access
- Front-facing camera preference with 1280×720 resolution
- Live video preview with mirror effect
- Capture, retake, and submit workflow
- Graceful error handling for permission denied, camera not found, and camera-in-use scenarios
- Photo converted to JPEG Blob at 90% quality for bandwidth optimization

**Technical Details:** Implemented in `WebcamCapture.vue`. Photos are transmitted via multipart form data and stored at `storage/app/private/time-logs/` — a non-public path accessible only through authorized controller endpoints, ensuring data privacy compliance.

---

### 2.5 Admin Time Logs & Attendance Monitoring

**Description:** A comprehensive admin panel providing full visibility into employee attendance with audit-trail capabilities.

**Key Features:**
- Paginated time log table with employee name, type (Clock In/Out badges), timestamp, photo thumbnail, notes, and IP address
- Dynamic filtering by employee, clock type, and date range
- Full-text search by notes content
- Detail view with full-size photo, device information, and editing capabilities
- Manual time log entry creation for corrections
- CSV data export with active filter application
- Per-user attendance statistics
- Soft deletes for audit trail preservation

**Technical Details:** Powered by `Admin\TimeLogController.php` with Eloquent eager-loading for N+1 query prevention. The export route is intentionally declared before `/{id}` routes to prevent path collision.

![Admin Time Logs and Attendance Monitoring Panel](C:/Users/abcde/.gemini/antigravity/brain/6922c820-7c0f-44ee-a919-c2c43d4d837f/admin_timelogs_mockup_1784131427332.png)

---

### 2.6 Emergency Contacts Module

**Description:** Employee self-service and admin management of emergency contacts with Philippine-specific phone validation.

**Key Features:**
- Employee-facing CRUD for emergency contacts (name, relationship, mobile, home phone, work phone, address)
- Philippine mobile format validation (`09XX` / `639XX` patterns)
- Philippine landline format validation
- At-least-one-phone-number enforcement rule
- Reusable `Toast.vue` notification component for success/error feedback
- Admin view for managing emergency contacts across all employees
- Shared validation logic via `ValidatesPhilippinePhones` trait

**Technical Details:** Validation is centralized in `App\Http\Traits\ValidatesPhilippinePhones` and consumed by `StoreEmergencyContactRequest` and `UpdateEmergencyContactRequest` form request classes. The trait approach enables consistent validation across both employee and admin controllers.

![Emergency Contacts Management Dashboard](C:/Users/abcde/.gemini/antigravity/brain/6922c820-7c0f-44ee-a919-c2c43d4d837f/emergency_contacts_mockup_1784131413991.png)

---

### 2.7 Leave Management Module

**Description:** A complete leave request lifecycle system supporting employee submissions, admin approvals, and calendar visualization.

**Key Features:**
- Employee leave request creation with type selection, date range, and reason
- Half-day leave support (database-level)
- Leave history view with status badges (Pending, Approved, Declined)
- Employee self-cancellation of pending requests
- Admin/HR review dashboard with approve, decline, and delete actions
- Leave data integration into the Team Calendar widget (`LeaveCalendar.vue`)
- Calendar controller supplying approved leave and event data

**Technical Details:** Built with `LeaveRequestController` handling both employee and admin routes. The `LeaveRequest` model includes relationships to users. Approved leaves are displayed on the `DashboardCalendar` component via `CalendarController.php`.

![Leave and Overtime Management](C:/Users/abcde/.gemini/antigravity/brain/6922c820-7c0f-44ee-a919-c2c43d4d837f/leave_overtime_mockup_1784131996498.png)

---

### 2.8 Overtime Requests Module

**Description:** Enables employees to submit overtime work requests and provides admin/HR with approval workflow controls.

**Key Features:**
- Employee overtime request submission with date, hours, and reason
- Employee self-cancellation of pending overtime requests
- Admin/HR overtime management page with approve and decline actions
- Status tracking (Pending, Approved, Declined)

**Technical Details:** Implemented via `OvertimeRequestController` with separate employee and admin route groups. The sidebar navigation conditionally shows "Overtime Management" sub-item for admin users.

---

### 2.9 Timesheets & Attendance Module

**Description:** A dual module for employee timesheet logging and admin-level attendance record management.

**Key Features:**
- **Timesheets:** Employee timesheet creation and submission; admin review with approve/reject actions
- **Attendance:** Employee attendance view; admin manual entry creation, editing, deletion, and per-employee record views

**Technical Details:** `TimesheetController` and `AttendanceController` handle their respective CRUD operations. The Time sidebar menu conditionally renders admin sub-items (Timesheet Management, Attendance Records) or employee sub-items (My Timesheets, My Attendance) based on role.

---

### 2.10 Payroll & Payslip Module

**Description:** A comprehensive payroll management system with admin payslip generation, earnings/deductions breakdowns, payment tracking, and employee self-service views.

**Key Features:**
- **Admin Payroll Dashboard** (`Payroll.vue`): Employee payroll table showing name, salary, payment status, and pay/view actions
- **Admin Payslip Management** (`Payslip.vue`): Filterable payslip list (by status, period, department) with search and CSV export
- **Payslip Detail View** (`PayslipEmployee.vue`): Full earnings breakdown (Basic Salary, Overtime, Allowances) and deductions (SSS, PhilHealth, Pag-IBIG, Tax) with Net Pay calculation
- **Payslip Editor** (`PayslipModal.vue`): Modal form for creating/editing payslip records
- **Mark as Paid** functionality with status tracking
- **PDF Download** per payslip (`/{id}/pdf` endpoint)
- **CSV Export** with active filter preservation
- **Employee Self-Service View** (`PayslipEmployeeView.vue`): Employees can view their own payslip history and export their data
- Philippine Peso (₱) currency formatting with `Intl.NumberFormat`

**Technical Details:** `PayslipController` (20,600+ bytes) handles admin index, store, show, update, mark-paid, PDF generation, CSV export, and employee self-service views. `AdminPayrollController` provides the payroll overview dashboard. Components include `EmployeePayslipEarnings`, `EmployeePayslipDeductions`, `EmployeeNetPay`, `EmployeePaySlipDetails`, and `EmployeePayslipHistory`.

![Payslip Management Module](C:/Users/abcde/.gemini/antigravity/brain/6922c820-7c0f-44ee-a919-c2c43d4d837f/payslip_module_mockup_1784131966304.png)

---

### 2.11 Hiring & Careers Module

**Description:** A two-part recruitment system: an internal admin hiring management dashboard and a public-facing careers page for external applicants.

**Key Features:**
- **Admin Hiring Management** (`Hiring.vue`):
  - Job listing CRUD (create, edit, archive) with title, department, location, description, status
  - Stats cards: Total Listings, Open Positions, Total Applications
  - Search and status filtering
  - Link to applications review page
- **Hiring Applications** (`HiringApplications.vue`):
  - Application pipeline with 5 status stages: Pending → Reviewed → Interviewed By HR → Accepted / Rejected
  - Color-coded stat cards for each status with click-to-filter
  - Expandable row details (phone, portfolio URL, cover letter)
  - Inline resume viewer with PDF embed and DOCX download fallback
  - Status dropdown for quick status updates via PATCH requests
- **Public Careers Page** (`Careers/Index.vue` and `Careers/Show.vue`):
  - Guest-accessible (no authentication required)
  - "Join Our Team" hero section
  - Job listing cards with department, location, and posted date badges
  - Individual job detail page with application form
  - Rate-limited application submission (`throttle:5,1`)

**Technical Details:** `HiringController` handles listing CRUD and application management. `CareerController` provides the public-facing routes. The careers pages use a dedicated `GuestCareerLayout` for unauthenticated visitors.

![Hiring Management and Public Careers Page](C:/Users/abcde/.gemini/antigravity/brain/6922c820-7c0f-44ee-a919-c2c43d4d837f/hiring_careers_mockup_1784131986756.png)

---

### 2.12 Employee Directory

**Description:** A searchable, filterable company-wide employee directory with role-based visual indicators.

**Key Features:**
- Grid layout of employee profile cards showing name, job title, department, email, phone, and location
- Search by employee name with filter dropdowns for job title and location
- Role-based avatar styling (crown icon for super_admin, shield for admin, user circle for employee)
- Terminated employee visibility toggle (admin/super_admin only) with visual "Terminated" ribbon and reduced opacity
- Termination date display for terminated records

**Technical Details:** `DirectoryController` supplies filtered/paginated employee data. The `isPrivileged` prop controls admin-only features like the terminated employee toggle.

![Employee Directory and Executive Dashboard](C:/Users/abcde/.gemini/antigravity/brain/6922c820-7c0f-44ee-a919-c2c43d4d837f/directory_executive_mockup_1784132009150.png)

---

### 2.13 Executive Dashboard & Super Admin Controls

**Description:** A privileged dashboard and control center accessible only to super administrators, providing system-wide oversight and configuration.

**Key Features:**
- **Executive Dashboard**: Stats cards (Total Employees, Total Users, Pending Leaves, Pending Overtime), Time at Work widget, Team Calendar with management capabilities
- **Role Management** (`RoleManagement.vue`, 27,900 bytes): Assign manager roles, update user roles with comprehensive controls
- **System Configuration** (`SystemConfig.vue`): View and manage system-level settings
- **Audit Logs** (`AuditLogs.vue`): Review system activity logs powered by `spatie/laravel-activitylog`
- **SSO Applications**: Super admins see SSO management under Executive Controls

**Technical Details:** Protected by `role:super_admin` middleware via `EnsureRole` middleware. Controllers: `ExecutiveDashboardController`, `RoleManagementController`, `SystemConfigController`, `AuditLogController`.

---

### 2.14 Employee Management (Admin CRUD)

**Description:** Full employee lifecycle management for HR administrators.

**Key Features:**
- Employee listing and overview (`EmployeeDashboard.vue`, 16,000 bytes)
- Create employee form (`CreateEmployee.vue`, 40,800 bytes) with comprehensive field validation
- Edit employee form (`EditEmployee.vue`, 42,900 bytes) including 2FA and admin settings
- Employee termination action with confirmation
- Delete employee action
- Create Employee modal with confirmation step

**Technical Details:** `EmployeeManagementController` (17,800 bytes) handles the full CRUD lifecycle. The `CreateEmployeeModal` and `CreateEmployeeConfirmationModal` components provide a guided creation flow. `DeleteConfirmationModal` ensures safe deletion with user confirmation.

---

### 2.15 Application Layout & Navigation

**Description:** The global authenticated layout providing the sidebar navigation, header bar, search, and toast notification system.

**Key Features:**
- Collapsible sidebar with brand logo (BeeConnected branding linked to PurpleBug website)
- Module search functionality to quickly locate navigation items
- Role-based menu rendering (employee vs. admin vs. super_admin see different items)
- Nested sub-items with expand/collapse animation
- Auto-expand menu items based on current route
- Contextual header text describing the current module
- Global flash message toast notifications (`ToastContainer.vue`)
- User dropdown with Change Password shortcut
- Responsive layout with dynamic padding based on sidebar state

---

## 3.0 Synthesis of the Practicum Engagement

### 3.1 Learnings Gained

- **Full-Stack Integration:** Gained deep practical expertise building seamless single-page experiences with **Laravel 12, Inertia.js, and Vue 3**. Understood how Inertia bridges server-side routing with reactive frontend rendering without building a separate API layer.

- **Database Design & ORM Mastery:** Designed and implemented over 10 database migrations, mastered Eloquent relationships (hasMany, belongsTo, morphMany), query scopes, soft deletes, eager loading for N+1 prevention, and seeders for reproducible test environments.

- **Enterprise Security Architecture:** Implemented multi-layered security including TOTP-based 2FA, OAuth2/OIDC Single Sign-On, session management, CSRF protection, role-based access control (RBAC) with three distinct middleware layers (`auth`, `beeconnected`, `require2fa`), and private file storage for sensitive data.

- **API & Integration Design:** Built a custom Laravel Socialite provider for OAuth2 integration, implemented configurable field mappings via environment variables, and designed consent-based authorization flows.

- **UI/UX Engineering:** Developed 21+ reusable Vue components, mastered Tailwind CSS 4 utility patterns, implemented animated transitions, toast notification systems, modal workflows, and responsive layouts. Learned the "lift state up" pattern for parent-child component communication.

- **DevOps & Deployment Practices:** Gained experience with Vite build tooling, environment configuration management, database migration workflows, and comprehensive deployment checklists.

### 3.2 Realizations

- **Security is Non-Negotiable:** Implementing 2FA, SSO, webcam verification, and private file storage taught me that enterprise security is not optional — it protects both company integrity and employee identity. Every input must be validated, every route must be protected, and every file must be stored securely.

- **Code Organization Determines Maintainability:** The BeeConnected codebase demonstrated the importance of structured architecture — centralized route grouping by feature area, shared validation traits, reusable components, and comprehensive documentation. Well-organized code reduces onboarding time for future developers from days to hours.

- **Enterprise UX Deserves Modern Design:** Using Tailwind CSS 4 with premium design patterns (glassmorphism, micro-animations, responsive grids) proved that business software can and should feel as polished as consumer applications. Good UX directly improves employee productivity and adoption.

- **Documentation is a Deliverable:** Writing turnover documents, architecture guides, and deployment checklists was as important as writing code. Clean documentation ensures project continuity and reduces knowledge silos.

### 3.3 Conclusion

The 480-hour internship at PurpleBug Inc. was a transformative experience in enterprise software engineering. Working on the **BeeConnected** HRIS platform provided hands-on exposure to the full software development lifecycle — from database schema design and backend API development to frontend component architecture and deployment planning.

The successful implementation of 13+ major feature modules — spanning authentication, payroll, recruitment, SSO integration, and executive controls — validates my technical preparation and demonstrates my ability to contribute meaningfully to production-grade enterprise systems. This practicum has solidified my foundation for a professional career in software engineering.

---

## Appendices

> [!NOTE]
> The appendices below are placeholders. Attach the corresponding documents as needed.

### Appendix 1.0: Competency-Based CV
*(Attach your updated professional curriculum vitae emphasizing the skills, frameworks, and tools acquired during this practicum: Laravel 12, Vue 3, Inertia.js, Tailwind CSS 4, MySQL, OAuth2/SSO, TOTP 2FA, Vite, and enterprise HRIS development.)*

### Appendix 2.0: Endorsement Letter
*(Attach the official endorsement letter issued by your academic institution recommending you for the internship program at PurpleBug Inc.)*

### Appendix 3.0: Practicum Acceptance
*(Attach the signed acceptance letter or agreement from PurpleBug Inc. confirming your deployment as a Software Engineering Intern starting April 27, 2026.)*

### Appendix 4.0: Liability Waiver
*(Attach the waiver of liability signed by yourself, parents/guardians, and university officials prior to starting the practicum.)*

### Appendix 5.0: Training Plan
*(Attach the approved internship training plan outlining the specific focus areas, key competencies, and target outputs for your 480-hour practicum.)*

### Appendix 6.0: Daily Time Record (DTR)
*(Attach your timesheets or Daily Time Records detailing the 480 hours rendered, duly signed by your immediate industry supervisor at PurpleBug Inc.)*

### Appendix 7.0: Complete Journal
*Internship Period: April 27, 2026 – July 24, 2026*

| Week | Date Range | Brief Summary of Accomplished Tasks & Learnings |
|:---|:---|:---|
| **Week 1** | Apr 27 – May 01 | Onboarding and orientation. Local environment setup (PHP, MySQL, Composer, Node.js). Cloning the BeeConnected repository and running initial migrations. |
| **Week 2** | May 04 – May 08 | Studying the existing codebase architecture. Analyzing `routes/web.php`, middleware structure, and Inertia rendering flow. Building the custom login controller with `work_email` mapping. |
| **Week 3** | May 11 – May 15 | Researching TOTP algorithms and the `spomky-labs/otphp` library. Designing the `TwoFactorCode` model and migration. Beginning 2FA setup page development. |
| **Week 4** | May 18 – May 22 | Completing the 2FA Setup wizard: QR code generation with `qrcode.vue`, backup secret key display, 6-digit verification input. Implementing enable/disable/regenerate actions. |
| **Week 5** | May 25 – May 29 | Developing `Require2FA` middleware. Building password reset flow branching (TOTP vs OTP). Integrating 2FA enforcement into all authenticated route groups. |
| **Week 6** | Jun 01 – Jun 05 | Designing the Emergency Contacts database schema. Creating Eloquent model, migration, and form request validation classes. Building the `ValidatesPhilippinePhones` trait. |
| **Week 7** | Jun 08 – Jun 12 | Completing emergency contacts CRUD (employee and admin sides). Implementing `Toast.vue` notification component. Developing the admin emergency contacts management view. |
| **Week 8** | Jun 15 – Jun 19 | Designing the `time_logs` table schema. Building `TimeLogController` and `TimeLogRequest` validation. Implementing clock-in/out backend logic with server-set timestamps. |
| **Week 9** | Jun 22 – Jun 26 | Developing `WebcamCapture.vue` with HTML5 MediaDevices API. Building `TimeClockWidget.vue` and `TimeClockModal.vue`. Testing camera constraints across browsers. |
| **Week 10** | Jun 29 – Jul 03 | Integrating secure private storage for time log photos. Building admin time log management (list, detail, edit, delete, CSV export, statistics). Implementing leave management and overtime request modules. |
| **Week 11** | Jul 06 – Jul 10 | Developing the Payroll dashboard and Payslip module (admin CRUD, earnings/deductions, mark-paid, PDF export). Building SSO integration with custom Socialite provider and SSO app management. |
| **Week 12** | Jul 13 – Jul 17 | Implementing the Hiring module (job listings CRUD, applications pipeline, resume viewer) and public Careers page. Building the Employee Directory with role-based avatars. Developing the Executive Dashboard and controls. |
| **Week 13** | Jul 20 – Jul 24 | System integration testing and edge case resolution. Writing technical documentation (architecture reviews, deployment checklists, turnover notes). Final code review and internship handback. |
