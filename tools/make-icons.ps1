# Makes the phone home-screen icons from Sheila's photo (a square crop around her face in "sheila profile.jpg").
# Usage: powershell -NoProfile -File tools/make-icons.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$src = [System.Drawing.Image]::FromFile((Join-Path $root "Recipe images\sheila profile.jpg"))
$crop = New-Object System.Drawing.Rectangle 727, 82, 573, 573   # her face and hair, from the 2048x1152 profile photo
$outDir = Join-Path $root "images\icons"
New-Item -ItemType Directory -Force $outDir | Out-Null

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/png" }
foreach ($size in 32, 180, 192, 512) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($src, (New-Object System.Drawing.Rectangle 0, 0, $size, $size), $crop, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $bmp.Save((Join-Path $outDir "sheila-$size.png"), $codec, $null)
  $bmp.Dispose()
  Write-Output "sheila-$size.png"
}
$src.Dispose()
