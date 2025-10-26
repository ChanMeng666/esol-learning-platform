# User Data Cleanup Guide

Complete guide for cleaning up all user data from the NZCEL ESOL platform.

## Overview

The cleanup system removes all user data from three locations:
1. **Neon PostgreSQL Database** - All user records and metadata
2. **Vercel Blob Storage** - All user audio files
3. **Stack Auth** - User authentication records (manual deletion required)

## What Gets Deleted

### ✅ Neon Database (Automatic)

**User Accounts & Profiles**
- `users` - All user records (except organization data)

**Learning Progress & Sessions**
- `user_progress` - NZCEL progress tracking
- `cefr_progress` - CEFR level progress
- `module_progress` - Module usage statistics
- `completed_questions` - Question completion history
- `achievements` - Achievement unlocks
- `badges` - Earned badges

**Practice & Conversation Data**
- `practice_sessions` - All practice sessions
- `session_answers` - Individual question answers
- `conversation_sessions` - Voice conversation sessions
- `conversation_turns` - Conversation dialogue history

**Audio & Recordings**
- `user_recordings` - Recording metadata
- `transcriptions` - Speech-to-text results
- `audio_files` - Audio file references (metadata only, files in Blob)

**AI Chat History**
- `copilot_conversations` - Chat conversation sessions
- `copilot_messages` - Individual chat messages

**Education & Class Data**
- `classes` - All classes
- `class_enrollments` - Student-class relationships
- `class_teachers` - Teacher assignments
- `student_groups` - Student groupings
- `student_group_members` - Group memberships

**Assignments & Submissions**
- `assignments` - All assignments
- `assignment_targets` - Assignment-class/student links
- `assignment_student_status` - Assignment progress
- `assignment_submissions` - Student submissions

**Diagnostic Tests**
- `student_diagnostic_attempts` - Test attempt records
- `diagnostic_question_responses` - Individual question responses
- `student_diagnostic_results` - Test results

**Analytics & Insights**
- `teacher_insights` - Teacher analytics
- `class_analytics` - Class performance data

**Permissions**
- `user_permissions` - User-specific permission overrides
- `parent_student_relationships` - Parent-child links

### ✅ Vercel Blob Storage (Automatic)

**User Audio Files**
- `audio/user-recordings/{userId}/` - All user voice recordings
- `audio/ai-responses/` - All AI-generated response audio files

**Optional (Currently Commented Out)**
- `audio/tts-cache/` - Text-to-speech cache (uncomment in code if needed)

### ❌ Preserved Data

**Neon Database**
- `organizations` - Organization records
- `departments` - Department structure
- `grade_levels` - Grade level definitions
- `diagnostic_tests` - Diagnostic test templates
- `diagnostic_test_sections` - Test section templates
- `diagnostic_test_questions` - Question templates
- `question_banks` - Question bank templates
- `question_bank_questions` - Bank questions
- `organization_question_access` - Question access permissions
- `role_permissions` - Role permission definitions

**Vercel Blob Storage**
- `audio/questions/` - Question audio files (permanent cache)

**Stack Auth**
- User authentication records (must be deleted manually)

## How to Use

### Step 1: Access Cleanup Tool

Navigate to:
```
http://localhost:3000/admin/cleanup-users
```

### Step 2: Check Current Status

1. Click **"Check Database Status"**
2. Review:
   - Total user count
   - Data distribution across tables
   - Individual user details

### Step 3: Execute Cleanup

1. Click **"Delete All Users"**
2. Type confirmation text: `DELETE ALL USERS`
3. Click **"Confirm Delete All"**
4. Wait for completion (may take several seconds)

### Step 4: Review Results

The tool will display:
- **Blob Storage Cleanup**: Number of audio files deleted
- **Database Records Deleted**: Count for each table
- **Deleted Users**: List of removed user accounts
- **Errors** (if any): Failed deletions with reasons

### Step 5: Manual Stack Auth Cleanup

1. Visit [Stack Auth Dashboard](https://app.stack-auth.com)
2. Select your project
3. Navigate to "Users" section
4. Delete all users manually

### Step 6: Verify Blob Storage

1. Visit [Vercel Blob Dashboard](https://vercel.com/storage/blob)
2. Check that user recordings are deleted:
   - `audio/user-recordings/` should be empty
   - `audio/ai-responses/` should be empty

### Step 7: Clear Browser Data

Clear browser cache and storage:
```
Chrome: Settings → Privacy → Clear browsing data
Firefox: Settings → Privacy → Clear Data
Edge: Settings → Privacy → Choose what to clear
```

Specifically clear:
- ✅ Cookies and site data
- ✅ Cached images and files
- ✅ Site settings
- ✅ Hosted app data

### Step 8: Test New User Flow

1. Register a new user
2. Verify login works
3. Check role assignment (should default to "student")
4. Verify dashboard redirect (should go to `/dashboard`)

## Cleanup Timeline

Estimated time for cleanup process:
- **Database cleanup**: 5-10 seconds (depends on data volume)
- **Blob cleanup**: 10-30 seconds (depends on number of audio files)
- **Stack Auth manual cleanup**: 1-2 minutes
- **Browser cache clear**: 1 minute
- **Testing new user**: 2-3 minutes

**Total estimated time**: ~5-10 minutes

## Safety Features

### Confirmation Required
- Must type exact confirmation text: `DELETE ALL USERS`
- Prevents accidental deletion

### Detailed Logging
- Console logs show progress
- UI displays detailed deletion statistics
- Errors are captured and displayed

### Graceful Error Handling
- Blob deletion errors don't stop database cleanup
- Each deletion is wrapped in try-catch
- Partial failures are reported clearly

### Organization Preservation
- Organizations are never deleted
- Allows re-creating users in same organization structure
- Question banks and test templates remain intact

## Troubleshooting

### Issue: Database cleanup succeeds but Blob cleanup fails

**Cause**: Vercel Blob API rate limit or network issue

**Solution**:
1. Check Vercel Blob dashboard manually
2. Re-run cleanup tool (safe to run multiple times)
3. Manually delete files from Vercel dashboard if needed

### Issue: Some database records remain

**Cause**: Foreign key constraints or orphaned records

**Solution**:
1. Check error messages for specific table
2. Review foreign key relationships in `schema.ts`
3. Run cleanup again (idempotent operation)

### Issue: Stack Auth users not deleted

**Cause**: This is expected - Stack Auth requires manual deletion

**Solution**:
1. This is normal behavior
2. Follow Step 5 to manually delete from Stack Auth dashboard
3. Stack Auth doesn't provide bulk delete API

### Issue: New users can't access dashboard after cleanup

**Cause**: Role not properly assigned

**Solution**:
1. Check `RoleGuard` components (should default to "student")
2. Verify new user has `clientMetadata.role` set
3. Check browser console for errors
4. Clear browser cache completely

## Best Practices

### Before Cleanup
1. ✅ Backup important data if needed
2. ✅ Inform other developers/users
3. ✅ Verify you're in correct environment (dev/staging, not production)
4. ✅ Review what will be deleted

### During Cleanup
1. ✅ Don't close browser tab while running
2. ✅ Wait for completion message
3. ✅ Review deletion statistics
4. ✅ Note any errors

### After Cleanup
1. ✅ Complete all post-cleanup steps
2. ✅ Test new user registration immediately
3. ✅ Verify role assignment logic
4. ✅ Test all user dashboards (student, teacher, etc.)

## Technical Details

### Deletion Order (Important!)

The cleanup follows this specific order to respect foreign key constraints:

```
0. Blob Storage (audio files)
1. CopilotKit messages & conversations
2. Conversation turns & sessions
3. Session answers & practice sessions
4. Transcriptions & user recordings
5. Completed questions, achievements, badges
6. Module progress, CEFR progress, user progress
7. Assignment submissions, status, targets, assignments
8. Diagnostic question responses, results, attempts
9. Teacher insights & class analytics
10. Student groups & memberships
11. Class enrollments & teachers
12. Classes
13. Parent-student relationships
14. User permissions
15. Users (final step)
```

### Blob Storage Paths

User data is stored in these Blob paths:
```
audio/user-recordings/{userId}/{sessionId}/*.webm
audio/ai-responses/{sessionId}/*.mp3
audio/tts-cache/*.mp3 (optional)
```

### Database Schema

43 total tables in database:
- 15 deleted during cleanup
- 28 preserved (templates, settings, organizations)

## Code References

- **Cleanup Script**: `/src/actions/cleanup-users.ts`
- **Admin UI**: `/src/app/admin/cleanup-users/page.tsx`
- **Blob Utils**: `/src/lib/blob/audio-storage.ts`
- **Database Schema**: `/src/lib/db/schema.ts`

## Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs for detailed error messages
3. Review this guide's Troubleshooting section
4. Check database schema for foreign key constraints
5. Consult CLAUDE.md for project architecture
