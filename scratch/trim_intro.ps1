$orig = "public/assets/video/intro.mp4"

# Generate WebM desktop
ffmpeg -y -ss 1.5 -i $orig -t 3.3 -vf scale=1920:1080 -c:v libvpx-vp9 -crf 40 -b:v 0 -deadline realtime -cpu-used 8 -pix_fmt yuv420p -an public/assets/video/intro.webm

# Generate WebM mobile
ffmpeg -y -ss 1.5 -i $orig -t 3.3 -vf scale=1280:720 -r 30 -c:v libvpx-vp9 -crf 42 -b:v 0 -deadline realtime -cpu-used 8 -pix_fmt yuv420p -an public/assets/video/mobile/intro.webm

# Generate MP4 mobile
ffmpeg -y -ss 1.5 -i $orig -t 3.3 -vf scale=1280:720 -r 30 -c:v libx264 -crf 30 -pix_fmt yuv420p -an public/assets/video/mobile/intro.mp4

# Generate MP4 desktop (using temporary file)
ffmpeg -y -ss 1.5 -i $orig -t 3.3 -vf scale=1920:1080 -c:v libx264 -crf 28 -pix_fmt yuv420p -an public/assets/video/intro_temp.mp4
Move-Item -Path public/assets/video/intro_temp.mp4 -Destination $orig -Force

Write-Host "Intro trimmed successfully to 3.3s!" -ForegroundColor Green
