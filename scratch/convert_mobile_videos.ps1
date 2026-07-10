$videoDir = "f:\redline\public\assets\video"
$mobileDir = "$videoDir\mobile"

if (!(Test-Path -Path $mobileDir)) {
    New-Item -ItemType Directory -Path $mobileDir | Out-Null
}

$files = Get-ChildItem -Path $videoDir -Filter "*.mp4"

foreach ($file in $files) {
    $name = $file.BaseName
    $filePath = $file.FullName
    Write-Host "Converting $name to mobile formats (720p, 30fps)..." -ForegroundColor Cyan
    
    # 1. Output mobile MP4: 720p, 30fps, CRF 30, no audio
    ffmpeg -y -i $filePath -vf "scale=1280:720" -r 30 -c:v libx264 -crf 30 -pix_fmt yuv420p -an "$mobileDir\$name.mp4"
    
    # 2. Output mobile WebM: 720p, 30fps, CRF 42, no audio
    ffmpeg -y -i $filePath -vf "scale=1280:720" -r 30 -c:v libvpx-vp9 -crf 42 -b:v 0 -deadline realtime -cpu-used 8 -pix_fmt yuv420p -an "$mobileDir\$name.webm"
}

Write-Host "Mobile videos converted successfully!" -ForegroundColor Green
