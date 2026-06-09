const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = walkSync('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Backgrounds
  content = content.replace(/bg-\[#0a0f1e\](?:\/80)?/g, 'bg-page-bg'); // bg-[#0a0f1e]/80 in TopBar could be tricky, maybe backdrop-blur is enough
  content = content.replace(/bg-\[#0d1117\]/g, 'bg-panel-bg');
  content = content.replace(/bg-\[#111827\]/g, 'bg-panel-bg');
  content = content.replace(/bg-\[#1a2235\]/g, 'bg-panel-bg');
  
  // Borders
  content = content.replace(/border-white\/(?:\[0\.0[68]\]|10|\[0\.1\])/g, 'border-panel-border');
  
  // Hover Backgrounds (bg-white/alpha)
  content = content.replace(/bg-white\/(?:\[0\.0[456]\])/g, 'bg-panel-hover');
  
  // Text Colors
  // We want to avoid replacing text-white on buttons.
  // Buttons usually have classes like `bg-violet-500` or `bg-indigo-500` or `bg-gradient-to-br`.
  // Wait, I can just replace `text-white/alpha` easily:
  content = content.replace(/text-white\/(?:90|85|80)/g, 'text-fg-primary');
  content = content.replace(/text-white\/(?:70|60|55)/g, 'text-fg-secondary');
  content = content.replace(/text-white\/(?:50|40|35)/g, 'text-fg-tertiary');
  content = content.replace(/text-white\/(?:30|25|20)/g, 'text-fg-muted');
  
  // What about naked `text-white`?
  // Let's replace `text-white` with `text-fg-primary` EXCEPT when preceded by:
  // "bg-violet", "bg-indigo", "from-violet", "from-indigo"
  // Actually, there are only a few naked text-white. I can manually review them.
  
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Done replacement part 1');
