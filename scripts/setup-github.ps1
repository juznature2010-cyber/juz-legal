# Chay sau khi: gh auth login
# PowerShell: cd juz-legal; .\scripts\setup-github.ps1

$ErrorActionPreference = "Stop"
$repoName = "juz-legal"
$owner = "juznature2010-cyber"

Write-Host "`n=== Setup GitHub — JUZ Legal ===`n" -ForegroundColor Cyan

gh auth status | Out-Null

if (-not (git rev-parse --verify HEAD 2>$null)) {
    Write-Host "[LOI] Chua co commit. Chay git commit truoc." -ForegroundColor Red
    exit 1
}

$branch = git branch --show-current
if ($branch -ne "main") {
    git branch -M main
}

Write-Host "Tao repo GitHub (neu chua co)..." -ForegroundColor Yellow
$repoExists = gh repo view "$owner/$repoName" 2>$null
if (-not $repoExists) {
    gh repo create $repoName --public --source=. --remote=origin --description "Website JUZ Legal — Next.js + Supabase"
} else {
    if (-not (git remote get-url origin 2>$null)) {
        git remote add origin "https://github.com/$owner/$repoName.git"
    }
}

Write-Host "Push code..." -ForegroundColor Yellow
git push -u origin main

Write-Host "Tao GitHub Project (Kanban)..." -ForegroundColor Yellow
$projectUrl = gh project create --owner $owner --title "JUZ Legal — Dev Board" --format json | ConvertFrom-Json
$projectNumber = $projectUrl.number
Write-Host "Project #$projectNumber da tao"

$tasks = @(
    @{ title = "Cập nhật thông tin công ty (site.ts)"; body = "SĐT, email, địa chỉ thật trong src/lib/site.ts" },
    @{ title = "Thêm logo và ảnh OG"; body = "public/brand/logo.png, public/og-image.jpg (1200x630)" },
    @{ title = "Cập nhật nội dung đội ngũ & dịch vụ"; body = "Chỉnh src/lib/data.ts" },
    @{ title = "Viết nội dung blog đầy đủ"; body = "Mở rộng blogPosts trong data.ts" },
    @{ title = "Deploy Vercel + domain"; body = "Import repo, set env Supabase, gắn juzlegal.com" },
    @{ title = "Bật xác nhận email (production)"; body = "Supabase Auth → Confirm email ON trước khi public" }
)

$done = @(
    "Setup Next.js website",
    "Kết nối Supabase + SQL schema",
    "Đăng ký / đăng nhập Supabase Auth",
    "Form liên hệ & đặt lịch lưu DB",
    "Trang admin /admin"
)

Write-Host "Tao issues..." -ForegroundColor Yellow
foreach ($t in $tasks) {
    gh issue create --repo "$owner/$repoName" --title $t.title --body $t.body --label "task" 2>$null
}

Write-Host "`n[OK] Hoan tat!" -ForegroundColor Green
Write-Host "Repo:  https://github.com/$owner/$repoName"
Write-Host "Project: https://github.com/users/$owner/projects/$projectNumber"
Write-Host "`nVao Project → Settings → link repo $repoName de gan issues vao board.`n"
