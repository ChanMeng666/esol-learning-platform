# 测试账户创建详细指南

## 📋 邀请码列表

以下是已生成的邀请码（有效期：永久）：

| 角色 | 邀请码 | 最大使用次数 |
|------|--------|--------------|
| **System Admin** (系统管理员) | `SYSADMIN-85KL9P-X` | 5 |
| **School Admin** (学校管理员) | `ADMIN-8B4AQH-T` | 10 |
| **Teacher** (教师) | `TEACHER-DC469Q-Z` | 20 |
| **Student** (学生) | `STUDENT-7YAZAL-9` | 无限制 |
| **Parent** (家长) | `PARENT-BWCZT8-N` | 50 |

---

## 🎯 推荐创建顺序

### 1️⃣ 系统管理员 (System Admin) - 最高权限

**邀请码**: `SYSADMIN-85KL9P-X`

**权限范围**:
- ✅ 访问所有功能
- ✅ 管理所有组织
- ✅ 创建/管理邀请码
- ✅ 查看所有用户数据
- ✅ 系统级配置

**注册步骤**:

1. 打开浏览器访问: http://localhost:3000
2. 点击 **"Get Started Free"** 按钮
3. 在邀请码输入框中输入: `SYSADMIN-85KL9P-X`
4. 点击 **"Continue to Registration"**
5. 填写 Stack Auth 注册表单:
   - **Email**: `sysadmin@test.com`
   - **Password**: `Test1234!` (或你自己的密码)
   - **Full Name**: `System Admin`
6. 点击 **"Sign Up"**
7. 等待自动跳转到回调页面
8. 自动重定向到仪表盘

**验证成功**:
- ✅ URL 应该是 `/dashboard`
- ✅ 顶部导航栏显示用户名 "System Admin"
- ✅ 可以访问 `/admin/invitations` 页面

---

### 2️⃣ 学校管理员 (School Admin) - 组织级权限

**邀请码**: `ADMIN-8B4AQH-T`

**权限范围**:
- ✅ 管理本组织用户
- ✅ 创建/管理邀请码
- ✅ 创建/管理班级
- ✅ 查看组织数据
- ✅ 管理教师和学生

**注册步骤**:

1. **重要**: 打开**新的无痕窗口** (Ctrl+Shift+N / Cmd+Shift+N)
2. 访问: http://localhost:3000
3. 点击 **"Get Started Free"**
4. 输入邀请码: `ADMIN-8B4AQH-T`
5. 点击 **"Continue to Registration"**
6. 填写注册信息:
   - **Email**: `admin@test.com`
   - **Password**: `Test1234!`
   - **Full Name**: `School Admin`
7. 完成注册并等待跳转

**验证成功**:
- ✅ 可以访问 `/admin/invitations`
- ✅ 可以创建新的邀请码
- ✅ 可以查看组织内用户列表

---

### 3️⃣ 教师 (Teacher) - 班级管理权限

**邀请码**: `TEACHER-DC469Q-Z`

**权限范围**:
- ✅ 创建/管理班级
- ✅ 创建/管理作业
- ✅ 查看学生进度
- ✅ 创建学生邀请码
- ✅ 生成诊断测试

**注册步骤**:

1. 打开**新的无痕窗口**
2. 访问: http://localhost:3000
3. 点击 **"Get Started Free"**
4. 输入邀请码: `TEACHER-DC469Q-Z`
5. 点击 **"Continue to Registration"**
6. 填写注册信息:
   - **Email**: `teacher@test.com`
   - **Password**: `Test1234!`
   - **Full Name**: `Test Teacher`
7. 完成注册

**验证成功**:
- ✅ URL 自动跳转到 `/teacher/dashboard`
- ✅ 可以访问 `/teacher/classes`
- ✅ 可以访问 `/teacher/assignments`
- ✅ 可以创建新班级

---

### 4️⃣ 学生 (Student) - 学习功能

**邀请码**: `STUDENT-7YAZAL-9`

**权限范围**:
- ✅ 访问所有学习模块
- ✅ 练习题目（NZCEL, CEFR, Speaking）
- ✅ AI Speaking Coach
- ✅ 查看个人进度
- ✅ 完成作业
- ✅ 参加诊断测试

**注册步骤**:

1. 打开**新的无痕窗口**
2. 访问: http://localhost:3000
3. 点击 **"Get Started Free"**
4. 输入邀请码: `STUDENT-7YAZAL-9`
5. 点击 **"Continue to Registration"**
6. 填写注册信息:
   - **Email**: `student@test.com`
   - **Password**: `Test1234!`
   - **Full Name**: `Test Student`
7. 完成注册

**验证成功**:
- ✅ URL 跳转到 `/dashboard`
- ✅ 可以访问 `/speaking` (AI Speaking Coach)
- ✅ 可以访问 `/practice/nzcel`
- ✅ 可以访问 `/practice/general`
- ✅ 可以看到进度追踪（Points, Streak）

---

### 5️⃣ 家长 (Parent) - 监控权限

**邀请码**: `PARENT-BWCZT8-N`

**权限范围**:
- ✅ 查看关联学生的进度
- ✅ 查看学生作业完成情况
- ✅ 查看学生学习统计
- ⚠️ 需要管理员手动关联到学生账户

**注册步骤**:

1. 打开**新的无痕窗口**
2. 访问: http://localhost:3000
3. 点击 **"Get Started Free"**
4. 输入邀请码: `PARENT-BWCZT8-N`
5. 点击 **"Continue to Registration"**
6. 填写注册信息:
   - **Email**: `parent@test.com`
   - **Password**: `Test1234!`
   - **Full Name**: `Test Parent`
7. 完成注册

**验证成功**:
- ✅ 注册成功并跳转到仪表盘
- ⚠️ 初始状态下看不到学生数据（需要管理员关联）

---

## 🔧 常见问题排查

### ❌ 问题：邀请码显示"Invalid"

**可能原因**:
- 输入错误（区分大小写，注意连字符）
- 邀请码已达到最大使用次数

**解决方案**:
1. 仔细检查邀请码拼写
2. 确保包含连字符（例如：`SYSADMIN-85KL9P-X`）
3. 如果超出使用次数，重新运行初始化脚本：
   ```bash
   npx tsx scripts/init-invitation-codes.ts
   ```

### ❌ 问题：注册后跳转到首页而不是仪表盘

**可能原因**:
- Stack Auth 配置问题
- 回调处理失败

**解决方案**:
1. 检查浏览器控制台是否有错误信息
2. 尝试手动访问 `/dashboard` 或 `/teacher/dashboard`
3. 检查是否已登录（顶部右侧应该有用户头像）

### ❌ 问题：无法访问管理页面

**可能原因**:
- 角色权限不足

**解决方案**:
1. 确认你使用的是系统管理员或学校管理员账户
2. 检查 Stack Auth 中的 `clientMetadata.role` 是否正确设置
3. 尝试退出登录后重新登录

### ❌ 问题："Organization context required"错误

**可能原因**:
- 用户记录未正确关联到组织

**解决方案**:
1. 检查数据库中 `users` 表是否有该用户记录
2. 确认 `organization_id` 字段不为空
3. 如果有问题，删除用户并重新注册

---

## 📊 验证所有账户

创建所有账户后，你可以进行以下验证：

### 1. 数据库验证

运行以下命令检查数据库：

```bash
# 查看所有用户
SELECT id, email, role, full_name FROM users;

# 查看邀请码使用情况
SELECT code, role, used_count, max_uses FROM invitation_codes;

# 查看邀请码使用记录
SELECT iu.*, u.email FROM invitation_usages iu
JOIN users u ON iu.user_id = u.id;
```

### 2. 功能验证清单

**系统管理员**:
- [ ] 可以访问 `/admin/invitations`
- [ ] 可以创建新邀请码
- [ ] 可以查看所有用户
- [ ] 可以停用/删除邀请码

**学校管理员**:
- [ ] 可以访问 `/admin/invitations`
- [ ] 可以创建邀请码
- [ ] 可以查看组织内用户

**教师**:
- [ ] 可以访问 `/teacher/dashboard`
- [ ] 可以创建班级
- [ ] 可以创建作业
- [ ] 可以创建学生邀请码（如果有权限）

**学生**:
- [ ] 可以访问 `/speaking`
- [ ] 可以访问 `/practice/nzcel`
- [ ] 可以访问 `/practice/general`
- [ ] 可以查看个人进度
- [ ] Points 和 Streak 显示正常

**家长**:
- [ ] 可以登录系统
- [ ] 显示正确的角色
- [ ] 等待管理员关联学生

---

## 🎨 推荐测试邮箱格式

为了方便管理，建议使用以下邮箱格式：

```
sysadmin@test.com     → 系统管理员
admin@test.com        → 学校管理员
teacher@test.com      → 教师
teacher2@test.com     → 第二个教师（如需要）
student@test.com      → 学生
student2@test.com     → 第二个学生
parent@test.com       → 家长
```

所有账户推荐使用相同密码：`Test1234!`（方便记忆）

---

## 🔄 重置所有测试数据

如果需要重新开始，可以运行清理脚本：

```bash
# 删除所有用户和数据
npx tsx scripts/cleanup-all-users.ts

# 重新生成邀请码
npx tsx scripts/init-invitation-codes.ts
```

---

## 📝 注意事项

1. **使用无痕窗口**: 每个账户都应该在新的无痕窗口中注册，避免 session 冲突
2. **不同邮箱**: 每个账户必须使用不同的邮箱地址
3. **Stack Auth 同步**: 确保 Stack Auth 配置正确，否则角色可能无法正确分配
4. **数据库连接**: 确保 `.env.local` 中的 `DATABASE_URL` 正确
5. **开发服务器**: 确保 `npm run dev` 正在运行

---

## 🚀 快速开始

如果你想最快速度创建所有测试账户，按照以下步骤操作：

```bash
# 1. 确保数据库已连接
# 2. 生成邀请码
npx tsx scripts/init-invitation-codes.ts

# 3. 启动开发服务器（如果未运行）
npm run dev

# 4. 打开浏览器
# 5. 依次创建所有角色账户（使用上述邀请码）
```

**时间估计**: 完成所有 5 个账户大约需要 **10-15 分钟**

---

## ✅ 完成后的下一步

创建所有测试账户后，你可以：

1. 测试各个角色的功能
2. 创建班级并添加学生
3. 创建作业并分配给学生
4. 测试 AI Speaking Coach
5. 测试进度追踪和统计
6. 测试邀请码管理功能

祝测试顺利！🎉
