$repoRoot = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
Set-Location $repoRoot

$commitCount = git rev-list --count HEAD
if ($LASTEXITCODE -ne 0) {
  Write-Error "Git command failed. Make sure you run this from inside a git repository."
  exit 1
}

$version = "1.0.$commitCount"
$year = 2026

$versionFile = Join-Path $repoRoot 'version.js'
$versionContent = @"window.siteInfo = {
  version: "$version",
  year: $year,
};
"@

Set-Content -Path $versionFile -Value $versionContent -Encoding UTF8
Write-Host "Updated version.js to version $version (year $year)."