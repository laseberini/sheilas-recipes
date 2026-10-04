# Makes small copies of photos for places the site shows them small (list rows, page thumbnails, the home photo).
# Called by tools/build-site.mjs with a JSON file of jobs: [{ "src": "images/...", "dest": "images/thumbs/...", "w": 240 }].
# A copy is only (re)made when it's missing or older than its photo.
param([string]$Jobs)
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 80L

foreach ($job in (Get-Content -Raw $Jobs | ConvertFrom-Json)) {
  $src = Join-Path $root $job.src
  $dest = Join-Path $root $job.dest
  if ((Test-Path $dest) -and (Get-Item $dest).LastWriteTime -ge (Get-Item $src).LastWriteTime) { continue }
  New-Item -ItemType Directory -Force (Split-Path -Parent $dest) | Out-Null
  $img = [System.Drawing.Image]::FromFile($src)
  $w = [Math]::Min([int]$job.w, $img.Width)
  $h = [int][Math]::Round($img.Height * $w / $img.Width)
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($img, 0, 0, $w, $h)
  $g.Dispose()
  $img.Dispose()
  $bmp.Save($dest, $codec, $params)
  $bmp.Dispose()
  Write-Output "made $($job.dest)"
}
