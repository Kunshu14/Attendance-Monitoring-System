const fs = require('fs');

let content = fs.readFileSync('src/components/layout/TopBar.tsx', 'utf8');

content = content.replace("import { Menu, Bell, RefreshCw } from 'lucide-react';", 
"import { Menu, Bell, RefreshCw } from 'lucide-react';\nimport { ThemeToggle } from './ThemeToggle';");

content = content.replace(
  "{onRefresh && (",
  "<ThemeToggle />\n        {onRefresh && ("
);

fs.writeFileSync('src/components/layout/TopBar.tsx', content, 'utf8');
