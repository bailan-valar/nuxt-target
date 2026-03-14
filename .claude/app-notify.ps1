param(
    [Parameter(Mandatory=$false)]
    [string]$Content = "摆烂APP新版本已发布",

    [Parameter(Mandatory=$false)]
    [string]$AppToken = "AT_8E7zfaUNlizh3cwP6J1TdKiGjbD7WMEK",

    [Parameter(Mandatory=$false)]
    [string[]]$Uids = @("UID_S10SiMGozgLM7veRAJMDaaaFFI4V")
)

# Build the JSON payload
$payload = @{
    appToken = $AppToken
    content = $Content
    uids = $Uids
} | ConvertTo-Json -Compress

# Send the notification
try {
    $response = Invoke-RestMethod -Uri "https://wxpusher.zjiecode.com/api/send/message" `
        -Method Post `
        -ContentType "application/json" `
        -Body $payload

    Write-Host "Notification sent successfully: $Content"
    return $response
}
catch {
    Write-Error "Failed to send notification: $_"
    exit 1
}
