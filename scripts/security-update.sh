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
echo "🛠️ Recommended manual updates for known vulnerabilities:"
echo ""

# Update critical packages
echo "1. Updating Next.js (fixes DoS and cache poisoning):"
echo "   npm install next@latest"
echo ""

echo "2. Updating axios (fixes SSRF vulnerability):"
echo "   npm install axios@latest"
echo ""

echo "3. Updating form-data (fixes unsafe random function):"
echo "   npm install form-data@latest"
echo ""

echo "4. Updating @babel/runtime (fixes RegExp complexity):"
echo "   npm install @babel/runtime@latest"
echo ""

echo "5. For brace-expansion and tar-fs, update parent packages:"
echo "   npm update"
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
