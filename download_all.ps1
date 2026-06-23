$urls = Get-Content "douban_urls.json" | ConvertFrom-Json
$outDir = "MosaicScreensaver\web\covers"

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir
}

$i = 0
foreach ($url in $urls) {
    $outFile = Join-Path $outDir "$i.jpg"
    try {
        Invoke-WebRequest -Uri $url -Headers @{
            'Referer'='https://book.douban.com/'; 
            'User-Agent'='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        } -OutFile $outFile -UseBasicParsing
        Write-Host "Downloaded $i.jpg"
    } catch {
        Write-Host "Failed to download $i.jpg : $($_.Exception.Message)"
    }
    $i++
    Start-Sleep -Milliseconds 100
}
