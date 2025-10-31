# 🔐 Test Accounts - Complete Reference

**Last Updated**: 2025-01-11
**Organization**: Default System Organization
**All Passwords**: `Test1234!`

---

## 📋 Quick Reference Table

| Role | Email | Password | Invitation Code | Dashboard URL |
|------|-------|----------|----------------|---------------|
| **System Admin** | `sysadmin@test.com` | `Test1234!` | `SYSADMIN-85KL9P-X` | `/dashboard` |
| **School Admin** | `admin@test.com` | `Test1234!` | `ADMIN-8B4AQH-T` | `/admin/dashboard` |
| **Department Head** | `depthead@test.com` | `Test1234!` | `DEPTHEAD-XRPTFM-A` | `/department/dashboard` |
| **Teacher** | `teacher@test.com` | `Test1234!` | `TEACHER-DC469Q-Z` | `/teacher/dashboard` |
| **Student** | `student@test.com` | `Test1234!` | `STUDENT-7YAZAL-9` | `/dashboard` |
| **Parent** | `parent@test.com` | `Test1234!` | `PARENT-BWCZT8-N` | `/parent/dashboard` |

---

## 🔑 Invitation Codes Summary

| Role | Code | Max Uses | Status |
|------|------|----------|--------|
| System Admin | `SYSADMIN-85KL9P-X` | 5 | ✅ Active |
| School Admin | `ADMIN-8B4AQH-T` | 10 | ✅ Active |
| Department Head | `DEPTHEAD-XRPTFM-A` | 5 | ✅ Active |
| Teacher | `TEACHER-DC469Q-Z` | 20 | ✅ Active |
| Student | `STUDENT-7YAZAL-9` | Unlimited | ✅ Active |
| Parent | `PARENT-BWCZT8-N` | 50 | ✅ Active |

---

## 👥 Account Details

### 1. System Administrator

```yaml
Email:     sysadmin@test.com
Password:  Test1234!
Role:      system_admin
Dashboard: /dashboard
Code:      SYSADMIN-85KL9P-X
```

**Permissions**:
- ✅ Platform-wide access
- ✅ Manage all organizations
- ✅ Create/manage invitation codes
- ✅ View all user data
- ✅ System configuration
- ✅ Access all dashboards

**Key Features**:
- System-level analytics
- Organization management
- User role management
- Platform settings
- Audit logs

---

### 2. School Administrator

```yaml
Email:     admin@test.com
Password:  Test1234!
Role:      school_admin
Dashboard: /admin/dashboard
Code:      ADMIN-8B4AQH-T
```

**Permissions**:
- ✅ Organization-wide access
- ✅ Manage school users
- ✅ Create/manage invitation codes
- ✅ Create classes and departments
- ✅ School-wide analytics
- ✅ Assign teachers to classes

**Key Features**:
- School analytics
- User management
- Department oversight
- Class creation
- Invitation code generation

---

### 3. Department Head

```yaml
Email:     depthead@test.com
Password:  Test1234!
Role:      department_head
Dashboard: /department/dashboard
Code:      DEPTHEAD-XRPTFM-A
```

**Permissions**:
- ✅ Department-level access
- ✅ View all department classes
- ✅ Monitor department students
- ✅ View teacher assignments (read-only)
- ✅ Generate department analytics
- ⚠️ Cannot edit teacher assignments
- ⚠️ Cannot manage other departments

**Key Features**:
- Department analytics (`/department/analytics`)
- Teacher overview (`/department/teachers`)
- Class monitoring (`/department/classes`)
- Student progress tracking (`/department/students`)
- Resource management (`/department/resources`)
- Report generation (`/department/reports`)
- Department settings (`/department/dashboard/settings`)

**Created Departments**:
1. ESOL Department (ID: 1) - Main department
2. General English Department
3. Exam Preparation Department

---

### 4. Teacher

```yaml
Email:     teacher@test.com
Password:  Test1234!
Role:      teacher
Dashboard: /teacher/dashboard
Code:      TEACHER-DC469Q-Z
```

**Permissions**:
- ✅ Class-level access
- ✅ Create/manage classes
- ✅ Create/manage assignments
- ✅ Track student progress
- ✅ Conduct diagnostic tests
- ✅ Provide feedback
- ✅ Generate student invitation codes

**Key Features**:
- Class management (`/teacher/classes`)
- Assignment creation (`/teacher/assignments`)
- Student progress tracking
- Diagnostic test administration
- Performance analytics
- Class roster management

---

### 5. Student

```yaml
Email:     student@test.com
Password:  Test1234!
Role:      student
Dashboard: /dashboard
Code:      STUDENT-7YAZAL-9
```

**Permissions**:
- ✅ Individual access (own data only)
- ✅ Access all learning modules
- ✅ Complete assignments
- ✅ Practice skills
- ✅ Track personal progress
- ✅ Use AI speaking coach
- ✅ Take diagnostic tests

**Key Features**:
- NZCEL Exam Prep (`/practice/nzcel`)
- General English Practice (`/practice/general`)
- AI Speaking Coach (`/speaking`)
- Conversation Practice (`/practice/nzcel/conversation`)
- Diagnostic Tests (`/diagnostic`)
- Progress Dashboard (`/dashboard`)
- Assignment Submission
- Personal Analytics

---

### 6. Parent

```yaml
Email:     parent@test.com
Password:  Test1234!
Role:      parent
Dashboard: /parent/dashboard
Code:      PARENT-BWCZT8-N
```

**Permissions**:
- ✅ Child-level access (linked students only)
- ✅ View child's progress
- ✅ View child's assignments
- ✅ Track learning analytics
- ⚠️ Requires admin to link to student account

**Key Features**:
- Child progress monitoring
- Assignment viewing
- Learning analytics
- Communication with teachers (future)

**Note**: Parent accounts need to be linked to student accounts by an administrator before they can view data.

---

## 🎯 Testing Workflow

### Quick Test Sequence

```bash
1. System Admin   → Create organizations, manage users
2. School Admin   → Create departments, classes, invite users
3. Department Head → Monitor department, review analytics
4. Teacher        → Create classes, assign work
5. Student        → Complete assignments, practice
6. Parent         → Monitor child progress
```

### Registration Flow

```mermaid
graph TD
    A[Open http://localhost:3000] --> B[Click 'Get Started Free']
    B --> C[Enter Invitation Code]
    C --> D[Complete Stack Auth Registration]
    D --> E[Email Verification if required]
    E --> F[Redirected to Dashboard]
    F --> G{Role-Based Dashboard}
    G -->|System Admin| H[/dashboard]
    G -->|School Admin| I[/admin/dashboard]
    G -->|Department Head| J[/department/dashboard]
    G -->|Teacher| K[/teacher/dashboard]
    G -->|Student| L[/dashboard]
    G -->|Parent| M[/parent/dashboard]
```

---

## 🔒 Security Notes

### Password Policy
- **Development**: All accounts use `Test1234!` for convenience
- **Production**: Must enforce strong password policies

### Access Control
- All accounts are organization-scoped (multi-tenant)
- Complete data isolation between organizations
- Role-based permission system (RBAC)
- Automatic organization filtering on all queries

### Session Management
- Stack Auth handles authentication
- Secure cookie-based sessions
- Automatic logout after inactivity (configurable)

---

## 📊 Feature Access Matrix

| Feature | System Admin | School Admin | Dept Head | Teacher | Student | Parent |
|---------|--------------|--------------|-----------|---------|---------|--------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Organizations | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Departments | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Department Analytics | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Classes | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Create Assignments | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Complete Assignments | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View Student Progress | ✅ | ✅ | ✅ | ✅ | Own | Child |
| AI Speaking Coach | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Practice Modules | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Diagnostic Tests | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Generate Invitation Codes | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🛠️ Troubleshooting

### Can't Log In
```bash
# Check user exists
npx tsx scripts/verify-department-head.ts

# Check invitation code
# Visit: http://localhost:3000/admin/invitations (as admin)
```

### Wrong Dashboard
```bash
# Verify role in database
# Check: users table → role column
# Expected: system_admin, school_admin, department_head, teacher, student, parent
```

### No Data Showing
```bash
# For new accounts, no data is expected
# Create test data:
npx tsx scripts/seed-classroom-data.ts
```

### Organization Error
```bash
# All users must belong to an organization
# Check: users table → organization_id column
# Should not be NULL
```

---

## 🔄 Reset & Regenerate

### Clear All Users
```bash
npx tsx scripts/cleanup-all-users.ts
```

### Regenerate Invitation Codes
```bash
# All roles
npx tsx scripts/init-invitation-codes.ts

# Department Head only
npx tsx scripts/init-department-head.ts
```

### Verify Setup
```bash
# Check all roles
npx tsx scripts/verify-department-head.ts
```

---

## 📚 Related Documentation

- **Detailed Registration Guide**: [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **Dashboard Testing**: [DASHBOARD_TESTING.md](./DASHBOARD_TESTING.md)
- **Department Head Setup**: [DEPARTMENT_HEAD_SETUP.md](./DEPARTMENT_HEAD_SETUP.md)
- **Quick Test Guide**: [QUICK_TEST_GUIDE.md](./QUICK_TEST_GUIDE.md)
- **Invitation Codes**: [docs/guides/INVITATION_CODES.md](../guides/INVITATION_CODES.md)
- **Executive Overview**: [docs/EXECUTIVE_OVERVIEW.md](../EXECUTIVE_OVERVIEW.md)

---

## 🎉 Quick Start Commands

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:3000

# Register first account (System Admin)
# Use code: SYSADMIN-85KL9P-X
# Email: sysadmin@test.com
# Password: Test1234!

# Then create other test accounts as needed
```

---

**Remember**: All test accounts share the same password (`Test1234!`) for development convenience. Change this in production!
