$videoDir = "f:\redline\public\assets\video"
$files = Get-ChildItem -Path $videoDir -Filter "*.mp4"

foreach ($file in $files) {
    $name = $file.BaseName
    $filePath = $file.FullName
    Write-Host "Converting $name to WebM (CRF 40)..." -ForegroundColor Cyan
    
    # VP9 encoding with CRF 40 for optimal web compression and realtime speed
    ffmpeg -y -i $filePath -vf scale=1920:1080 -c:v libvpx-vp9 -crf 40 -b:v 0 -deadline realtime -cpu-used 8 -pix_fmt yuv420p -an "$videoDir\$name.webm"
}
Write-Host "All WebMs converted successfully!" -ForegroundColor Green
