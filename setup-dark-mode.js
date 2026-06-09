const fs = require('fs');

let content = fs.readFileSync('src/app/globals.css', 'utf8');

// Add custom variant for dark mode class strategy
const customVariant = `
@custom-variant dark (&:where(.dark, .dark *));
`;

content = content.replace('@theme {', customVariant + '\n@theme {');

fs.writeFileSync('src/app/globals.css', content, 'utf8');
console.log('Added custom variant');
