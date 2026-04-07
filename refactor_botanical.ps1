$mappings = @{
    '#0F0F13' = '#0c1511'
    '#1A1A24' = '#18221d'
    '#22222F' = '#232c27'
    '#2E2E3E' = '#3f4944'
    '#7C6FFF' = '#8fd4b9'
    '#F1F0FF' = '#dbe5de'
    '#9492B8' = '#90bfa8'
    '#5C5A7A' = '#3f4944'
    '#F87171' = '#93000a'
}

$files = Get-ChildItem -Path "app", "components", "lib", "hooks" -Include *.tsx, *.ts -Recurse -ErrorAction SilentlyContinue

foreach ($file in $files) {
    if ($file.FullName -like "*node_modules*" -or $file.FullName -like "*.next*") { continue }
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Apply color mappings
    foreach ($key in $mappings.Keys) {
        $content = [regex]::replace($content, [regex]::Escape($key), $mappings[$key], "IgnoreCase")
    }
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName $content -Encoding UTF8
        Write-Host "Updated: $($file.FullName)"
    }
}
