# Supabase 登录快速修复脚本
# 运行此脚本来诊断和修复常见问题

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Supabase 登录问题诊断工具" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 1. 检查 .env.local 文件
Write-Host "[1/6] 检查 .env.local 文件..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    Write-Host "✓ .env.local 文件存在" -ForegroundColor Green
    $envContent = Get-Content .env.local -Raw
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL=https://.*\.supabase\.co") {
        Write-Host "✓ SUPABASE_URL 配置格式正确" -ForegroundColor Green
    } else {
        Write-Host "✗ SUPABASE_URL 配置可能不正确" -ForegroundColor Red
        Write-Host "  请检查格式: NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co" -ForegroundColor Yellow
    }
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=") {
        Write-Host "✓ SUPABASE_ANON_KEY 已配置" -ForegroundColor Green
    } else {
        Write-Host "✗ SUPABASE_ANON_KEY 未配置" -ForegroundColor Red
    }
} else {
    Write-Host "✗ .env.local 文件不存在！" -ForegroundColor Red
    Write-Host "  正在创建模板文件..." -ForegroundColor Yellow
    Copy-Item .env.local.example .env.local -ErrorAction SilentlyContinue
    if (Test-Path .env.local) {
        Write-Host "✓ 已创建 .env.local 模板" -ForegroundColor Green
        Write-Host "  请编辑此文件并填入你的 Supabase 凭证" -ForegroundColor Yellow
    }
}
Write-Host ""

# 2. 检查 Node.js 和 npm
Write-Host "[2/6] 检查 Node.js 环境..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "✓ Node.js 版本: $nodeVersion" -ForegroundColor Green
$npmVersion = npm --version
Write-Host "✓ npm 版本: $npmVersion" -ForegroundColor Green
Write-Host ""

# 3. 检查 Supabase 包
Write-Host "[3/6] 检查 Supabase 依赖..." -ForegroundColor Yellow
$packageJson = Get-Content package.json -Raw | ConvertFrom-Json
if ($packageJson.dependencies.'@supabase/supabase-js') {
    Write-Host "✓ @supabase/supabase-js 已安装" -ForegroundColor Green
} else {
    Write-Host "✗ @supabase/supabase-js 未安装" -ForegroundColor Red
    Write-Host "  正在安装..." -ForegroundColor Yellow
    npm install @supabase/supabase-js
}
Write-Host ""

# 4. 检查网络连接
Write-Host "[4/6] 检查网络连接..." -ForegroundColor Yellow
try {
    $response = Test-NetConnection supabase.com -Port 443 -WarningAction SilentlyContinue
    if ($response.TcpTestSucceeded) {
        Write-Host "✓ 可以连接到 supabase.com" -ForegroundColor Green
    } else {
        Write-Host "✗ 无法连接到 supabase.com" -ForegroundColor Red
        Write-Host "  请检查网络连接或防火墙设置" -ForegroundColor Yellow
    }
} catch {
    Write-Host "! 无法测试网络连接" -ForegroundColor Yellow
}
Write-Host ""

# 5. 检查开发服务器
Write-Host "[5/6] 检查开发服务器..." -ForegroundColor Yellow
$process = Get-Process -Name node -ErrorAction SilentlyContinue
if ($process) {
    Write-Host "! 检测到运行中的 Node 进程" -ForegroundColor Yellow
    Write-Host "  如果遇到问题，请重启开发服务器" -ForegroundColor Yellow
} else {
    Write-Host "○ 没有运行中的开发服务器" -ForegroundColor Gray
}
Write-Host ""

# 6. 提供修复建议
Write-Host "[6/6] 修复建议" -ForegroundColor Yellow
Write-Host ""
Write-Host "如果登录仍然失败，请按以下步骤操作：" -ForegroundColor Cyan
Write-Host ""
Write-Host "步骤 1: 配置 Supabase 凭证" -ForegroundColor White
Write-Host "  1. 访问 https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host "  2. 选择你的项目" -ForegroundColor Gray
Write-Host "  3. Settings > API" -ForegroundColor Gray
Write-Host "  4. 复制 URL 和 anon key 到 .env.local" -ForegroundColor Gray
Write-Host ""
Write-Host "步骤 2: 重启开发服务器" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "步骤 3: 清除浏览器缓存" -ForegroundColor White
Write-Host "  Ctrl+Shift+Delete > 清除缓存" -ForegroundColor Gray
Write-Host ""
Write-Host "步骤 4: 检查 Supabase 项目状态" -ForegroundColor White
Write-Host "  访问 Dashboard 确保项目没有被暂停" -ForegroundColor Gray
Write-Host ""

# 生成诊断报告
Write-Host "================================" -ForegroundColor Cyan
Write-Host "诊断完成！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "详细说明请查看: SUPABASE-LOGIN-FIX.md" -ForegroundColor Yellow
Write-Host ""
