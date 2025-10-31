# Department Head Setup - Quick Reference

## ✅ Setup Complete!

Department Head role environment has been successfully configured in the database.

---

## 🎫 Invitation Code

```
DEPTHEAD-XRPTFM-A
```

**Usage Limit:** 5 registrations
**Expiration:** Never
**Currently Used:** 0 times

---

## 📝 Registration Steps

### Option 1: Register New Department Head Account

1. **Open Registration Page**
   ```
   http://localhost:3000
   ```

2. **Click "Get Started Free" or "Sign Up"**

3. **Enter Invitation Code**
   ```
   DEPTHEAD-XRPTFM-A
   ```

4. **Complete Registration Form**
   - **Email:** `depthead@test.com` (or your preferred email)
   - **Password:** `Test1234!`
   - **Full Name:** Your choice

5. **Verify Account**
   - Check your email for verification link (if required by Stack Auth)
   - Complete email verification

6. **Access Department Dashboard**
   ```
   http://localhost:3000/department/dashboard
   ```

---

## 🏢 Created Departments

1. **ESOL Department** (ID: 1)
   - Description: English for Speakers of Other Languages Department
   - Status: Active, No head assigned yet

2. **General English Department**
   - Description: General English language instruction
   - Status: Active

3. **Exam Preparation Department**
   - Description: IELTS, TOEFL, and other exam preparation
   - Status: Active

---

## 🎯 Department Head Dashboard Features

### Main Navigation

| Page | URL | Description |
|------|-----|-------------|
| 📊 Dashboard | `/department/dashboard` | Overview of department performance |
| 👥 Teachers | `/department/teachers` | Manage department teachers |
| 🏫 Classes | `/department/classes` | View all department classes |
| 👨‍🎓 Students | `/department/students` | Monitor student progress |
| 📈 Analytics | `/department/analytics` | Department-level analytics |
| 📋 Reports | `/department/reports` | Generate department reports |
| 📚 Resources | `/department/resources` | Manage learning resources |
| ⚙️ Settings | `/department/dashboard/settings` | Configure department settings |

---

## 🔐 Department Head Permissions

### ✅ What Department Heads CAN Do:
- View all classes in their assigned department
- Monitor all students in department classes
- View teacher assignments (read-only)
- Generate analytics and reports for their department
- Access student progress data within their department
- View diagnostic test results for department students

### ❌ What Department Heads CANNOT Do:
- Edit teacher assignments (teacher privilege)
- Manage other departments
- Access system-level settings (admin privilege)
- Create or delete users (admin privilege)
- Modify organization settings (admin privilege)

---

## 🔍 Verification Commands

### Check Current Setup
```bash
npx tsx scripts/verify-department-head.ts
```

### Re-run Setup (if needed)
```bash
npx tsx scripts/init-department-head.ts
```

---

## 💡 Testing Tips

1. **Create Test Accounts for Full Testing:**
   - 1 Department Head (use invitation code above)
   - 2-3 Teachers (assign to department)
   - 5-10 Students (enroll in department classes)

2. **Assign Department Head to Department:**
   - After registration, the system admin can assign you as head of a department
   - Navigate to: System Admin → Departments → Edit → Select Head Teacher

3. **Create Sample Classes:**
   - Teachers can create classes
   - Assign classes to departments
   - Enroll students in classes

4. **Test Department Analytics:**
   - Students complete practice sessions
   - Teachers create assignments
   - Department Head views aggregated analytics

---

## 📊 Current Database Status

**Total Users by Role:**
- System Admin: 2
- School Admin: 2
- Teacher: 2
- Student: 2
- Parent: 2
- **Department Head: 0** (waiting for registration)

**Departments:**
- Total Active: 3
- With Assigned Head: 0

---

## 🚀 Next Steps

1. ✅ **Register using the invitation code above**
2. ✅ **Log in to your Department Head account**
3. ✅ **Explore the department dashboard**
4. ⬜ **Optional: Create test teachers and students**
5. ⬜ **Optional: Generate sample data for testing**

---

## 📞 Troubleshooting

### Issue: "Invalid invitation code"
- **Solution:** Copy the exact code: `DEPTHEAD-XRPTFM-A`
- Check for extra spaces or characters

### Issue: "Code already used 5 times"
- **Solution:** Run setup script again to generate new code:
  ```bash
  npx tsx scripts/init-department-head.ts
  ```

### Issue: "Cannot access department dashboard"
- **Check:** Are you logged in?
- **Check:** Is your role set to `department_head`?
- **Verify:** Run `npx tsx scripts/verify-department-head.ts`

### Issue: "No data showing in dashboard"
- **Expected:** This is normal for new accounts
- **Solution:** Create sample data using seed scripts:
  ```bash
  npx tsx scripts/seed-classroom-data.ts
  ```

---

## 🔗 Useful Links

- **Development Server:** http://localhost:3000
- **Department Dashboard:** http://localhost:3000/department/dashboard
- **Teachers Page:** http://localhost:3000/department/teachers
- **Students Page:** http://localhost:3000/department/students
- **Analytics:** http://localhost:3000/department/analytics

---

**Last Updated:** 2025-01-11
**Setup Script:** `scripts/init-department-head.ts`
**Verification Script:** `scripts/verify-department-head.ts`
