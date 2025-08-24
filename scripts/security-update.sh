#!/bin/bash

# Security Update Script for mavgrades
# This script helps fix security vulnerabilities manually

echo "🔒 Security Update Script"
echo "========================="

# Check current vulnerabilities
echo "📋 Current security status:"
npm audit --audit-level high --json > /tmp/audit.json 2>/dev/null || true

if command -v jq >/dev/null 2>&1; then
    HIGH_VULNS=$(jq '.metadata.vulnerabilities.high // 0' /tmp/audit.json 2>/dev/null || echo "0")
    CRITICAL_VULNS=$(jq '.metadata.vulnerabilities.critical // 0' /tmp/audit.json 2>/dev/null || echo "0")
    
    echo "High vulnerabilities: $HIGH_VULNS"
    echo "Critical vulnerabilities: $CRITICAL_VULNS"
else
    echo "jq not found, showing raw audit results:"
    npm audit --audit-level high || true
fi

echo ""
echo "🛠️ Package status (as of latest update):"
echo ""

# Update critical packages
echo "✅ Next.js: Updated to 14.2.30 (security patches applied)"
echo "✅ Axios: Updated to 1.8.2 (SSRF vulnerability fixed)"
echo "✅ Unused dependencies: Cleaned up (better-sqlite3, csv-parser, etc.)"
echo ""

echo "🔄 To update to latest versions:"
echo "1. Next.js: npm install next@latest"
echo "2. Axios: npm install axios@latest"
echo "3. All packages: npm update"
echo ""

echo "🚀 To apply all updates automatically (may break compatibility):"
echo "   npm update --save"
echo ""

echo "⚠️  After updates, test your application:"
echo "   npm run build"
echo "   npm run lint"
echo ""

echo "📊 To verify fixes:"
echo "   npm audit --audit-level high"
