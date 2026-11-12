# Lightweight Local HTTP Server using .NET HttpListener
# No Python, Node.js, or external tools required!

$port = 8080
$prefix = "http://localhost:$port/"
$baseDir = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    $port = 8888
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  TechPulse Blog Application Local Server Started!        " -ForegroundColor Green
Write-Host "  Server URL: $prefix" -ForegroundColor Yellow
Write-Host "  Serving from: $baseDir" -ForegroundColor Gray
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Magenta
Write-Host "==========================================================" -ForegroundColor Cyan

# Open default browser
Start-Process $prefix

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".md"   = "text/markdown; charset=utf-8"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawPath)) {
            $rawPath = "index.html"
        }

        # URL decode path and normalize
        $decodedPath = [System.Uri]::UnescapeDataString($rawPath).Replace('/', '\')
        $filePath = Join-Path $baseDir $decodedPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $contentType

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundHtml = "<h1>404 - File Not Found</h1><p>The requested URL '$rawPath' was not found.</p><a href='/'>Go to Home</a>"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($notFoundHtml)
            $response.ContentType = "text/html"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }

        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
    Write-Host "`nServer stopped." -ForegroundColor Yellow
}
