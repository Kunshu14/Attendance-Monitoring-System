const fs = require('fs');

let content = fs.readFileSync('src/app/layout.tsx', 'utf8');
content = content.replace(
  "import { Inter } from 'next/font/google';",
  "// import { Inter } from 'next/font/google';"
);
content = content.replace(
  "const inter = Inter({",
  "const inter = { variable: 'font-sans' }; /*"
);
content = content.replace(
  "  display: 'swap',\n});",
  "  display: 'swap',\n}); */"
);

fs.writeFileSync('src/app/layout.tsx', content, 'utf8');
