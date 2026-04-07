$files = Get-ChildItem -Path "app", "components" -Include *.tsx -Recurse

foreach ($file in $files) {
    if ($file.FullName -like "*node_modules*" -or $file.FullName -like "*.next*") { continue }
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # 1. Remove borders from elements that already have a surface background shift
    # Patterns like: bg-surface border border-outline/30
    $content = $content -replace 'bg-surface border border-outline/\d+', 'bg-surface'
    $content = $content -replace 'bg-surface-standard border border-outline/\d+', 'bg-surface-standard'
    $content = $content -replace 'bg-surface-low border border-outline/\d+', 'bg-surface-low'
    $content = $content -replace 'bg-surface-high border border-outline/\d+', 'bg-surface-high'
    
    # 2. Reduce opacity for remaining borders (Ghost Borders)
    $content = $content -replace 'border-outline/50', 'border-outline/20'
    $content = $content -replace 'border-outline/30', 'border-outline/10'
    $content = $content -replace 'border-outline/20', 'border-outline/10'
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName $content -Encoding UTF8
        Write-Host "Refined: $($file.FullName)"
    }
}
