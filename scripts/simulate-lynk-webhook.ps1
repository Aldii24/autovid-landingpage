param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[^\s@]+@[^\s@]+\.[^\s@]+$')]
  [string]$Email
)

$ErrorActionPreference = 'Stop'
$endpoint = 'https://www.autovid.my.id/api/webhooks/lynk'
$merchantKey = (Get-Clipboard -Raw).Trim()

if ([string]::IsNullOrWhiteSpace($merchantKey)) {
  throw 'Clipboard kosong. Klik Copy pada Merchant Key Lynk.id, lalu jalankan ulang script ini.'
}

# Remove the secret from the clipboard as soon as it has been read.
Set-Clipboard -Value ''

$suffix = [Guid]::NewGuid().ToString('N').Substring(0, 8)
$timestamp = [DateTimeOffset]::UtcNow.ToString('yyyyMMddHHmmss')
$refId = "AUTOVID-SIM-$timestamp-$suffix"
$messageId = "AUTOVID_SIM_$timestamp`_$suffix"
$amount = '150000'
$title = "AutoVid $([char]0x2014) Desktop AI Video Studio untuk Manhwa Recap & Faceless Video"

$payload = [ordered]@{
  event = 'payment.received'
  data = [ordered]@{
    message_action = 'SUCCESS'
    message_code = '0'
    message_data = [ordered]@{
      createdAt = [DateTimeOffset]::UtcNow.ToString('o')
      customer = [ordered]@{
        email = $Email
        name = 'AutoVid Test Buyer'
        phone = ''
      }
      items = @(
        [ordered]@{
          price = 150000
          qty = 1
          title = $title
          uuid = 'autovid-signed-simulation'
        }
      )
      refId = $refId
      totals = [ordered]@{
        grandTotal = 150000
      }
    }
    message_id = $messageId
  }
}

$signatureInput = "$amount$refId$messageId$merchantKey"
$sha256 = [System.Security.Cryptography.SHA256]::Create()
try {
  $signatureBytes = $sha256.ComputeHash([Text.Encoding]::UTF8.GetBytes($signatureInput))
} finally {
  $sha256.Dispose()
  $merchantKey = $null
  $signatureInput = $null
}
$signature = ([BitConverter]::ToString($signatureBytes)).Replace('-', '').ToLowerInvariant()
$json = $payload | ConvertTo-Json -Depth 10 -Compress

try {
  $response = Invoke-WebRequest `
    -Uri $endpoint `
    -Method Post `
    -ContentType 'application/json' `
    -Headers @{'X-Lynk-Signature' = $signature} `
    -Body $json `
    -UseBasicParsing
  Write-Host "Webhook simulation succeeded (HTTP $($response.StatusCode))." -ForegroundColor Green
  Write-Host "Reference: $refId"
  Write-Host "Response: $($response.Content)"
  Write-Host "Check inbox and spam for: $Email"
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  $body = ''
  if ($_.ErrorDetails.Message) {
    $body = $_.ErrorDetails.Message
  }
  throw "Webhook simulation failed (HTTP $status). $body"
}
