# 🚀 Quick Reference - Gatekeeper Workflows

## 🎯 Common Commands

### Manual Triggers

| Action | Steps |
|--------|-------|
| **Run All Tests** | Actions → Gatekeeper → Run workflow → `run_workflows: all` |
| **Core Tests Only** | Actions → Gatekeeper → Run workflow → `run_workflows: test1,test2,test3` |
| **Force Deploy** | Actions → Gatekeeper → Run workflow → `force_deploy: true` |
| **Test Branch** | Actions → Gatekeeper → Run workflow → `ref: feature-branch` |

### Individual Workflows

| Workflow | Purpose | Manual Trigger |
|----------|---------|----------------|
| `test-1-lint.yml` | 📝 Linting | Actions → "Test-1 Linting" |
| `test-2-typecheck.yml` | 🔍 Type Check | Actions → "Test-2 Type Check" |
| `test-3-build.yml` | 🏗️ Build | Actions → "Test-3 Build" |
| `ci.yml` | 🔄 Full CI | Actions → "CI - Full Pipeline" |
| `security.yml` | 🔒 Security | Actions → "Security & Dependencies" |
| `deploy.yml` | 🚀 Deploy | Actions → "Deploy to Vercel" |

## 📊 Status Arrays

```json
// Core Tests
["PASSED", "PASSED", "PASSED"]     // ✅ All core tests passed
["FAILED", "SKIPPED", "SKIPPED"]   // ❌ Linting failed
["PASSED", "FAILED", "SKIPPED"]    // ❌ Type check failed  
["PASSED", "PASSED", "FAILED"]     // ❌ Build failed

// Full Pipeline  
["PASSED", "PASSED", "PASSED", "PASSED", "PASSED", "PASSED"]
// test1    test2     test3     ci      security  deploy
```

## ⚙️ Required Secrets

```bash
# For Vercel Deployment
VERCEL_TOKEN    # Vercel API token
ORG_ID         # Vercel organization ID
PROJECT_ID     # Vercel project ID
```

## 🔧 Local Testing

```bash
# Before pushing, run locally:
npm run lint          # Check linting
npx tsc --noEmit     # Check types  
npm run build        # Check build
```

## 🛡️ Gatekeeper Flow

```
Push/PR → Gatekeeper → Test-1 → Test-2 → Test-3 → CI & Security → Deploy → Report
```

## 🚨 Emergency Actions

| Issue | Solution |
|-------|----------|
| **All tests failing** | Run individual workflows to isolate |
| **Need urgent deploy** | Use `force_deploy: true` |
| **Test specific fix** | Use `ref: commit-hash` |
| **Skip security** | Use `run_workflows: test1,test2,test3,ci,deploy` |

---
💡 **Tip**: Check the full README.md for detailed documentation and troubleshooting.
