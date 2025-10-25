# Multi-Tenant Migration Guide

本文档提供将 ESOL 平台从单租户架构迁移到多租户架构的完整步骤指南。

---

## 📋 迁移概述

### 已完成的工作

✅ **数据库 Schema 设计**
- 新增 27 张表（组织管理、诊断测试、任务管理、权限管理等）
- 修改 16 张现有表（添加 `organization_id` 字段）
- 完整的 TypeScript 类型定义

✅ **Server Actions**
- `src/actions/organizations.ts` - 组织管理
- `src/actions/users.ts` - 多租户用户管理

✅ **数据迁移脚本**
- `src/scripts/migrate-to-multi-tenant.ts` - 自动化迁移脚本

✅ **核心更新**
- `fetchWithDrizzle` 现在支持组织作用域
- 新增 `fetchWithDrizzleUnsafe` 用于系统级操作

---

## 🚀 迁移步骤

### ⚠️ 重要提示

1. **备份数据库**：在执行迁移前，务必备份您的生产数据库
2. **先在开发环境测试**：完整测试迁移流程后再应用到生产环境
3. **停止应用服务**：迁移期间应停止应用服务，避免数据不一致

---

### Step 1: 生成数据库迁移文件

```bash
npm run drizzle:generate
```

这将在 `drizzle/` 目录下生成 SQL 迁移文件。

**检查生成的迁移文件**，确保包含：
- 27 张新表的 `CREATE TABLE` 语句
- 16 张现有表的 `ALTER TABLE ADD COLUMN organization_id` 语句
- 所有相关索引的 `CREATE INDEX` 语句

---

### Step 2: 推送 Schema 到数据库

⚠️ **这将修改数据库结构，请确保已备份！**

```bash
npm run drizzle:push
```

此命令将：
- 创建 27 张新表
- 为 16 张现有表添加 `organization_id` 列（允许 NULL）
- 创建所有相关索引

**验证**：检查数据库，确认所有表已正确创建/修改。

---

### Step 3: 执行数据迁移

在 `package.json` 中添加迁移脚本（如果尚未添加）：

```json
{
  "scripts": {
    "migrate:multi-tenant": "tsx src/scripts/migrate-to-multi-tenant.ts"
  }
}
```

运行迁移脚本：

```bash
npm run migrate:multi-tenant
```

迁移脚本将：
1. ✅ 创建默认系统组织（slug: `default-system-org`）
2. ✅ 将所有现有用户迁移到 `users` 表
3. ✅ 为所有现有记录设置 `organization_id`

**预期输出**：
```
🚀 Starting multi-tenant migration...

Step 1: Creating default organization...
✅ Created default organization (ID: 1)

Step 2: Migrating users to enhanced users table...
Found 15 existing user progress records
✅ Migrated 15 users, skipped 0 existing users

Step 3: Updating existing records with organization_id...
✅ Updated 15 User Progress records
✅ Updated 230 Completed Questions records
✅ Updated 12 Badges records
...

🎉 Migration completed successfully!

⚠️  IMPORTANT: Please review migrated users and update:
   - Email addresses (currently placeholders)
   - Full names (currently placeholders)
   - User roles (currently all set to 'student')
```

---

### Step 4: 更新迁移后的用户信息

迁移脚本为现有用户创建了占位符数据。您需要更新：

#### 4.1 更新用户邮箱和姓名

可以通过 Stack Auth 数据或手动更新：

```typescript
// 示例：通过 Server Action 更新
import { updateEnhancedUser } from "@/actions/users";

// 获取 Stack Auth 用户信息并更新
const stackUser = await stackServerApp.getUser();
if (stackUser) {
  await updateEnhancedUser(enhancedUserId, {
    email: stackUser.email,
    fullName: stackUser.displayName || stackUser.email,
  });
}
```

#### 4.2 更新用户角色

根据实际情况更新用户角色：

```typescript
import { updateUserRole } from "@/actions/users";

// 将特定用户设置为管理员
await updateUserRole(userId, "school_admin");

// 将教师用户设置为教师角色
await updateUserRole(teacherId, "teacher");
```

---

### Step 5: 验证迁移结果

运行以下检查确保迁移成功：

#### 5.1 检查组织

```sql
SELECT * FROM organizations;
```

应该看到默认组织记录。

#### 5.2 检查用户表

```sql
SELECT id, organization_id, stack_user_id, email, role FROM users LIMIT 10;
```

确认所有用户都有 `organization_id`。

#### 5.3 检查现有表

```sql
SELECT COUNT(*) as total,
       COUNT(organization_id) as with_org_id
FROM user_progress;
```

`total` 和 `with_org_id` 应该相等。

对其他表重复此检查：
- `completed_questions`
- `practice_sessions`
- `conversation_sessions`
- 等等

---

## 🔄 回滚步骤（如果需要）

如果迁移出现问题，可以回滚：

### 回滚数据库

```bash
# 1. 恢复数据库备份
# (具体命令取决于您的数据库备份方式)

# 2. 或者删除 organization_id 列（谨慎操作！）
npm run drizzle:drop
```

---

## 📊 迁移后的系统架构

### 核心变更

1. **用户认证流程**
   - Stack Auth 用户 → `users` 表（扩展信息）
   - 每个用户关联一个组织
   - 用户拥有特定角色（system_admin, school_admin, teacher, student, parent）

2. **数据隔离**
   - 所有用户数据按 `organization_id` 隔离
   - `fetchWithDrizzle` 自动提供组织作用域

3. **新增功能**
   - 诊断测试系统
   - 教师任务管理
   - 家长参与功能
   - 教师洞察与分析
   - 基于角色的权限控制（RBAC）
   - 灵活的题库管理

---

## 🛠️ 后续开发任务

迁移完成后，需要实施以下功能：

### Phase 3: 更新现有 Server Actions

需要更新以适配多租户：
- ✅ `src/actions/user-progress.ts` - 添加组织作用域
- ✅ `src/actions/sessions.ts` - 添加组织作用域
- ✅ `src/actions/audio.ts` - 支持组织级音频缓存
- ✅ `src/actions/recordings.ts` - 组织隔离

### Phase 4: 实现新功能 Server Actions

1. **诊断测试系统**
   - `src/actions/diagnostic-tests.ts`
   - 测试创建、管理、评分

2. **教师任务管理**
   - `src/actions/assignments.ts`
   - 任务创建、分配、提交、评分

3. **权限管理**
   - `src/actions/permissions.ts`
   - RBAC 权限检查中间件

4. **教师洞察**
   - `src/actions/insights.ts`
   - 自动生成教学建议

### Phase 5: 前端界面

1. 组织管理界面
2. 用户管理界面（按角色）
3. 班级和部门管理
4. 诊断测试界面
5. 教师任务管理界面
6. 家长查看界面

---

## 📞 支持与问题排查

### 常见问题

**Q: 迁移后用户无法登录？**
A: 确保 `users` 表中存在对应的 `stack_user_id` 记录。检查 `fetchWithDrizzle` 是否正确获取了组织 ID。

**Q: 现有数据无法访问？**
A: 检查 `organization_id` 是否已正确设置。运行：
```sql
SELECT table_name, COUNT(*) FILTER (WHERE organization_id IS NULL) as null_count
FROM user_progress
GROUP BY 1;
```

**Q: 如何添加新组织？**
A: 使用 `createOrganization` Server Action：
```typescript
await createOrganization({
  name: "新学校名称",
  slug: "new-school-slug",
  subscriptionTier: "pro",
  maxStudents: 500,
});
```

**Q: 如何将用户分配到不同组织？**
A: 更新用户的 `organizationId`：
```typescript
await updateUser(userId, {
  organizationId: newOrganizationId,
});
```

---

## 🎯 成功指标

迁移成功的标志：

✅ 所有现有用户都在 `users` 表中
✅ 所有记录都有有效的 `organization_id`
✅ 用户可以正常登录和访问数据
✅ 数据在组织之间正确隔离
✅ 现有功能正常运行（练习、对话、进度追踪等）

---

## 📝 检查清单

在宣布迁移完成前，请检查：

- [ ] 数据库备份已完成
- [ ] Schema 迁移成功（27 张新表 + 16 张表修改）
- [ ] 数据迁移脚本成功运行
- [ ] 所有用户都有 `organization_id`
- [ ] 所有现有记录都有 `organization_id`
- [ ] 用户信息已更新（邮箱、姓名、角色）
- [ ] 测试登录和数据访问
- [ ] 测试数据隔离（不同组织看不到彼此数据）
- [ ] 现有功能测试通过
- [ ] 性能测试通过

---

**最后更新**: 2025-01-25
**版本**: 1.0.0
