# 快速启动指南

## 🚀 5分钟快速测试

### 步骤1: 环境准备

确保`.env.local`文件存在并包含所有必需的环境变量：

```bash
DATABASE_URL="postgresql://..."
STACK_SECRET_SERVER_KEY="..."
NEXT_PUBLIC_STACK_PROJECT_ID="..."
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="..."
BLOB_READ_WRITE_TOKEN="..."
OPENAI_API_KEY="..."
```

### 步骤2: 安装依赖和数据库迁移

```bash
# 安装依赖（如果还没有）
npm install

# 推送数据库schema
npm run drizzle:push
```

### 步骤3: 初始化测试数据

```bash
# 创建诊断测试数据
npx ts-node scripts/seed-diagnostic-tests.ts
```

### 步骤4: 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:3000

---

## 🧪 功能测试清单

### ✅ 测试诊断系统（学生端）

1. **访问**: http://localhost:3000/diagnostic
2. **操作**:
   - 查看可用测试（应该有2个）
   - 点击"Start Test"开始NZCEL测试
   - 回答几个问题
   - 点击"Finish Test"
   - 查看结果页面
3. **预期结果**:
   - 显示总体等级
   - 显示技能分数
   - 显示优势和改进领域
   - 显示学习建议

### ✅ 测试教师仪表板

**⚠️ 注意**: 需要先设置教师角色

#### 设置教师角色（临时方法）

使用数据库工具（如Neon控制台）运行：

```sql
-- 1. 查看当前用户
SELECT * FROM users WHERE email = 'your-email@example.com';

-- 2. 更新角色为teacher
UPDATE users
SET role = 'teacher'
WHERE email = 'your-email@example.com';
```

#### 测试流程

1. **访问**: http://localhost:3000/teacher/dashboard
2. **应该看到**:
   - 统计卡片（班级、学生、任务数）
   - 最近任务列表
   - 班级列表
   - 快速操作按钮

3. **访问**: http://localhost:3000/teacher/classes
4. **应该看到**:
   - 班级网格（如果有数据）
   - 搜索框
   - 摘要统计

---

## 🗄️ 创建测试数据（可选）

如果想要完整测试教师功能，需要创建一些测试数据：

### 方法1: 手动SQL（推荐用于快速测试）

```sql
-- 1. 创建一个组织（如果还没有）
INSERT INTO organizations (name, slug, subscription_tier, is_active)
VALUES ('Test School', 'test-school', 'pro', true)
RETURNING id;

-- 记下返回的organization_id，假设是1

-- 2. 创建一个班级
INSERT INTO classes (organization_id, name, teacher_id, academic_year, is_active)
VALUES (1, 'English 101', YOUR_USER_ID, '2024-2025', true)
RETURNING id;

-- 记下返回的class_id，假设是1

-- 3. 创建几个学生用户（需要先在Stack Auth注册）
-- 然后在users表中添加记录
INSERT INTO users (organization_id, stack_user_id, email, full_name, role, is_active)
VALUES
  (1, 'stack_user_id_1', 'student1@test.com', 'Student One', 'student', true),
  (1, 'stack_user_id_2', 'student2@test.com', 'Student Two', 'student', true);

-- 4. 将学生添加到班级
INSERT INTO class_enrollments (class_id, student_id, status)
VALUES
  (1, STUDENT_1_ID, 'active'),
  (1, STUDENT_2_ID, 'active');
```

### 方法2: 使用现有用户数据

如果你已经有一些用户进行了诊断测试或练习，教师仪表板应该能显示这些数据。

---

## 🔍 调试技巧

### 检查数据库数据

```sql
-- 查看所有诊断测试
SELECT * FROM diagnostic_tests;

-- 查看用户角色
SELECT id, email, full_name, role FROM users;

-- 查看班级
SELECT * FROM classes;

-- 查看诊断测试尝试
SELECT * FROM student_diagnostic_attempts;
```

### 查看Server Actions日志

在浏览器控制台检查网络请求和错误：
- 打开Chrome DevTools (F12)
- 切换到Network标签
- 筛选"Fetch/XHR"
- 查看Server Actions调用

### 常见错误

1. **"Organization context required"**
   - 问题：用户没有关联到组织
   - 解决：在users表中设置organization_id

2. **"Access denied: Teacher role required"**
   - 问题：用户角色不是teacher
   - 解决：更新users表的role字段

3. **"No tests available"**
   - 问题：诊断测试数据未初始化
   - 解决：运行seed脚本

---

## 📱 测试路由清单

### 学生端路由 ✅
- `/` - 主页
- `/diagnostic` - 诊断测试入口
- `/diagnostic/[testId]` - 测试进行中
- `/diagnostic/results/[attemptId]` - 测试结果
- `/practice/general` - 通用练习
- `/practice/nzcel` - NZCEL练习
- `/speaking` - AI口语教练
- `/dashboard` - 学生仪表板

### 教师端路由 ✅
- `/teacher/dashboard` - 教师概览
- `/teacher/classes` - 班级列表
- `/teacher/classes/[classId]` - 班级详情
- `/teacher/students/[studentId]` - 学生档案

### 教师端路由 ❌（待实现）
- `/teacher/assignments` - 任务列表
- `/teacher/assignments/[assignmentId]` - 任务详情

---

## 🎯 预期行为

### 诊断测试流程

1. **浏览测试** → 看到2个测试卡片
2. **开始测试** → 进入测试页面，显示第一题
3. **答题** → 进度条更新，可以前后导航
4. **完成测试** → 自动生成结果并跳转
5. **查看结果** → 显示等级、分数、分析
6. **查看历史** → 返回列表页，切换到History tab

### 教师仪表板流程

1. **登录为教师** → 访问teacher/dashboard
2. **查看概览** → 统计卡片显示汇总数据
3. **进入班级** → 点击班级卡片
4. **查看学生** → 看到学生列表和进度条
5. **学生详情** → 点击学生，查看完整档案

---

## 💡 提示

1. **使用Chrome DevTools**: 可以检查网络请求和控制台错误
2. **检查数据库**: 使用Neon控制台直接查看数据
3. **多用户测试**: 创建多个Stack Auth账户测试不同角色
4. **清理数据**: 测试完成后可以删除测试数据

---

## 📞 需要帮助？

查看完整实施总结: `IMPLEMENTATION_SUMMARY.md`

---

祝测试顺利！ 🎉
