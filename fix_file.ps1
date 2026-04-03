$filePath = "c:\Users\pradip babar\Desktop\orionmarketing\src\pages\Home.jsx"
$newContentPath = "c:\Users\pradip babar\Desktop\orionmarketing\tmp_airplane.jsx"
$lines = Get-Content $filePath
# Lines 1-183 (0 to 182)
$header = $lines[0..182] 
$insert = Get-Content $newContentPath
# Lines 229 to end (228 to length-1)
$footer = $lines[228..($lines.Length-1)]
$newLines = $header + $insert + $footer
$newLines | Set-Content $filePath -Encoding UTF8
