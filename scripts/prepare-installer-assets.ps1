param(
  [Parameter(Mandatory = $true)]
  [string]$InstallerPath
)

$sourcePath = [System.IO.Path]::GetFullPath($InstallerPath)
$downloadsPath = [System.IO.Path]::GetFullPath(
  (Join-Path $PSScriptRoot '..\public\downloads')
)
$chunkPath = [System.IO.Path]::GetFullPath((Join-Path $downloadsPath 'chunks'))

if (-not $chunkPath.StartsWith(
  $downloadsPath + [System.IO.Path]::DirectorySeparatorChar,
  [System.StringComparison]::OrdinalIgnoreCase
)) {
  throw 'Chunk target escaped the downloads directory.'
}

New-Item -ItemType Directory -Path $chunkPath -Force | Out-Null

$assembledPath = Join-Path $downloadsPath 'AutoVid-0.1.0-x64.exe'
if (Test-Path -LiteralPath $assembledPath) {
  Remove-Item -LiteralPath $assembledPath -Force
}

foreach ($existingPart in Get-ChildItem -LiteralPath $chunkPath -File -Filter 'AutoVid-0.1.0-x64.exe.part-*') {
  $resolvedPart = [System.IO.Path]::GetFullPath($existingPart.FullName)
  if (-not $resolvedPart.StartsWith(
    $chunkPath + [System.IO.Path]::DirectorySeparatorChar,
    [System.StringComparison]::OrdinalIgnoreCase
  )) {
    throw "Refusing to remove file outside the chunk directory: $resolvedPart"
  }
  Remove-Item -LiteralPath $resolvedPart -Force
}

$chunkSize = 24MB
$input = [System.IO.File]::OpenRead($sourcePath)
try {
  $index = 0
  $buffer = New-Object byte[] $chunkSize
  while (($read = $input.Read($buffer, 0, $buffer.Length)) -gt 0) {
    $partName = 'AutoVid-0.1.0-x64.exe.part-{0:D2}' -f $index
    $partFile = Join-Path $chunkPath $partName
    $output = [System.IO.File]::Create($partFile)
    try {
      $output.Write($buffer, 0, $read)
    } finally {
      $output.Dispose()
    }
    $index++
  }
} finally {
  $input.Dispose()
}

Get-ChildItem -LiteralPath $chunkPath -File |
  Select-Object Name, Length
