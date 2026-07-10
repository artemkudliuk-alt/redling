# PowerShell script to optimize and convert all website videos to 1080p MP4 (H264 CRF 28) and WebM (VP9 CRF 32)
$videoDir = "f:\redline\public\assets\video"
$files = Get-ChildItem -Path $videoDir -Filter "*.mp4"

foreach ($file in $files) {
    $name = $file.BaseName
    $filePath = $file.FullName
    Write-Host "Processing video: $name..." -ForegroundColor Cyan

    if ($name -eq "intro") {
        # Trim intro.mp4 (cut 1.5s from start and 1.0s from end of the 7.016s new video)
        # Duration: 7.016667 - 2.5 = 4.516667 seconds
        Write-Host "Trimming and converting intro..." -ForegroundColor Green
        
        # 1. Output WebM
        ffmpeg -y -ss 1.5 -i $filePath -t 4.516667 -vf scale=1920:1080 -c:v libvpx-vp9 -crf 32 -b:v 0 -deadline realtime -cpu-used 8 -pix_fmt yuv420p -an "$videoDir\intro.webm"
        
        # 2. Output temporary MP4
        ffmpeg -y -ss 1.5 -i $filePath -t 4.516667 -vf scale=1920:1080 -c:v libx264 -crf 28 -pix_fmt yuv420p -an "$videoDir\intro_temp.mp4"
        
        # 3. Replace original
        Move-Item -Path "$videoDir\intro_temp.mp4" -Destination $filePath -Force
    } else {
        # Other loop/transition videos: downscale to 1080p, compress, and output WebM
        Write-Host "Downscaling and compressing loop video: $name..." -ForegroundColor Green
        
        # 1. Output WebM
        ffmpeg -y -i $filePath -vf scale=1920:1080 -c:v libvpx-vp9 -crf 32 -b:v 0 -deadline realtime -cpu-used 8 -pix_fmt yuv420p -an "$videoDir\$name.webm"
        
        # 2. Output temporary compressed MP4
        ffmpeg -y -i $filePath -vf scale=1920:1080 -c:v libx264 -crf 28 -pix_fmt yuv420p -an "$videoDir\${name}_temp.mp4"
        
        # 3. Replace original
        Move-Item -Path "$videoDir\${name}_temp.mp4" -Destination $filePath -Force
    }
}
Write-Host "All videos optimized successfully!" -ForegroundColor Green
