param(
    [string]$Title = "Claude Code",
    [string]$Message = "Notification",
    [string]$Icon = "",
    [int]$Duration = 5
)

# Use Windows Toast Notifications (Windows 10/11)
# These notifications auto-dismiss after a few seconds

[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

# Create XML for toast notification
$toastXml = @"
<toast duration="short">
    <visual>
        <binding template="ToastGeneric">
            <text>$Title</text>
            <text>$Message</text>
        </binding>
    </visual>
</toast>
"@

# Load XML
$xml = New-Object Windows.Data.Xml.Dom.XmlDocument
$xml.LoadXml($toastXml)

# Create toast notification
$toast = [Windows.UI.Notifications.ToastNotification]::new($xml)

# Set expiration time (auto-dismiss after Duration seconds)
$toast.ExpirationTime = [DateTimeOffset]::Now.AddSeconds($Duration)

# Show notification
$appId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show($toast)